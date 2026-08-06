-- Digital Fraud Shield DDL Schema for Supabase / PostgreSQL

-- Enable UUID extension if required
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    language_preference VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Detections Table
CREATE TABLE IF NOT EXISTS detections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    message_text TEXT NOT NULL,
    risk_score INTEGER NOT NULL,
    risk_level VARCHAR(20) NOT NULL, -- Low, Medium, High
    matched_rules JSONB DEFAULT '[]'::jsonb,
    explanation JSONB DEFAULT '[]'::jsonb,
    language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(50) DEFAULT 'Analyzed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    detection_id INTEGER REFERENCES detections(id) ON DELETE SET NULL,
    message_text TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Pending Review', -- Pending Review, Approved, Rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Patterns Table
CREATE TABLE IF NOT EXISTS patterns (
    id SERIAL PRIMARY KEY,
    pattern_name VARCHAR(255) NOT NULL,
    pattern_type VARCHAR(50) NOT NULL, -- keyword, regex, upi_handle, phone
    regex_or_keyword TEXT NOT NULL,
    weight INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast query filtering
CREATE INDEX IF NOT EXISTS idx_detections_user_id ON detections(user_id);
CREATE INDEX IF NOT EXISTS idx_detections_risk_level ON detections(risk_level);
CREATE INDEX IF NOT EXISTS idx_detections_created_at ON detections(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
