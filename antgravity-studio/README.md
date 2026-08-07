# 🚀 AntGravity Studio — Viral Studio Pro AI v2.0

> Plataforma profissional completa para automação de vídeos virais, VSLs cinematográficas, YouTube Shorts, Reels e TikTok com Inteligência Artificial.

---

## 📋 Visão Geral

O **AntGravity Studio (Viral Studio Pro AI v2.0)** é um ecossistema completo de produção audiovisual alimentado por Inteligência Artificial. Ele automatiza desde a pesquisa de tendências e matérias jornalísticas até a escrita de roteiros, narração neural (TTS), seleção de imagens/vídeos stock, picotagem, renderização, SEO e publicação automática no YouTube.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TailwindCSS, Lucide Icons, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, Sequelize ORM, PostgreSQL
- **IA & TTS**: OpenAI (GPT-4o-mini), Microsoft Edge TTS, XTTS v2 (Clonagem de Voz), AssemblyAI, OpenRouter, Google Cloud TTS
- **Mídias Stock**: Pixabay API, Pexels API, Meta AI, Kie.ai
- **Renderização**: Ffmpeg, Picotador automático

---

## 📦 Estrutura dos 14 Módulos

```text
📦 Produção
├── ✨ Pipeline Mágico    (/pipeline)  — Fluxo automatizado em 9 etapas
├── 🎬 Fila de Produção   (/queue)     — Gerenciamento de jobs em tempo real
└── 📂 Projetos           (/projects)  — Gestão de projetos com modal de 5 abas

🔍 Descoberta
├── 🔍 Tendências         (/trends)    — Pesquisa de vídeos virais em 7 fontes
└── 📰 Notícias           (/news)      — Monitor de notícias e canais automatizados

✍️ Conteúdo
├── 📜 Roteiros           (/scripts)   — Extração e gerador de roteiros virais
├── 🎙️ Narrações (TTS)    (/narrations) — Conversor de texto em voz neural
├── 🗣️ Vozes Clonadas     (/voices)    — Clonagem de voz por IA com XTTS v2
├── 🖼️ Mídias             (/media)     — Busca Pixabay/Pexels e biblioteca local
├── 🎬 Renderizar         (/render)    — Renderização manual customizada
└── 📐 Thumbnail          (/thumbnail) — Criador de capas virais com IA

🚀 Avançado & Sistema
├── 🎥 VSL Cinematográfica (/vsl)      — Pipeline de VSLs de alta conversão
├── 📺 Canais / Upload    (/channels)  — Conexão OAuth e fila de publicação YouTube
├── 📁 Arquivos           (/files)     — Gerenciador de assets do sistema
├── 📊 Dashboard          (/)          — Painel geral de estatísticas
└── ⚙️ Configurações      (/settings)  — Gerenciamento de 10 APIs, Backup, Licença e Cache
```

---

## 🚀 Como Instalar e Rodar

### Pré-requisitos
- Node.js v18 ou superior
- PostgreSQL v14+ (ou Docker Compose)

### 1. Clonar o Repositório & Instalar Dependências

```bash
# Entrar no diretório web e instalar dependências
cd web
npm install

# Entrar no diretório backend e instalar dependências
cd ../backend
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend`:

```env
PORT=5000
DATABASE_URL=postgres://usuario:senha@localhost:5432/antgravity_db
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_aqui
```

### 3. Rodar a Aplicação

```bash
# Rodar o Frontend (Next.js)
cd web
npm run dev
# → http://localhost:3000

# Rodar o Backend (Express) em outro terminal
cd backend
npm run dev
# → http://localhost:5000
```

---

## 🔑 Configuração das Chaves de API

Acesse a página **Configurações (`/settings`) → Aba API Keys** para configurar suas chaves:
- **OpenAI**: Para geração de roteiros com GPT-4o-mini
- **AssemblyAI**: Para transcrição e legendas sincronizadas
- **Pixabay / Pexels**: Para download de mídias stock gratuitas
- **YouTube Data API**: Para análise de tendências e upload de vídeos
- **OpenRouter / Google Cloud / ElevenLabs**: Opcionais para modelos adicionais

---

## 📄 Licença

Copyright © 2026 AntGravity Inc. Todos os direitos reservados.
