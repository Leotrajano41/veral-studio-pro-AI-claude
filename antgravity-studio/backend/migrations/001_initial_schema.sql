-- Migration Inicial: 001_initial_schema.sql
-- Habilita extensão para UUIDs se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Índices para USERS
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- 2. Tabela PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(255) NOT NULL,
    niche VARCHAR(100) NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'pt-BR',
    theme VARCHAR(100) NOT NULL DEFAULT 'default',
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Índices para PROJECTS
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_niche ON projects(niche);

-- 3. Tabela VIDEOS
CREATE TYPE video_status_enum AS ENUM ('pending', 'processing', 'done', 'error');

CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
    status video_status_enum NOT NULL DEFAULT 'pending',
    roteiro TEXT NULL,
    naracao VARCHAR(512) NULL,
    duracao INTEGER DEFAULT 0,
    video_path VARCHAR(512) NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Índices para VIDEOS
CREATE INDEX IF NOT EXISTS idx_videos_project_id ON videos(project_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);

-- 4. Tabela MEDIA_CACHE
CREATE TABLE IF NOT EXISTS media_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    termo VARCHAR(255) NOT NULL,
    fonte VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para MEDIA_CACHE
CREATE INDEX IF NOT EXISTS idx_media_cache_termo_fonte ON media_cache(termo, fonte);
CREATE INDEX IF NOT EXISTS idx_media_cache_created_at ON media_cache(created_at);
