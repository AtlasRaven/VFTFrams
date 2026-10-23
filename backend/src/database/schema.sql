-- ==============================================================================
-- VFT Farms E-Commerce Database Schema (PostgreSQL 3NF Compliant)
-- Hệ thống Thương mại Điện tử Nông sản Sạch VFT Farms (https://vftfarms.com)
-- ==============================================================================

-- Drop tables if exists in reverse order of foreign keys
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS policies CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN', 'STAFF')),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ADDRESSES TABLE
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES TABLE (Self-referencing for hierarchical Mega Menu)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(100),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCTS TABLE
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    secondary_images JSONB DEFAULT '[]'::jsonb,
    unit VARCHAR(50) NOT NULL DEFAULT 'Kg',
    specification VARCHAR(100) NOT NULL DEFAULT 'Túi 1kg',
    price NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(14, 2) CHECK (sale_price >= 0),
    stock_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (stock_quantity >= 0),
    certification VARCHAR(50) CHECK (certification IN ('VietGAP', 'VfSC', 'Organic', 'HACCP')),
    origin VARCHAR(150) DEFAULT 'Trang trại VFT Farms',
    is_featured BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS TABLE
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    recipient_name VARCHAR(150) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    notes TEXT,
    subtotal NUMERIC(14, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_fee NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
    total_amount NUMERIC(14, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'COD' CHECK (payment_method IN ('COD', 'BANK_TRANSFER', 'VNPAY', 'MOMO')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    order_status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (order_status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED')),
    proof_image_url TEXT,
    proof_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDER_ITEMS TABLE
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(14, 2) NOT NULL CHECK (unit_price >= 0),
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(14, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. POLICIES TABLE
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CAM_KET', 'BAN_HANG', 'THANH_TOAN', 'DOI_TRA', 'GIAO_HANG', 'BAO_MAT')),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. NEWS / ARTICLES TABLE
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    thumbnail_url VARCHAR(500) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'TIN_TRANG_TRAI' CHECK (category IN ('TIN_TRANG_TRAI', 'KIEN_THUC', 'THONG_BAO')),
    is_published BOOLEAN NOT NULL DEFAULT true,
    views INT NOT NULL DEFAULT 0,
    author_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_best_seller ON products(is_best_seller);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_code ON orders(order_code);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_policies_slug ON policies(slug);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
