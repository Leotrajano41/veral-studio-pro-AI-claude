const express = require('express');
const router = express.Router();
const { Project, ApiKey } = require('../models');

// Helper: buscar chave OpenAI ativa
async function getOpenAIKey() {
  const record = await ApiKey.findOne({ where: { service: 'openai', is_active: true } });
  return record?.keyValue || process.env.OPENAI_API_KEY || null;
}

// POST /api/scripts/generate — gerar roteiro via OpenAI
router.post('/generate', async (req, res) => {
  try {
    const { projectId, topic, niche, tone, duration, targetAudience, language, keywords } = req.body;

    const apiKey = await getOpenAIKey();
    if (!apiKey) {
      return res.status(400).json({ success: false, error: 'Chave OpenAI não configurada. Acesse Configurações > APIs.' });
    }

    const wordCount = Math.round((duration || 60) * 2.5); // ~150 palavras/min
    const prompt = `Você é um roteirista profissional de vídeos virais. 
Crie um roteiro para vídeo no estilo narração de ${wordCount} palavras sobre:

- Tópico: ${topic || niche}
- Nicho: ${niche}
- Tom: ${tone || 'profissional'}
- Público-alvo: ${targetAudience || 'geral'}
- Idioma: ${language || 'pt-BR'}
- Palavras-chave: ${(keywords || []).join(', ')}

Estrutura OBRIGATÓRIA:
[GANCHO] - Primeiros 5 segundos que prendem atenção
[DESENVOLVIMENTO] - Corpo principal com informações valiosas
[CTA] - Chamada para ação final

Escreva APENAS o roteiro, sem marcadores de cena nem indicações técnicas. Texto natural para narração.`;

    const { default: OpenAI } = require('openai');
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const script = completion.choices[0].message.content;

    // Salvar no projeto se projectId fornecido
    if (projectId) {
      await Project.update({ scriptContent: script, pipelineStep: 'narration' }, { where: { id: projectId } });
    }

    return res.json({
      success: true,
      data: {
        script,
        wordCount: script.split(/\s+/).length,
        estimatedDuration: Math.round(script.split(/\s+/).length / 2.5),
        model: 'gpt-4o-mini',
      },
    });
  } catch (err) {
    const msg = err?.error?.message || err.message;
    return res.status(500).json({ success: false, error: msg });
  }
});

// GET /api/scripts/:projectId — buscar roteiro salvo
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId, {
      attributes: ['id', 'name', 'scriptContent', 'pipelineStep', 'topic', 'niche'],
    });
    if (!project) return res.status(404).json({ success: false, error: 'Projeto não encontrado.' });
    return res.json({ success: true, data: { script: project.scriptContent, project } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/scripts/:projectId — salvar roteiro editado
router.put('/:projectId', async (req, res) => {
  try {
    const { script } = req.body;
    await Project.update({ scriptContent: script }, { where: { id: req.params.projectId } });
    return res.json({ success: true, message: 'Roteiro salvo com sucesso.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
