# 📜 CHANGELOG — AntGravity Studio / Viral Studio Pro AI

Todos os desenvolvimentos notáveis e alterações deste projeto são documentados neste arquivo.

---

## [2.0.0-PRO] - 2026-08-07

### ✨ Adicionado
- **Arquitetura Completa de 14 Módulos**:
  - `Pipeline Mágico`: Wizard automatizado de 9 passos com seletores de 30+ idiomas, vozes TTS, picotador, overlays e gradiente de execução.
  - `Fila de Produção`: Monitoramento em tempo real com auto-ticking, 4 abas de filtro, estado por passo e ações de pausar/retomar/cancelar.
  - `Projetos`: Gerenciador de projetos com modal de 5 abas (Básico, Conteúdo, SEO, Capa, Upload), botão "Forjar com IA" e detecção de fontes RSS.
  - `Tendências`: Pesquisa em 7 fontes (YouTube, Notícias, Google, Bing, Yahoo, DuckDuckGo) com auto-criação de projetos.
  - `Notícias`: Sistema duplo com busca de manchetes e gerenciamento de Canais de Notícias com Pauta, Histórico e produção em lote.
  - `Roteiros`: Extração de conteúdo por URL e gerador de roteiros com preview em cards e vinculação a projetos.
  - `Narrações (TTS)`: Gerador de áudio narrado com suporte a múltiplos roteiros por linha, controle de velocidade/pitch/volume e player.
  - `Vozes Clonadas (XTTS)`: Interface de clonagem de voz por IA com referência de 30s, instalador do modelo XTTS v2 e alerta de compatibilidade.
  - `Mídias`: Integração Pixabay/Pexels com busca por orientação, multi-seleção de download e Biblioteca local.
  - `Renderizar`: Módulo customizado manual com seletores de pasta de áudio, músicas de fundo, mídias e output com anel de progresso.
  - `Thumbnail`: Criador de capas com 6 estilos de template e geração via IA.
  - `VSL Cinematográfica`: Pipeline com 4 estruturas de persuasão (Problema-Agitação, História, Resultados, Documentário).
  - `Canais / Upload`: Gerenciamento de canais YouTube conectados e fila de upload OAuth 2.0.
  - `Configurações`: Painel em 6 abas (Backup/Restore, Licença PRO, Criptografia de 8 API Keys em AES-256, Vozes Edge TTS, Cache Manager e Sobre).

- **Integração & Performance**:
  - `api.js`: Serviço centralizado expondo `projectService`, `pipelineService`, `trendsService`, `newsService`, `mediaService`, `configService`, `voiceService`.
  - `store.js`: Gerenciador de estado global React Context com persistência automática no `localStorage`.
  - `logger.js`: Logger de erros e monitor de métricas de performance.
  - `integration.test.js`: Suíte de testes de integração e validação de regras de negócios.

---

## [1.0.0] - 2026-08-01

### 🚀 Inicial
- Lançamento inicial da landing page e dashboard básico do AntGravity Studio.
