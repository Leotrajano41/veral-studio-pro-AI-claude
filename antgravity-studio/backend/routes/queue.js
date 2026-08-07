const express = require('express');
const router = express.Router();
const { QueueJob, Project } = require('../models');

// GET /api/queue — listar todos os jobs
router.get('/', async (req, res) => {
  try {
    const { status, type, limit = 50, offset = 0 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const jobs = await QueueJob.findAndCountAll({
      where,
      include: [{ model: Project, as: 'project', attributes: ['id', 'name', 'niche'] }],
      order: [['priority', 'DESC'], ['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.json({ success: true, data: jobs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/queue/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await QueueJob.findByPk(req.params.id, {
      include: [{ model: Project, as: 'project', attributes: ['id', 'name'] }],
    });
    if (!job) return res.status(404).json({ success: false, error: 'Job não encontrado.' });
    return res.json({ success: true, data: job });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue — criar job
router.post('/', async (req, res) => {
  try {
    const { projectId, type, title, priority, config } = req.body;
    if (!type) return res.status(400).json({ success: false, error: 'Campo type é obrigatório.' });

    const job = await QueueJob.create({ projectId, type, title, priority: priority || 5, config: config || {} });
    return res.status(201).json({ success: true, data: job });
  } catch (err) {
    return res.status(422).json({ success: false, error: err.message });
  }
});

// PATCH /api/queue/:id — atualizar status/progresso
router.patch('/:id', async (req, res) => {
  try {
    const job = await QueueJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, error: 'Job não encontrado.' });

    const { status, progress, logs, output, errorMessage } = req.body;
    const updates = {};

    if (status !== undefined) {
      updates.status = status;
      if (status === 'running' && !job.startedAt) updates.startedAt = new Date();
      if (['done', 'error', 'cancelled'].includes(status)) updates.finishedAt = new Date();
    }
    if (progress !== undefined) updates.progress = progress;
    if (logs !== undefined) updates.logs = [...(job.logs || []), ...logs];
    if (output !== undefined) updates.output = output;
    if (errorMessage !== undefined) updates.errorMessage = errorMessage;

    await job.update(updates);
    return res.json({ success: true, data: job });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/queue/:id — cancelar/remover
router.delete('/:id', async (req, res) => {
  try {
    const job = await QueueJob.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, error: 'Job não encontrado.' });
    if (job.status === 'running') {
      await job.update({ status: 'cancelled', finishedAt: new Date() });
    } else {
      await job.destroy();
    }
    return res.json({ success: true, message: 'Job cancelado/removido.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
