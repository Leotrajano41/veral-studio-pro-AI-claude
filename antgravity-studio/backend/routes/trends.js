const express = require('express');
const router = express.Router();
const axios = require('axios');
const { ApiKey } = require('../models');

async function getKey(service) {
  const rec = await ApiKey.findOne({ where: { service, is_active: true } });
  return rec?.keyValue || null;
}

// GET /api/trends/youtube — buscar tendências do YouTube
router.get('/youtube', async (req, res) => {
  try {
    const { q, regionCode = 'BR', maxResults = 12, categoryId } = req.query;
    const ytKey = await getKey('youtube') || process.env.YOUTUBE_API_KEY;

    if (!ytKey) {
      // Retornar dados mock se não tiver chave
      return res.json({
        success: true,
        data: getMockTrends(),
        mock: true,
        message: 'Dados de exemplo — configure sua chave YouTube API em Configurações.',
      });
    }

    const params = { part: 'snippet,statistics', type: 'video', maxResults, regionCode, key: ytKey };
    if (q) { params.q = q; params.chart = undefined; }
    else { params.chart = 'mostPopular'; if (categoryId) params.videoCategoryId = categoryId; }

    const { data } = await axios.get('https://www.googleapis.com/youtube/v3/search', { params: q ? params : undefined })
      .catch(() => axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: { part: 'snippet,statistics', chart: 'mostPopular', regionCode, maxResults, key: ytKey, ...(categoryId ? { videoCategoryId: categoryId } : {}) },
      }));

    const items = (data.items || []).map((item) => ({
      id: item.id?.videoId || item.id,
      title: item.snippet?.title,
      channel: item.snippet?.channelTitle,
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
      publishedAt: item.snippet?.publishedAt,
      views: item.statistics?.viewCount,
      likes: item.statistics?.likeCount,
      description: item.snippet?.description?.slice(0, 200),
    }));

    return res.json({ success: true, data: items });
  } catch (err) {
    return res.json({ success: true, data: getMockTrends(), mock: true, message: 'Erro na API YouTube — exibindo dados de exemplo.' });
  }
});

// GET /api/trends/news — buscar notícias via Google News RSS
router.get('/news', async (req, res) => {
  try {
    const { q = 'tecnologia', lang = 'pt-BR', limit = 20 } = req.query;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${lang}&gl=BR&ceid=BR:pt-419`;

    const { data: xml } = await axios.get(rssUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AntGravityBot/1.0)' },
      timeout: 8000,
    });

    // Parse RSS simples com regex
    const items = [];
    const entries = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    for (const entry of entries.slice(0, parseInt(limit))) {
      const title = (entry.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || entry.match(/<title>(.*?)<\/title>/) || [])[1] || '';
      const link = (entry.match(/<link>(.*?)<\/link>/) || [])[1] || '';
      const pubDate = (entry.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';
      const source = (entry.match(/<source[^>]*>(.*?)<\/source>/) || [])[1] || '';
      if (title) items.push({ title: title.trim(), link, pubDate, source: source.trim() });
    }

    return res.json({ success: true, data: items, query: q });
  } catch (err) {
    return res.json({ success: true, data: getMockNews(), mock: true, message: 'Usando dados de exemplo de notícias.' });
  }
});

function getMockTrends() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `mock-${i}`,
    title: ['Como Fazer R$ 10k com IA em 2026', 'Segredos dos Milionários que Ninguém Conta', '5 Apps de IA que Vão Mudar Sua Vida', 'O Método Japonês para Produtividade Extrema', 'Invista em Cripto com Menos de R$ 100', 'Como Criar Vídeos Virais em 10 Minutos', 'A Verdade sobre Trabalhar de Casa', 'Dieta que Derruba 10kg em 30 Dias', 'Aprenda React em 7 Dias do Zero', 'O Segredo do Marketing Digital em 2026', 'Como Ganhar Seguidores no Instagram Rápido', 'Automatize Tudo com Python e IA'][i % 12],
    channel: ['TechBrasil', 'MindsetViral', 'AIRevolution', 'VidaDigital'][i % 4],
    thumbnail: `https://picsum.photos/seed/${i + 10}/320/180`,
    publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
    views: String(Math.floor(Math.random() * 5000000 + 100000)),
    likes: String(Math.floor(Math.random() * 200000 + 5000)),
  }));
}

function getMockNews() {
  return Array.from({ length: 20 }, (_, i) => ({
    title: `Notícia importante sobre tecnologia e IA — Edição ${i + 1}`,
    link: '#',
    pubDate: new Date(Date.now() - i * 1800000).toUTCString(),
    source: ['G1', 'Tecmundo', 'Estadão', 'UOL'][i % 4],
  }));
}

module.exports = router;
