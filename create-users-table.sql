-- Tabela de usuários para o sistema de cadastro
-- Execute este script no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Índice para ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_usuarios_created_at ON usuarios(created_at DESC);

-- Comentários nas colunas
COMMENT ON TABLE usuarios IS 'Tabela de usuários cadastrados na biblioteca digital';
COMMENT ON COLUMN usuarios.id IS 'Identificador único do usuário';
COMMENT ON COLUMN usuarios.nome IS 'Nome completo do usuário';
COMMENT ON COLUMN usuarios.email IS 'E-mail do usuário (único)';
COMMENT ON COLUMN usuarios.telefone IS 'Telefone de contato do usuário';
COMMENT ON COLUMN usuarios.descricao IS 'Descrição opcional sobre o usuário e seus interesses';
COMMENT ON COLUMN usuarios.created_at IS 'Data e hora de criação do registro';
COMMENT ON COLUMN usuarios.updated_at IS 'Data e hora da última atualização';
