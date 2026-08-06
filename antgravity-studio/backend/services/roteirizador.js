const { OpenAI } = require('openai');

/**
 * Serviço de geração de roteiros automatizados utilizando OpenAI.
 */
class Roteirizador {
  constructor(apiKey = process.env.OPENAI_API_KEY) {
    this.apiKey = apiKey;
    if (this.apiKey) {
      this.client = new OpenAI({ apiKey: this.apiKey });
    } else {
      console.warn('[Roteirizador] OPENAI_API_KEY não informada. Chamadas reais irão falhar.');
    }
  }

  /**
   * Gera um roteiro para vídeo com base no tema, nicho, idioma e palavras-chave.
   * 
   * @param {string} tema - Tema principal do vídeo.
   * @param {string} nicho - Nicho de mercado (ex: Finanças, Curiosidades, Saúde).
   * @param {string} [idioma='pt-BR'] - Idioma desejado para o roteiro.
   * @param {Array<string>} [palavras=[]] - Lista de palavras-chave obrigatórias ou recomendadas.
   * @returns {Promise<{ success: boolean, data?: { roteiro: string, tokens_usados: number, timestamp: string }, error?: string }>}
   */
  async gerarRoteiro(tema, nicho, idioma = 'pt-BR', palavras = []) {
    try {
      // Validação de inputs
      if (!tema || typeof tema !== 'string' || tema.trim() === '') {
        return { success: false, error: 'O parâmetro "tema" é obrigatório e deve ser uma string válida.' };
      }
      if (!nicho || typeof nicho !== 'string' || nicho.trim() === '') {
        return { success: false, error: 'O parâmetro "nicho" é obrigatório e deve ser uma string válida.' };
      }

      if (!this.client) {
        return { success: false, error: 'Cliente OpenAI não inicializado. Verifique OPENAI_API_KEY.' };
      }

      const palavrasChaveStr = Array.isArray(palavras) && palavras.length > 0
        ? `Palavras-chave a incluir: ${palavras.join(', ')}.`
        : '';

      const prompt = `
Você é um roteirista profissional especializado em vídeos curtos e altamente engajantes (Shorts/Reels/TikTok).
Crie um roteiro dinâmico, direto ao ponto e envolvente.

Parâmetros:
- Tema: ${tema}
- Nicho: ${nicho}
- Idioma: ${idioma}
${palavrasChaveStr}

Estrutura desejada:
1. Hook Inicial (primeiros 3 segundos): Gancho para prender a atenção do público.
2. Desenvolvimento: Explicação fluida e empolgante dividida em tópicos curtos.
3. Call to Action (CTA): Chamada para ação clara no final.

Gere apenas o texto corrido do roteiro pronto para narração, sem anotações entre parênteses ou marcas de tempo.
      `.trim();

      console.log(`[Roteirizador] Gerando roteiro para tema "${tema}" no nicho "${nicho}"...`);

      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um assistente especialista em criação de conteúdos virais.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const roteiroText = completion.choices[0]?.message?.content?.trim();
      const tokensUsados = completion.usage?.total_tokens || 0;

      if (!roteiroText) {
        throw new Error('A API da OpenAI retornou uma resposta vazia.');
      }

      console.log(`[Roteirizador] Roteiro gerado com sucesso. Tokens utilizados: ${tokensUsados}`);

      return {
        success: true,
        data: {
          roteiro: roteiroText,
          tokens_usados: tokensUsados,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('[Roteirizador] Erro ao gerar roteiro:', error.message);
      return {
        success: false,
        error: `Falha ao gerar roteiro: ${error.message}`
      };
    }
  }
}

module.exports = Roteirizador;
