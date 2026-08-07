const express = require('express');
const router = express.Router();
const { Voice } = require('../models');

// GET /api/voices — listar vozes
router.get('/', async (req, res) => {
  try {
    const { provider, language, isCloned } = req.query;
    const where = { isActive: true };
    if (provider) where.provider = provider;
    if (language) where.language = language;
    if (isCloned !== undefined) where.isCloned = isCloned === 'true';

    const voices = await Voice.findAll({ where, order: [['is_default', 'DESC'], ['name', 'ASC']] });
    return res.json({ success: true, data: voices });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/voices/:id
router.get('/:id', async (req, res) => {
  try {
    const voice = await Voice.findByPk(req.params.id);
    if (!voice) return res.status(404).json({ success: false, error: 'Voz não encontrada.' });
    return res.json({ success: true, data: voice });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/voices — criar voz
router.post('/', async (req, res) => {
  try {
    const voice = await Voice.create(req.body);
    return res.status(201).json({ success: true, data: voice });
  } catch (err) {
    return res.status(422).json({ success: false, error: err.message });
  }
});

// PUT /api/voices/:id
router.put('/:id', async (req, res) => {
  try {
    const voice = await Voice.findByPk(req.params.id);
    if (!voice) return res.status(404).json({ success: false, error: 'Voz não encontrada.' });
    await voice.update(req.body);
    return res.json({ success: true, data: voice });
  } catch (err) {
    return res.status(422).json({ success: false, error: err.message });
  }
});

// DELETE /api/voices/:id
router.delete('/:id', async (req, res) => {
  try {
    const voice = await Voice.findByPk(req.params.id);
    if (!voice) return res.status(404).json({ success: false, error: 'Voz não encontrada.' });
    await voice.destroy();
    return res.json({ success: true, message: 'Voz removida.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/voices/seed — popular vozes padrão Google TTS
router.post('/seed', async (req, res) => {
  try {
    const defaultVoices = [
      { name: 'Fernanda (BR)', provider: 'google', language: 'pt-BR', gender: 'female', voiceId: 'pt-BR-Standard-A', isDefault: true },
      { name: 'Ricardo (BR)', provider: 'google', language: 'pt-BR', gender: 'male', voiceId: 'pt-BR-Standard-B' },
      { name: 'Ana (BR) — Wavenet', provider: 'google', language: 'pt-BR', gender: 'female', voiceId: 'pt-BR-Wavenet-A', style: 'natural' },
      { name: 'Carlos (BR) — Wavenet', provider: 'google', language: 'pt-BR', gender: 'male', voiceId: 'pt-BR-Wavenet-B', style: 'natural' },
      { name: 'Alloy (EN)', provider: 'openai', language: 'en-US', gender: 'neutral', voiceId: 'alloy' },
      { name: 'Echo (EN)', provider: 'openai', language: 'en-US', gender: 'male', voiceId: 'echo' },
      { name: 'Nova (EN)', provider: 'openai', language: 'en-US', gender: 'female', voiceId: 'nova' },
      { name: 'Onyx (EN)', provider: 'openai', language: 'en-US', gender: 'male', voiceId: 'onyx' },
    ];

    const created = [];
    for (const v of defaultVoices) {
      const [voice, wasCreated] = await Voice.findOrCreate({
        where: { voiceId: v.voiceId, provider: v.provider },
        defaults: v,
      });
      if (wasCreated) created.push(voice.name);
    }

    return res.json({ success: true, message: `${created.length} vozes criadas.`, data: created });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
