-- +goose Up
-- +goose StatementBegin
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE
    SET
        NULL,
        storage_path TEXT NOT NULL UNIQUE,
        filename TEXT NOT NULL,
        content_type TEXT,
        size BIGINT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE
    SET
        NULL,
        deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_files_department_id ON files(department_id);

CREATE INDEX idx_files_created_at ON files(created_at);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_files_created_at;

DROP INDEX IF EXISTS idx_files_department_id;

DROP TABLE IF EXISTS files;

-- +goose StatementEnd