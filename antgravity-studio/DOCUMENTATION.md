# 📐 DOCUMENTATION — AntGravity Studio Architecture & API Reference

> Documentação técnica da arquitetura, esquema de banco de dados, fluxos de execução do pipeline e especificação da API REST.

---

## 1. 🏗️ Arquitetura do Sistema

O sistema é construído segundo o padrão monolítico desacoplado, composto por um **Frontend Next.js** responsivo e um **Backend Express REST API** com persistência em **PostgreSQL via Sequelize ORM**.

```text
┌─────────────────────────────────────────────────────────┐
│              Next.js 14 Frontend (Porta 3000)           │
│  - React Components (Cards, Modals, Forms, Sliders)     │
│  - Centralized API Services (`web/lib/api.js`)          │
│  - Global React Store (`web/lib/store.js` + LocalStorage)│
└────────────────────────────┬────────────────────────────┘
                             │ REST API (JSON)
┌────────────────────────────▼────────────────────────────┐
│              Express.js Backend (Porta 5000)            │
│  - API Routes: /projects, /queue, /pipeline, /voices... │
│  - Business Controllers & Middlewares                   │
│  - Sequelize ORM Models                                 │
└────────────────────────────┬────────────────────────────┘
                             │ SQL
┌────────────────────────────▼────────────────────────────┐
│                  PostgreSQL Database                    │
│  Tables: projects, queue_jobs, voices, api_keys, etc.   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 🗄️ Esquema do Banco de Dados (Schema)

### Tabela `projects`
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Obrigatório)
- `nicho` (VARCHAR)
- `tema_padrao` (VARCHAR)
- `idioma` (VARCHAR, Default: 'pt-BR')
- `voz_padrao` (VARCHAR)
- `orientacao` (VARCHAR, 'horizontal' | 'vertical')
- `qtd_videos_padrao` (INTEGER, Default: 3)
- `palavras_roteiro` (INTEGER, Default: 1000)
- `urls_referencia` (ARRAY de TEXT)
- `fontes_rss` (ARRAY de TEXT)
- `prompt_mestre` (TEXT)
- `prompt_seo` (TEXT)
- `prompt_capa` (TEXT)
- `cta_fixa` (TEXT)
- `randomizar_cta` (BOOLEAN)
- `subir_youtube` (BOOLEAN)
- `conta_youtube` (VARCHAR)
- `canal_youtube` (VARCHAR)
- `visibilidade` (VARCHAR, 'public' | 'unlisted' | 'private')
- `created_at` / `updated_at` (TIMESTAMP)

### Tabela `queue_jobs`
- `id` (UUID, Primary Key)
- `project_id` (UUID, Foreign Key)
- `status` (ENUM: 'pending', 'processing', 'completed', 'failed', 'cancelled', 'paused')
- `progress` (INTEGER 0-100)
- `steps_completed` (ARRAY de VARCHAR)
- `total_steps` (INTEGER, Default: 9)
- `output_path` (TEXT)
- `error_message` (TEXT)
- `started_at` / `ended_at` (TIMESTAMP)

### Tabela `voices` / `custom_voices`
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `provider` (ENUM: 'google', 'openai', 'xtts', 'elevenlabs', 'custom')
- `language` (VARCHAR)
- `audio_file_path` (TEXT)
- `is_cloned` (BOOLEAN)
- `status` (ENUM: 'processing', 'ready', 'failed')

### Tabela `api_keys`
- `id` (UUID, Primary Key)
- `service` (ENUM: 'openai', 'assemblyai', 'pixabay', 'pexels', 'google_cloud', 'openrouter', 'youtube', 'meta_ai', 'kie_ai')
- `key_value` (TEXT Criptografado em AES-256)
- `status` (ENUM: 'untested', 'connected', 'error')

---

## 3. 🔄 Fluxogramas dos Principais Módulos

### Fluxo do Pipeline Mágico (9 Etapas)
```text
[Início] → 1. Baixar Referências → 2. Gerar Roteiros (GPT-4o) → 3. TTS (Narração)
        → 4. Buscar Mídias (Pixabay/Pexels) → 5. Picotador → 6. Renderizar Video
        → 7. Gerar SEO → 8. Gerar Thumbnail → 9. Upload YouTube → [Concluído em Fila]
```

### Fluxo de Notícias → Canal de Produção
```text
[Buscar Notícias / Manchetes] → [Adicionar à Pauta do Canal]
        → [Configurar Regras do Canal (Tarja, Formato, Mídias)] → [Produzir Selecionadas]
        → [Inicia Jobs na Fila de Produção]
```

---

## 4. 🌐 Especificação de Endpoints da API REST

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/projects` | Listar todos os projetos |
| `POST` | `/api/projects` | Criar novo projeto |
| `GET` | `/api/projects/:id` | Obter detalhes do projeto |
| `PUT` | `/api/projects/:id` | Editar projeto |
| `DELETE` | `/api/projects/:id` | Remover projeto |
| `POST` | `/api/pipeline/start` | Iniciar execução do Pipeline Mágico |
| `GET` | `/api/queue` | Obter status da fila de produção |
| `PATCH` | `/api/queue/:id` | Atualizar/Pausar/Cancelar job na fila |
| `POST` | `/api/scripts/generate` | Gerar roteiros com GPT-4o-mini |
| `GET` | `/api/trends/youtube` | Pesquisar tendências no YouTube |
| `GET` | `/api/trends/news` | Pesquisar notícias recentes |
| `GET` | `/api/voices` | Listar vozes TTS e clonadas |
| `POST` | `/api/voices/custom` | Upload e clonagem de nova voz XTTS |
| `GET` | `/api/apikeys` | Obter lista de APIs configuradas (mascaradas) |
| `POST` | `/api/apikeys` | Salvar e criptografar chave de API |
| `POST` | `/api/apikeys/:service/test` | Testar conexão com a API |
