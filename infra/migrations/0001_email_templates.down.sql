-- +goose Down
DROP TABLE IF EXISTS template_variables;

DROP TABLE IF EXISTS template_versions;

DROP TABLE IF EXISTS templates;

DROP TYPE IF EXISTS template_channel;

DROP TYPE IF EXISTS template_status;