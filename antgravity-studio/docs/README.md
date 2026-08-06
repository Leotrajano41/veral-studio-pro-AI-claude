# ⚡ AntGravity Studio

[![Monorepo](https://img.shields.io/badge/monorepo-lerna--style-blue.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-web%20%7C%20mobile%20%7C%20backend-orange.svg)](#)

AntGravity Studio é uma plataforma de ponta para automação e geração inteligente de conteúdos em vídeo vertical (Shorts, Reels, TikTok) a partir de inteligência artificial.

## 🚀 Features

- [x] **Monorepo Estruturado**: Separação organizada entre Backend, Web e Mobile.
- [x] **Roteirização por IA**: Geração automática de scripts dinâmicos usando gpt-4o-mini da OpenAI.
- [x] **Voz Neural**: Síntese de voz realista com a API do Google Cloud Text-to-Speech.
- [x] **Mídias de Apoio**: Motor de busca paralelo integrado a Pexels e Pixabay com cache persistente.
- [x] **Renderizador FFmpeg**: Concatenação automatizada, fusão de áudios e adição de legendas no backend.
- [x] **Dashboard Web**: Frontend ágil e elegante construído com Next.js e Tailwind CSS.
- [x] **App Mobile**: Aplicativo multiplataforma iOS/Android desenvolvido com React Native & Expo.
- [x] **Antgravity Engine**: Integração com SDK proprietário para deploys, otimizações e análises de código.

## 🛠️ Tech Stack

| Componente | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Backend** | Node.js / Express | API REST & Orquestração da Pipeline |
| **Banco de Dados** | PostgreSQL 15 | Persistência relacional de usuários, projetos e vídeos |
| **Cache** | Redis 7 | Cache de chaves temporárias e controle de filas |
| **ORM** | Sequelize | Modelagem e mapeamento relacional |
| **Video Engine** | FFmpeg | Processamento, compressão e mixagem de mídia |
| **Frontend Web** | Next.js / Tailwind CSS | Painel administrativo de controle de projetos |
| **Mobile** | React Native / Expo / Redux | Gerenciamento e visualização mobile |

## 🔗 Links Rápidos para Documentação

- 📦 [Guia de Instalação e Setup](./SETUP.md)
- 🔌 [Documentação da API REST](./API_DOCS.md)
- 📐 [Arquitetura de Sistemas](./ARCHITECTURE.md)
- 🤖 [Integração com a Antgravity Engine](./ANTIGRAVITY_INTEGRATION.md)
- 🚀 [Guia de Deployment](./DEPLOYMENT.md)

## 🤝 Contribuindo

Para contribuir com o projeto, por favor leia as diretrizes no guia de [Setup](./SETUP.md). Crie um branch a partir de `main`, desenvolva sua feature ou correção de bug, e envie um Pull Request.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](../LICENSE) para detalhes.
