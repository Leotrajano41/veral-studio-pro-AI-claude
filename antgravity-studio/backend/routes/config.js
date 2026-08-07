const express = require('express');
const router = express.Router();
const { UserConfig } = require('../models');

const DEFAULT_SERIAL = 'AG-2026-PRO-7X4K';

// GET /api/config — obter configuração do usuário
router.get('/', async (req, res) => {
  try {
    const [config] = await UserConfig.findOrCreate({
      where: { serial: DEFAULT_SERIAL },
      defaults: { serial: DEFAULT_SERIAL },
    });
    return res.json({ success: true, data: config });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/config — atualizar configuração
router.patch('/', async (req, res) => {
  try {
    const [config] = await UserConfig.findOrCreate({
      where: { serial: DEFAULT_SERIAL },
      defaults: { serial: DEFAULT_SERIAL },
    });
    const allowed = [
      'apiOpenai', 'apiAssembly', 'apiPixabay', 'apiPexels',
      'apiGoogleCloud', 'apiOpenrouter', 'apiYoutube',
      'pastaMusicaFundo', 'pastaDestino', 'pastaVideosCustom',
      'defaultLanguage', 'defaultVoiceProvider', 'defaultResolution',
      'defaultFps', 'maxParallelJobs', 'theme',
    ];
    const updates = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    }
    await config.update(updates);
    return res.json({ success: true, data: config });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
