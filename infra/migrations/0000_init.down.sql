-- +goose Down
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS payroll_records;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS leave_types;
DROP TABLE IF EXISTS attendance_records;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

DROP TYPE IF EXISTS leave_status;
DROP TYPE IF EXISTS clock_method;
DROP TYPE IF EXISTS employment_status;
DROP TYPE IF EXISTS employment_type;
DROP TYPE IF EXISTS user_role;

DROP EXTENSION IF EXISTS "pgcrypto";
