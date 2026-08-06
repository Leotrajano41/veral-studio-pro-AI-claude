const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

/**
 * Serviço responsável por processamento e renderização de vídeos via FFmpeg.
 */
class VideoRenderer {
  constructor(options = {}) {
    this.outputDir = options.outputDir || path.join(process.cwd(), 'uploads', 'rendered');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Renderiza e concatena mídias/áudios em um arquivo final de vídeo.
   * 
   * @param {object} inputs - Parâmetros de renderização.
   * @param {string} inputs.audioPath - Caminho do áudio da narração.
   * @param {Array<string>} [inputs.videoPaths=[]] - Lista de caminhos de clipes de vídeo ou imagens.
   * @param {string} [inputs.outputFileName] - Nome personalizado para o arquivo final.
   * @param {object} [inputs.config] - Resolução, FPS, Bitrate.
   * @returns {Promise<{ success: boolean, data?: { outputPath: string }, error?: string }>}
   */
  async renderizar(inputs) {
    return new Promise((resolve) => {
      try {
        const { audioPath, videoPaths = [], outputFileName, config = {} } = inputs || {};

        if (!audioPath || !fs.existsSync(audioPath)) {
          return resolve({ success: false, error: 'O caminho do áudio da narração é inválido ou não existe.' });
        }

        const width = config.width || 1080;
        const height = config.height || 1920; // 9:16 para Reels/Shorts
        const fps = config.fps || 30;
        const bitrate = config.bitrate || '2000k';

        const filename = outputFileName || `render_${Date.now()}.mp4`;
        const outputPath = path.join(this.outputDir, filename);

        console.log(`[VideoRenderer] Iniciando renderização: ${outputPath} (${width}x${height} @ ${fps}fps)`);

        let command = ffmpeg();

        if (videoPaths.length > 0 && fs.existsSync(videoPaths[0])) {
          command = command.input(videoPaths[0]);
        } else {
          // Se não houver vídeo de entrada, cria um fundo preto sintético
          command = command.input(`color=c=black:s=${width}x${height}:r=${fps}`)
            .inputOptions(['-f lavfi']);
        }

        command
          .input(audioPath)
          .videoCodec('libx264')
          .audioCodec('aac')
          .outputOptions([
            `-vf scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
            `-r ${fps}`,
            `-b:v ${bitrate}`,
            '-shortest',
            '-pix_fmt yuv420p'
          ])
          .output(outputPath)
          .on('end', () => {
            console.log(`[VideoRenderer] Renderização concluída com sucesso: ${outputPath}`);
            resolve({ success: true, data: { outputPath } });
          })
          .on('error', (err) => {
            console.error('[VideoRenderer] Erro no FFmpeg:', err.message);
            resolve({ success: false, error: `Erro no processamento FFmpeg: ${err.message}` });
          })
          .run();
      } catch (err) {
        console.error('[VideoRenderer] Exceção capturada:', err.message);
        resolve({ success: false, error: `Exceção na renderização: ${err.message}` });
      }
    });
  }

  /**
   * Adiciona legendas SRT ou ASS a um arquivo de vídeo.
   * 
   * @param {string} videoFile - Caminho do vídeo.
   * @param {string} subtitleFile - Caminho do arquivo de legenda.
   * @param {string} [outputFileName] - Nome do arquivo de saída.
   * @returns {Promise<{ success: boolean, data?: { outputPath: string }, error?: string }>}
   */
  async adicionarLegendas(videoFile, subtitleFile, outputFileName = null) {
    return new Promise((resolve) => {
      try {
        if (!fs.existsSync(videoFile) || !fs.existsSync(subtitleFile)) {
          return resolve({ success: false, error: 'Arquivos de vídeo ou legenda não foram encontrados.' });
        }

        const filename = outputFileName || `subtitled_${Date.now()}.mp4`;
        const outputPath = path.join(this.outputDir, filename);

        // Escape para barras no filtro de legenda do FFmpeg
        const escapedSubPath = subtitleFile.replace(/\\/g, '/').replace(/:/g, '\\:');

        ffmpeg(videoFile)
          .videoFilters(`subtitles='${escapedSubPath}'`)
          .output(outputPath)
          .on('end', () => {
            console.log(`[VideoRenderer] Legendas inseridas com sucesso: ${outputPath}`);
            resolve({ success: true, data: { outputPath } });
          })
          .on('error', (err) => {
            console.error('[VideoRenderer] Erro ao adicionar legenda:', err.message);
            resolve({ success: false, error: `Erro na adição de legendas: ${err.message}` });
          })
          .run();
      } catch (err) {
        resolve({ success: false, error: `Exceção ao adicionar legenda: ${err.message}` });
      }
    });
  }

  /**
   * Adiciona música de fundo e ajusta o volume em relação ao áudio principal.
   * 
   * @param {string} videoFile - Caminho do vídeo já montado.
   * @param {string} audioFile - Caminho da trilha/música de fundo.
   * @param {number} [bgVolume=0.15] - Volume da música (ex: 0.15 = 15%).
   * @returns {Promise<{ success: boolean, data?: { outputPath: string }, error?: string }>}
   */
  async adicionarMusicaDeFundo(videoFile, audioFile, bgVolume = 0.15) {
    return new Promise((resolve) => {
      try {
        if (!fs.existsSync(videoFile) || !fs.existsSync(audioFile)) {
          return resolve({ success: false, error: 'Arquivo de vídeo ou música de fundo não existe.' });
        }

        const outputPath = path.join(this.outputDir, `bgm_${Date.now()}.mp4`);

        ffmpeg()
          .input(videoFile)
          .input(audioFile)
          .complexFilter([
            `[1:a]volume=${bgVolume}[bgm]`,
            `[0:a][bgm]amix=inputs=2:duration=first[aout]`
          ])
          .outputOptions(['-map 0:v', '-map [aout]', '-c:v copy'])
          .output(outputPath)
          .on('end', () => {
            console.log(`[VideoRenderer] Música de fundo adicionada: ${outputPath}`);
            resolve({ success: true, data: { outputPath } });
          })
          .on('error', (err) => {
            console.error('[VideoRenderer] Erro ao mesclar áudios:', err.message);
            resolve({ success: false, error: `Erro ao adicionar música de fundo: ${err.message}` });
          })
          .run();
      } catch (err) {
        resolve({ success: false, error: `Exceção ao adicionar música de fundo: ${err.message}` });
      }
    });
  }
}

module.exports = VideoRenderer;
