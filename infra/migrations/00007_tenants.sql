-- +goose Up
-- +goose StatementBegin
-- ENUM
CREATE TYPE plan AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

CREATE TYPE tenant_role AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- TENANTS
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    workspace_slug TEXT NOT NULL UNIQUE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE
    SET
        NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tenant_workspace_slug ON tenants(workspace_slug);

-- TENANT PROFILES
CREATE TABLE IF NOT EXISTS tenant_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
    legal_name TEXT,
    logo_url TEXT,
    industry TEXT,
    company_size TEXT,
    country TEXT,
    timezone TEXT,
    currency TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenant_profile_tenant ON tenant_profiles(tenant_id);

-- TENANT BILLINGS
CREATE TABLE IF NOT EXISTS tenant_billings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
    plan plan NOT NULL,
    billing_email TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenant_billing_tenant ON tenant_billings(tenant_id);

CREATE TABLE IF NOT EXISTS tenant_members (
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role tenant_role NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (tenant_id, user_id)
);

CREATE INDEX idx_tenant_members_user ON tenant_members(user_id);

CREATE INDEX idx_tenant_members_tenant_role ON tenant_members (tenant_id, role);

CREATE UNIQUE INDEX idx_one_owner_per_tenant ON tenant_members (tenant_id)
WHERE
    role = 'OWNER';

-- SHARED TABLES: ADD TENANT_ID
ALTER TABLE
    departments
ADD
    COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_department_tenant ON departments(tenant_id);

ALTER TABLE
    users
ADD
    COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE
SET
    NULL;

CREATE INDEX IF NOT EXISTS idx_user_tenant ON users(tenant_id);

ALTER TABLE
    employees
ADD
    COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_employee_tenant ON employees(tenant_id);

ALTER TABLE
    leave_types
ADD
    COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_leave_type_tenant ON leave_types(tenant_id);

ALTER TABLE
    system_settings
ADD
    COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_system_setting_tenant ON system_settings(tenant_id);

ALTER TABLE
    templates
ADD
    COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_template_tenant ON templates(tenant_id);

ALTER TABLE
    files
ADD
    COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_file_tenant ON files(tenant_id);

ALTER TABLE
    documents
ADD
    COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_document_tenant ON documents(tenant_id);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_document_tenant;

ALTER TABLE
    documents DROP COLUMN IF EXISTS tenant_id;

DROP INDEX IF EXISTS idx_file_tenant;

ALTER TABLE
    files DROP COLUMN IF EXISTS tenant_id;

DROP INDEX IF EXISTS idx_template_tenant;

ALTER TABLE
    templates DROP COLUMN IF EXISTS tenant_id;

DROP INDEX IF EXISTS idx_system_setting_tenant;

ALTER TABLE
    system_settings DROP COLUMN IF EXISTS tenant_id;

DROP INDEX IF EXISTS idx_leave_type_tenant;

ALTER TABLE
    leave_types DROP COLUMN IF EXISTS tenant_id;

DROP INDEX IF EXISTS idx_employee_tenant;

ALTER TABLE
    employees DROP COLUMN IF EXISTS tenant_id;

DROP INDEX IF EXISTS idx_user_tenant;

ALTER TABLE
    users DROP COLUMN IF EXISTS tenant_id;

DROP INDEX IF EXISTS idx_department_tenant;

ALTER TABLE
    departments DROP COLUMN IF EXISTS tenant_id;

DROP INDEX IF EXISTS idx_one_owner_per_tenant;

DROP INDEX IF EXISTS idx_tenant_members_tenant_role;

DROP INDEX IF EXISTS idx_tenant_members_user;

DROP TABLE IF EXISTS tenant_members;

DROP INDEX IF EXISTS idx_tenant_billing_tenant;

DROP TABLE IF EXISTS tenant_billings;

DROP INDEX IF EXISTS idx_tenant_profile_tenant;

DROP TABLE IF EXISTS tenant_profiles;

DROP INDEX IF EXISTS idx_tenant_workspace_slug;

DROP TABLE IF EXISTS tenants;

DROP TYPE IF EXISTS tenant_role;

DROP TYPE IF EXISTS plan;

-- +goose StatementEnd