-- +goose Up
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE template_status AS ENUM ('draft', 'active', 'archived');

CREATE TYPE template_channel AS ENUM ('email', 'sms', 'push', 'in_app');

CREATE TABLE template_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    version INT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'en',
    channel template_channel NOT NULL,
    subject TEXT,
    body_html TEXT,
    body_text TEXT,
    status template_status NOT NULL DEFAULT 'draft',
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uniq_template_version UNIQUE (template_id, version)
);

CREATE UNIQUE INDEX uniq_active_template ON template_versions (template_id, locale, channel)
WHERE
    status = 'active';

CREATE INDEX idx_template_versions_lookup ON template_versions (template_id, locale, channel, status);

CREATE TABLE template_variables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    description TEXT,
    required BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uniq_template_variable UNIQUE (template_id, key)
);