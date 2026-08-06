# 📐 Arquitetura do Sistema

Esta seção apresenta a arquitetura macro do AntGravity Studio, explicando o fluxo dos dados e a lógica por trás de cada componente.

## 🏗️ Visão Geral da Arquitetura (Diagrama ASCII)

```
        ┌────────────────────────────────────────────────────────┐
        │                        CLIENTS                         │
        │   ┌──────────────────────┐  ┌──────────────────────┐   │
        │   │    Dashboard Web     │  │      App Mobile      │   │
        │   │      (Next.js)       │  │    (React Native)    │   │
        │   └──────────┬───────────┘  └──────────┬───────────┘   │
        └──────────────┼─────────────────────────┼───────────────┘
                       │                         │
                       └───────────┬─────────────┘
                                   │  HTTP / JSON / JWT
                                   ▼
        ┌────────────────────────────────────────────────────────┐
        │                    BACKEND (EXPRESS)                   │
        │   ┌────────────────────────────────────────────────┐   │
        │   │                Express Server                  │   │
        │   │                 (server.js)                    │   │
        │   └──────────┬───────────────────────────┬─────────┘   │
        │              │                           │             │
        │              ▼                           ▼             │
        │     ┌─────────────────┐         ┌─────────────────┐    │
        │     │  Database ORM   │         │ Services Engine │    │
        │     │   (Sequelize)   │         │ (Video/AI/BGM)  │    │
        │     └────────┬────────┘         └────────┬────────┘    │
        └──────────────┼───────────────────────────┼─────────────┘
                       │                           │
                       ▼                           ▼
        ┌──────────────┴────────┐       ┌──────────┴─────────────┐
        │     INFRASTRUCTURE    │       │   EXTERNAL PROVIDERS   │
        │  ┌─────────────────┐  │       │  ┌──────────────────┐  │
        │  │  PostgreSQL 15  │  │       │  │ OpenAI API       │  │
        │  └─────────────────┘  │       │  └──────────────────┘  │
        │  ┌─────────────────┐  │       │  ┌──────────────────┐  │
        │  │     Redis 7     │  │       │  │ Google Cloud TTS │  │
        │  └─────────────────┘  │       │  └──────────────────┘  │
        │                       │       │  ┌──────────────────┐  │
        │                       │       │  │ Pixabay & Pexels │  │
        │                       │       │  └──────────────────┘  │
        └───────────────────────┘       └────────────────────────┘
```

---

## 🔄 Fluxo de Geração de Vídeo

A geração de um vídeo passa por um fluxo sequencial e assíncrono para garantir estabilidade e escalabilidade:

```
[Cliente]                    [Backend]                  [AIs / APIs]                [FFmpeg Engine]
    │                            │                           │                             │
    │--- POST /videos/generate ->│                           │                             │
    │                            │--- Solicita roteiro ----->│                             │
    │                            │<-- Retorna roteiro -------│                             │
    │                            │                           │                             │
    │                            │--- Envia para TTS ------->│                             │
    │                            │<-- Retorna Áudio (.mp3) --│                             │
    │                            │                           │                             │
    │                            │--- Busca mídias --------->│                             │
    │                            │<-- Retorna mídias --------│                             │
    │                            │                                                         │
    │                            │------------------- Renderiza vídeo (FFmpeg) ----------->│
    │                            │<------------------ Retorna arquivo de vídeo final ------│
    │<-- Notifica Conclusão -----│                                                         │
```

---

## 💾 Decisões de Design

1. **Monorepo com npm Workspaces**: Facilita a manutenção do código, permitindo compartilhar pacotes e definições de forma local e ágil.
2. **Processamento Assíncrono (Fire-and-forget)**: O backend responde imediatamente ao cliente com status `202 Accepted`, evitando timeouts de rede HTTP enquanto o FFmpeg processa dados pesados.
3. **Cache de busca em Banco de Dados**: Termos buscados nas APIs Pixabay/Pexels são persistidos em cache no PostgreSQL por tempo determinado, otimizando as cotas de requisição e tempos de resposta.
4. **Isolamento via Docker**: Garante consistência de bibliotecas do sistema operacional (como FFmpeg e Python3) em qualquer infraestrutura ou servidor em nuvem.
