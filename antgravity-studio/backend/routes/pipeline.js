const express = require('express');
const router = express.Router();
const { Project, QueueJob } = require('../models');

const PIPELINE_STEPS = ['script', 'narration', 'media', 'render', 'thumbnail', 'publish'];

// POST /api/pipeline/start — iniciar pipeline mágico completo
router.post('/start', async (req, res) => {
  try {
    const { projectId, steps = PIPELINE_STEPS } = req.body;

    if (!projectId) return res.status(400).json({ success: false, error: 'projectId é obrigatório.' });

    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ success: false, error: 'Projeto não encontrado.' });

    // Criar jobs para cada etapa selecionada
    const jobs = [];
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const job = await QueueJob.create({
        projectId,
        type: step,
        title: `${project.name} — ${step.charAt(0).toUpperCase() + step.slice(1)}`,
        priority: 10 - i, // Prioridade decrescente para manter ordem
        status: i === 0 ? 'pending' : 'pending',
        config: { step, order: i + 1, total: steps.length },
      });
      jobs.push(job);
    }

    await project.update({ pipelineStep: 'script', status: 'in_progress' });

    return res.status(201).json({
      success: true,
      message: `Pipeline iniciado com ${jobs.length} etapas.`,
      data: { projectId, jobs, steps },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/pipeline/:projectId/status — status completo do pipeline
router.get('/:projectId/status', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId, {
      attributes: ['id', 'name', 'status', 'pipelineStep', 'scriptContent', 'narrationUrl', 'thumbnailUrl', 'outputVideoUrl'],
    });
    if (!project) return res.status(404).json({ success: false, error: 'Projeto não encontrado.' });

    const jobs = await QueueJob.findAll({
      where: { projectId },
      order: [['created_at', 'ASC']],
    });

    const totalJobs = jobs.length;
    const doneJobs = jobs.filter((j) => j.status === 'done').length;
    const overallProgress = totalJobs > 0 ? Math.round((doneJobs / totalJobs) * 100) : 0;

    return res.json({
      success: true,
      data: {
        project,
        jobs,
        stats: { total: totalJobs, done: doneJobs, progress: overallProgress },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/pipeline/:projectId/reset — resetar pipeline
router.post('/:projectId/reset', async (req, res) => {
  try {
    const { projectId } = req.params;
    await QueueJob.destroy({ where: { projectId }, force: true });
    await Project.update({ pipelineStep: 'idle', status: 'draft' }, { where: { id: projectId } });
    return res.json({ success: true, message: 'Pipeline resetado.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
