-- +goose Up
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

------------------------------------------------------------
-- ENUMS
------------------------------------------------------------

CREATE TYPE user_role AS ENUM (
    'ADMIN',
    'HR',
    'MANAGER',
    'EMPLOYEE'
);

CREATE TYPE employment_type AS ENUM (
    'FULL_TIME',
    'PART_TIME',
    'INTERN',
    'CONTRACT'
);

CREATE TYPE employment_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'RESIGNED'
);

CREATE TYPE clock_method AS ENUM (
    'MANUAL',
    'DEVICE'
);

CREATE TYPE leave_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);

------------------------------------------------------------
-- TABLE: departments
------------------------------------------------------------

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    manager_id UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- TABLE: employees
------------------------------------------------------------

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    date_of_birth DATE,

    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,

    position TEXT NOT NULL,
    employment_type employment_type NOT NULL,
    employment_status employment_status NOT NULL DEFAULT 'ACTIVE',
    join_date DATE NOT NULL,

    base_salary NUMERIC(12,2) DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- TABLE: users
------------------------------------------------------------

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'EMPLOYEE',

    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- TABLE: attendance_records
------------------------------------------------------------

CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    clock_in TIMESTAMPTZ NOT NULL,
    clock_out TIMESTAMPTZ,
    total_hours NUMERIC(8,2),

    method clock_method NOT NULL DEFAULT 'DEVICE',
    note TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attendance_employee ON attendance_records(employee_id);
CREATE INDEX idx_attendance_clockin ON attendance_records(clock_in);

------------------------------------------------------------
-- TABLE: leave_types
------------------------------------------------------------

CREATE TABLE leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT UNIQUE NOT NULL,
    default_days INT NOT NULL DEFAULT 0,
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- TABLE: leave_requests
------------------------------------------------------------

CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,

    status leave_status NOT NULL DEFAULT 'PENDING',
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leave_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_status ON leave_requests(status);

------------------------------------------------------------
-- TABLE: payroll_records
------------------------------------------------------------

CREATE TABLE payroll_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

    period VARCHAR(7) NOT NULL, -- YYYY-MM

    base_salary NUMERIC(12,2) NOT NULL,
    allowances JSONB DEFAULT '{}'::jsonb,
    deductions JSONB DEFAULT '{}'::jsonb,

    net_salary NUMERIC(12,2) NOT NULL,

    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payroll_employee ON payroll_records(employee_id);
CREATE INDEX idx_payroll_period ON payroll_records(period);

------------------------------------------------------------
-- TABLE: system_settings
------------------------------------------------------------

CREATE TABLE system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);