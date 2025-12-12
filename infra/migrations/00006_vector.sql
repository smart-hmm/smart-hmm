-- +goose Up
-- +goose StatementBegin
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    source TEXT NOT NULL,
    -- 'upload', 'wiki', 'policy', ...
    mime_type TEXT,
    language TEXT,
    tags TEXT [] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_source ON documents (source);

CREATE INDEX idx_documents_tags ON documents USING GIN (tags);

CREATE TABLE document_chunks (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(768) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}' :: jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chunks_document ON document_chunks (document_id, chunk_index);

CREATE INDEX idx_chunks_embedding_ivfflat ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
-- 1. DROP indexes for document_chunks
DROP INDEX IF EXISTS idx_chunks_embedding_ivfflat;

DROP INDEX IF EXISTS idx_chunks_document;

-- 2. DROP table document_chunks
DROP TABLE IF EXISTS document_chunks;

-- 3. DROP indexes for documents
DROP INDEX IF EXISTS idx_documents_tags;

DROP INDEX IF EXISTS idx_documents_source;

-- 4. DROP table documents
DROP TABLE IF EXISTS documents;

-- 5. DROP extension vector
DROP EXTENSION IF EXISTS vector;

-- +goose StatementEnd