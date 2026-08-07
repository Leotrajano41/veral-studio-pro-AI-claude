const express = require('express');
const router = express.Router();
const { ApiKey } = require('../models');

const SERVICES = ['openai', 'assemblyai', 'pixabay', 'pexels', 'google_cloud', 'openrouter', 'youtube', 'meta_ai', 'kie_ai', 'elevenlabs'];

// GET /api/apikeys — listar todas as chaves
router.get('/', async (req, res) => {
  try {
    const keys = await ApiKey.findAll({ order: [['service', 'ASC']] });
    // Mascarar chave para exibição
    const masked = keys.map((k) => ({
      ...k.toJSON(),
      keyValue: k.keyValue ? `${k.keyValue.slice(0, 6)}${'*'.repeat(Math.max(0, k.keyValue.length - 10))}${k.keyValue.slice(-4)}` : '',
    }));
    return res.json({ success: true, data: masked });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/apikeys — salvar/atualizar chave
router.post('/', async (req, res) => {
  try {
    const { service, keyValue, label, config } = req.body;
    if (!service || !keyValue) return res.status(400).json({ success: false, error: 'service e keyValue são obrigatórios.' });
    if (!SERVICES.includes(service)) return res.status(400).json({ success: false, error: `Serviço inválido. Use: ${SERVICES.join(', ')}` });

    const [key, created] = await ApiKey.findOrCreate({
      where: { service },
      defaults: { service, keyValue, label, config: config || {}, status: 'untested' },
    });

    if (!created) {
      await key.update({ keyValue, label, config: config || key.config, status: 'untested', lastTestedAt: null });
    }

    return res.status(created ? 201 : 200).json({ success: true, data: { id: key.id, service, label, status: key.status }, message: created ? 'Chave criada.' : 'Chave atualizada.' });
  } catch (err) {
    return res.status(422).json({ success: false, error: err.message });
  }
});

// POST /api/apikeys/:service/test — testar conexão
router.post('/:service/test', async (req, res) => {
  try {
    const { service } = req.params;
    const key = await ApiKey.findOne({ where: { service } });
    if (!key) return res.status(404).json({ success: false, error: 'Chave não encontrada para este serviço.' });

    let status = 'connected';
    let errorMsg = null;

    try {
      if (service === 'openai') {
        const { default: OpenAI } = require('openai');
        const client = new OpenAI({ apiKey: key.keyValue });
        await client.models.list();
      } else if (service === 'pixabay') {
        const axios = require('axios');
        await axios.get(`https://pixabay.com/api/?key=${key.keyValue}&q=test&per_page=3`);
      } else if (service === 'pexels') {
        const axios = require('axios');
        await axios.get('https://api.pexels.com/v1/search?query=test&per_page=1', {
          headers: { Authorization: key.keyValue },
        });
      } else {
        // Para outros serviços, apenas marca como conectado se a chave tem formato válido
        if (key.keyValue.length < 8) throw new Error('Chave muito curta — formato inválido.');
      }
    } catch (testErr) {
      status = 'error';
      errorMsg = testErr?.response?.data?.error || testErr.message;
    }

    await key.update({ status, lastTestedAt: new Date(), lastErrorMsg: errorMsg });
    return res.json({ success: status === 'connected', data: { service, status, errorMsg } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/apikeys/:service — remover chave
router.delete('/:service', async (req, res) => {
  try {
    const key = await ApiKey.findOne({ where: { service: req.params.service } });
    if (!key) return res.status(404).json({ success: false, error: 'Chave não encontrada.' });
    await key.destroy();
    return res.json({ success: true, message: 'Chave removida.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
