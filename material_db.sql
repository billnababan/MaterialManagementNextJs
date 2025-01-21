-- Create Database
DROP DATABASE IF EXISTS material_request_db;
CREATE DATABASE material_request_db;

-- Connect to database
\c material_request_db

-- Create Enum Types
CREATE TYPE department_enum AS ENUM ('PRODUCTION', 'WAREHOUSE');
CREATE TYPE request_status_enum AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED');

-- Create Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department department_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Material Requests Table
CREATE TABLE material_requests (
    id BIGSERIAL PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    requester_id BIGINT REFERENCES users(id),
    approved_by_id BIGINT REFERENCES users(id),
    status request_status_enum NOT NULL DEFAULT 'PENDING_APPROVAL',
    rejection_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Material Request Items Table
CREATE TABLE material_request_items (
    id BIGSERIAL PRIMARY KEY,
    material_request_id BIGINT REFERENCES material_requests(id),
    material_name VARCHAR(100) NOT NULL,
    requested_quantity INTEGER NOT NULL,
    usage_description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unit VARCHAR(50) NOT NULL DEFAULT 'PCS',
);

-- Create Blacklisted Tokens Table
CREATE TABLE blacklisted_tokens (
    id BIGSERIAL PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    blacklisted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Create Indexes
CREATE INDEX idx_material_requests_status ON material_requests(status);
CREATE INDEX idx_material_requests_requester ON material_requests(requester_id);
CREATE INDEX idx_material_request_items_request ON material_request_items(material_request_id);
CREATE INDEX idx_blacklisted_tokens_token ON blacklisted_tokens(token);
CREATE INDEX idx_blacklisted_tokens_expires_at ON blacklisted_tokens(expires_at);

-- Add Foreign Key Constraints with ON DELETE CASCADE
ALTER TABLE material_requests 
    ADD CONSTRAINT fk_material_requests_requester 
    FOREIGN KEY (requester_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE;

ALTER TABLE material_requests 
    ADD CONSTRAINT fk_material_requests_approver 
    FOREIGN KEY (approved_by_id) 
    REFERENCES users(id) 
    ON DELETE SET NULL;

ALTER TABLE material_request_items 
    ADD CONSTRAINT fk_material_request_items_request 
    FOREIGN KEY (material_request_id) 
    REFERENCES material_requests(id) 
    ON DELETE CASCADE;

-- Insert Sample Data
-- Note: Passwords are BCrypt hashed for 'password123'
INSERT INTO users (username, password, department) VALUES
('production_user', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'PRODUCTION'),
('warehouse_user', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'WAREHOUSE');

-- Insert sample material request
INSERT INTO material_requests (request_number, requester_id, status) VALUES
('MR-TEST001', 1, 'PENDING_APPROVAL');

-- Insert sample material request items
INSERT INTO material_request_items (material_request_id, material_name, requested_quantity, unit, usage_description) VALUES
(1, 'Besi', 10, 'KG', 'Untuk produksi mesin A');

-- Add Comments for Documentation
COMMENT ON DATABASE material_request_db IS 'Database for managing material requests';
COMMENT ON TABLE users IS 'Table storing user information';
COMMENT ON TABLE material_requests IS 'Table storing material request headers';
COMMENT ON TABLE material_request_items IS 'Table storing material request items/details';
COMMENT ON TABLE blacklisted_tokens IS 'Table storing invalidated JWT tokens';