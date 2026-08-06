const axios = require('axios');
const MediaCache = require('../models/MediaCache');

/**
 * Serviço responsável por buscar mídias externas (Pixabay e Pexels) com suporte a cache.
 */
class MediaFinder {
  constructor(keys = {}) {
    this.pixabayKey = keys.pixabayKey || process.env.PIXABAY_API_KEY;
    this.pexelsKey = keys.pexelsKey || process.env.PEXELS_API_KEY;
  }

  /**
   * Busca imagens/vídeos no Pixabay.
   * 
   * @param {string} termo - Termo de pesquisa.
   * @param {string} [tipo='videos'] - Tipo de mídia ('videos' ou 'photos').
   * @param {number} [quantidade=5] - Quantidade de itens a buscar.
   * @returns {Promise<Array<{ id: string, url: string, thumbnail: string, fonte: string }>>}
   */
  async buscarPixabay(termo, tipo = 'videos', quantidade = 5) {
    if (!this.pixabayKey) {
      console.warn('[MediaFinder] PIXABAY_API_KEY não configurada.');
      return [];
    }

    try {
      const endpoint = tipo === 'videos' 
        ? 'https://pixabay.com/api/videos/' 
        : 'https://pixabay.com/api/';

      const response = await axios.get(endpoint, {
        params: {
          key: this.pixabayKey,
          q: encodeURIComponent(termo),
          per_page: quantidade,
          safesearch: true,
        },
      });

      const hits = response.data.hits || [];
      return hits.map((item) => {
        if (tipo === 'videos') {
          const videoUrl = item.videos?.large?.url || item.videos?.medium?.url || item.pageURL;
          return {
            id: `pixabay_${item.id}`,
            url: videoUrl,
            thumbnail: item.userImageURL || item.picture_id ? `https://i.vimeocdn.com/video/${item.picture_id}_640.jpg` : '',
            fonte: 'pixabay',
          };
        } else {
          return {
            id: `pixabay_${item.id}`,
            url: item.largeImageURL || item.webformatURL,
            thumbnail: item.previewURL,
            fonte: 'pixabay',
          };
        }
      });
    } catch (error) {
      console.error('[MediaFinder] Erro ao buscar Pixabay:', error.message);
      return [];
    }
  }

  /**
   * Busca imagens/vídeos no Pexels.
   * 
   * @param {string} termo - Termo de pesquisa.
   * @param {string} [tipo='videos'] - Tipo de mídia ('videos' ou 'photos').
   * @param {number} [quantidade=5] - Quantidade de itens a buscar.
   * @returns {Promise<Array<{ id: string, url: string, thumbnail: string, fonte: string }>>}
   */
  async buscarPexels(termo, tipo = 'videos', quantidade = 5) {
    if (!this.pexelsKey) {
      console.warn('[MediaFinder] PEXELS_API_KEY não configurada.');
      return [];
    }

    try {
      const endpoint = tipo === 'videos'
        ? `https://api.pexels.com/videos/search`
        : `https://api.pexels.com/v1/search`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: this.pexelsKey },
        params: {
          query: termo,
          per_page: quantidade,
        },
      });

      if (tipo === 'videos') {
        const videos = response.data.videos || [];
        return videos.map((item) => {
          const hdFile = item.video_files.find((f) => f.quality === 'hd') || item.video_files[0];
          return {
            id: `pexels_${item.id}`,
            url: hdFile ? hdFile.link : item.url,
            thumbnail: item.image,
            fonte: 'pexels',
          };
        });
      } else {
        const photos = response.data.photos || [];
        return photos.map((item) => ({
          id: `pexels_${item.id}`,
          url: item.src.large2x || item.src.original,
          thumbnail: item.src.small,
          fonte: 'pexels',
        }));
      }
    } catch (error) {
      console.error('[MediaFinder] Erro ao buscar Pexels:', error.message);
      return [];
    }
  }

  /**
   * Busca mídias combinando Pixabay e Pexels com suporte a cache no banco de dados.
   * 
   * @param {string} termo - Termo de pesquisa.
   * @param {number} [quantidade=10] - Quantidade de resultados combinados.
   * @returns {Promise<{ success: boolean, data?: Array<any>, cached?: boolean, error?: string }>}
   */
  async buscarMidia(termo, quantidade = 10) {
    try {
      if (!termo || typeof termo !== 'string' || termo.trim() === '') {
        return { success: false, error: 'O parâmetro "termo" é obrigatório.' };
      }

      const termoClean = termo.trim().toLowerCase();

      // 1. Tentar buscar no cache do banco de dados se a model MediaCache estiver disponível
      if (MediaCache && typeof MediaCache.findAll === 'function') {
        try {
          const cachedItems = await MediaCache.findAll({
            where: { termo: termoClean },
            limit: quantidade,
          });

          if (cachedItems && cachedItems.length > 0) {
            console.log(`[MediaFinder] ${cachedItems.length} mídias encontradas em cache para "${termoClean}"`);
            return {
              success: true,
              cached: true,
              data: cachedItems.map((item) => ({
                id: item.id,
                url: item.url,
                thumbnail: item.thumbnail,
                fonte: item.fonte,
              })),
            };
          }
        } catch (dbErr) {
          console.warn('[MediaFinder] Falha ao consultar cache DB, prosseguindo com busca externa:', dbErr.message);
        }
      }

      // 2. Realizar busca paralela em Pixabay e Pexels
      const qtdPorProvedor = Math.ceil(quantidade / 2);
      const [pixabayRes, pexelsRes] = await Promise.all([
        this.buscarPixabay(termoClean, 'videos', qtdPorProvedor),
        this.buscarPexels(termoClean, 'videos', qtdPorProvedor),
      ]);

      const resultadosCombinados = [...pixabayRes, ...pexelsRes].slice(0, quantidade);

      // 3. Salvar no cache assincronamente em background
      if (MediaCache && typeof MediaCache.bulkCreate === 'function' && resultadosCombinados.length > 0) {
        const cacheRecords = resultadosCombinados.map((m) => ({
          termo: termoClean,
          fonte: m.fonte,
          url: m.url,
          thumbnail: m.thumbnail,
        }));
        MediaCache.bulkCreate(cacheRecords).catch((err) =>
          console.warn('[MediaFinder] Erro ao salvar cache no DB:', err.message)
        );
      }

      return {
        success: true,
        cached: false,
        data: resultadosCombinados,
      };
    } catch (error) {
      console.error('[MediaFinder] Erro no método buscarMidia:', error.message);
      return {
        success: false,
        error: `Falha ao buscar mídias: ${error.message}`,
      };
    }
  }
}

module.exports = MediaFinder;
