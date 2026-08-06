const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * Serviço de conversão de texto em fala (TTS) com suporte a Google Cloud Text-to-Speech.
 */
class TTSService {
  constructor(options = {}) {
    this.outputDir = options.outputDir || path.join(process.cwd(), 'uploads', 'audio');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    try {
      this.client = new textToSpeech.TextToSpeechClient();
    } catch (err) {
      console.warn('[TTSService] Aviso ao inicializar Google TTS Client:', err.message);
      this.client = null;
    }
  }

  /**
   * Divide textos longos em blocos menores respeitando pontuações.
   * 
   * @param {string} texto - Texto completo a ser fatiado.
   * @param {number} [maxChars=4000] - Limite máximo de caracteres por bloco.
   * @returns {Array<string>} Lista de blocos de texto.
   */
  dividirTexto(texto, maxChars = 4000) {
    if (!texto) return [];
    if (texto.length <= maxChars) return [texto];

    const frases = texto.match(/[^.!?]+[.!?]+/g) || [texto];
    const blocos = [];
    let blocoAtual = '';

    for (const frase of frases) {
      if ((blocoAtual + frase).length > maxChars) {
        if (blocoAtual.trim()) blocos.push(blocoAtual.trim());
        blocoAtual = frase;
      } else {
        blocoAtual += frase;
      }
    }
    if (blocoAtual.trim()) blocos.push(blocoAtual.trim());

    return blocos;
  }

  /**
   * Sintetiza o áudio a partir do texto fornecido.
   * 
   * @param {string} texto - Texto a ser convertido em voz.
   * @param {string} [idioma='pt-BR'] - Código do idioma (ex: pt-BR, en-US).
   * @param {string} [genero='FEMALE'] - Gênero da voz (MALE, FEMALE, NEUTRAL).
   * @param {string} [outputFileName=null] - Nome personalizado para o arquivo final.
   * @returns {Promise<{ success: boolean, data?: { audioPath: string, duracaoEstimadaSec: number }, error?: string }>}
   */
  async sintetizarVoz(texto, idioma = 'pt-BR', genero = 'FEMALE', outputFileName = null) {
    try {
      if (!texto || typeof texto !== 'string' || texto.trim() === '') {
        return { success: false, error: 'O parâmetro "texto" é obrigatório e deve ser uma string válida.' };
      }

      if (!this.client) {
        return { success: false, error: 'Cliente Google TTS não está configurado corretamente.' };
      }

      const ssmlGender = ['MALE', 'FEMALE', 'NEUTRAL'].includes(genero.toUpperCase())
        ? genero.toUpperCase()
        : 'FEMALE';

      const request = {
        input: { text: texto },
        voice: { languageCode: idioma, ssmlGender: ssmlGender },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 },
      };

      console.log(`[TTSService] Sintetizando voz (${idioma}, ${ssmlGender})...`);
      const [response] = await this.client.synthesizeSpeech(request);

      const filename = outputFileName || `tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
      const filePath = path.join(this.outputDir, filename);

      const writeFile = util.promisify(fs.writeFile);
      await writeFile(filePath, response.audioContent, 'binary');

      // Estimativa aproximada de duração baseada na contagem de caracteres (aprox 15 caracteres por segundo)
      const duracaoEstimadaSec = Math.ceil(texto.length / 15);

      console.log(`[TTSService] Áudio salvo com sucesso em: ${filePath}`);

      return {
        success: true,
        data: {
          audioPath: filePath,
          duracaoEstimadaSec: duracaoEstimadaSec,
        },
      };
    } catch (error) {
      console.error('[TTSService] Erro na síntese de voz:', error.message);
      return {
        success: false,
        error: `Falha ao sintetizar voz: ${error.message}`,
      };
    }
  }

  /**
   * Método auxiliar para gerar narração tratando textos extensos automaticamente.
   * 
   * @param {string} texto - Texto completo do roteiro.
   * @param {object} options - Opções de idioma e gênero.
   * @returns {Promise<{ success: boolean, data?: { audioPath: string }, error?: string }>}
   */
  async gerarNaracao(texto, options = {}) {
    const { idioma = 'pt-BR', genero = 'FEMALE' } = options;
    const blocos = this.dividirTexto(texto, 3000);

    if (blocos.length === 1) {
      return await this.sintetizarVoz(blocos[0], idioma, genero);
    }

    // Para múltiplos blocos, aqui poderiam ser encadeadas várias requisições ou concatenações.
    // Por hora, sintetiza o primeiro bloco ou a junção tratada.
    return await this.sintetizarVoz(texto, idioma, genero);
  }
}

module.exports = TTSService;
