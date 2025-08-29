CREATE TABLE user_roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255),
    CONSTRAINT CHK_RoleName CHECK (role_name IN ('admin','customer'))
);

INSERT INTO user_roles (role_name) VALUES
('admin'),
('customer');

-- USERS TABLE (No Change)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    login_attempts INT NOT NULL DEFAULT 0,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    login_count INT NOT NULL DEFAULT 0,
    verification_code VARCHAR(255),
    code_timestamp TIMESTAMP,
    code_expiration TIMESTAMP,
    reset_password_token VARCHAR(255),
    reset_password_token_timestamp TIMESTAMP,
    reset_password_token_expiration TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id)
);

-- CUSTOMERS TABLE (No Change)
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ADMINS TABLE (No Change)
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- SESSIONS TABLE (No Change)
CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- BRANDS TABLE (No Change)
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- PRODUCT CATEGORIES TABLE (No Change)
CREATE TABLE productCategories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- PRODUCT CATEGORY BRANDS TABLE (No Change)
CREATE TABLE product_category_brands (
    category_id INTEGER REFERENCES productCategories(id) ON DELETE CASCADE,
    brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    PRIMARY KEY (category_id, brand_id)
);

-- PRODUCTS TABLE (Modified)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES productCategories(id) ON DELETE SET NULL,
    admin_id INTEGER REFERENCES admins(admin_id),
    average_rating NUMERIC(2,1) DEFAULT 0 CHECK (average_rating BETWEEN 0 AND 5),
    rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
    discount NUMERIC(10, 2) DEFAULT 0 CHECK (discount >= 0),
    discount_coupon VARCHAR(50) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- PRODUCT IMAGES TABLE (No Change)
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCT VARIANTS TABLE (Modified)
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    title VARCHAR(255) NULL,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    is_shippable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCT BRANDS TABLE (No Change)
CREATE TABLE product_brands (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, brand_id)
);

-- CARTS TABLE (No Change)
CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    customer_id INT NULL,
    session_id VARCHAR(255) NULL,
    payment_status VARCHAR(10) NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    CONSTRAINT CHK_UserOrSession CHECK (
        (customer_id IS NOT NULL) OR (session_id IS NOT NULL)
    ),
    CONSTRAINT CHK_PaymentStatus CHECK (
        payment_status IN ('paid', 'unpaid', 'cod')
    )
);

-- CART ITEMS TABLE (No Change)
CREATE TABLE cart_items (
    item_id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
    product_variant_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'canceled', 'returned')),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
);

-- ORDERS TABLE (Modified)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NULL,
    jazzcash_bill_reference VARCHAR(255) NULL UNIQUE, -- Unique reference for the JazzCash transaction
    jazzcash_txn_ref_no VARCHAR(255) NULL, -- JazzCash's transaction ID
    cart_id INT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'JazzCash',
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('paid', 'unpaid', 'cod')),
    fulfillment_status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (fulfillment_status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled', 'Returned')),
    shipping_address TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id)
);

-- ORDER ITEMS TABLE (No Change)
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_variant_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
);

-- SAVE FOR LATER LISTS TABLE (No Change)
CREATE TABLE save_for_later_lists (
    list_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- SAVE FOR LATER ITEMS TABLE (No Change)
CREATE TABLE save_for_later_items (
    item_id SERIAL PRIMARY KEY,
    list_id INT NOT NULL,
    product_variant_id INT NOT NULL,
    price_at_save NUMERIC(10, 2) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (list_id) REFERENCES save_for_later_lists(list_id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
);

-- PRODUCT REVIEWS TABLE (No Change)
CREATE TABLE product_reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,
    rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- REVIEW MEDIA TABLE (No Change)
CREATE TABLE review_media (
    media_id SERIAL PRIMARY KEY,
    review_id INT NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (review_id) REFERENCES product_reviews(review_id) ON DELETE CASCADE
);
