-- File: backend/src/database/schema.sql
-- Complete database schema for The Naru Platform

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE question_type AS ENUM ('mcq', 'true_false', 'short_answer');
CREATE TYPE attempt_status AS ENUM ('in_progress', 'submitted', 'graded');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'cancelled');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'paused', 'pending');
CREATE TYPE material_type AS ENUM ('pdf', 'video', 'note', 'document');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'quarterly', 'yearly');

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_picture_url TEXT,
    role user_role DEFAULT 'student',
    phone_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    last_login TIMESTAMP,
    subscription_status VARCHAR(50) DEFAULT 'free',
    subscription_expiry TIMESTAMP,
    trial_started_at TIMESTAMP,
    trial_days_remaining INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Subjects Table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert subjects
INSERT INTO subjects (name, description) VALUES
('History', 'Ancient, Medieval, and Modern History'),
('Geography', 'Physical and Human Geography'),
('Science and Technology', 'Science, Technology, and Environment'),
('Polity', 'Indian Constitution and Political System'),
('Art and Culture', 'Indian Arts, Culture, and Heritage'),
('Economy', 'Indian and World Economics'),
('Current Affairs', 'National and International News'),
('Mathematics and Reasoning', 'Quantitative Aptitude, Logic, and Reasoning');

-- Quizzes Table
CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES subjects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty difficulty_level DEFAULT 'medium',
    total_questions INT NOT NULL,
    time_limit_minutes INT DEFAULT 60,
    passing_score INT DEFAULT 40,
    created_by INT NOT NULL REFERENCES users(id),
    is_published BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    total_attempts INT DEFAULT 0,
    average_score DECIMAL(5,2),
    requires_subscription BOOLEAN DEFAULT false,
    min_plan_required INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_subject ON quizzes(subject_id);
CREATE INDEX idx_quizzes_created_by ON quizzes(created_by);

-- Questions Table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    quiz_id INT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type DEFAULT 'mcq',
    marks INT DEFAULT 1,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_answer VARCHAR(50) NOT NULL,
    explanation TEXT,
    difficulty difficulty_level,
    question_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_quiz ON questions(quiz_id);

-- Quiz Attempts Table
CREATE TABLE quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    quiz_id INT NOT NULL REFERENCES quizzes(id),
    score DECIMAL(5,2),
    total_marks INT,
    percentage DECIMAL(5,2),
    status attempt_status DEFAULT 'in_progress',
    time_spent_seconds INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    ip_address VARCHAR(45),
    device_info TEXT
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_status ON quiz_attempts(status);

-- Quiz Answers Table
CREATE TABLE quiz_answers (
    id SERIAL PRIMARY KEY,
    attempt_id INT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id INT NOT NULL REFERENCES questions(id),
    user_answer VARCHAR(255),
    is_correct BOOLEAN,
    marks_obtained INT,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_answers_attempt ON quiz_answers(attempt_id);

-- Student Progress Table
CREATE TABLE student_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id),
    total_quizzes_attempted INT DEFAULT 0,
    total_quizzes_passed INT DEFAULT 0,
    average_score DECIMAL(5,2),
    total_study_time_minutes INT DEFAULT 0,
    accuracy_percentage DECIMAL(5,2),
    materials_viewed INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_progress_user ON student_progress(user_id);

-- Subject Performance Table
CREATE TABLE subject_performance (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    subject_id INT NOT NULL REFERENCES subjects(id),
    quizzes_attempted INT DEFAULT 0,
    quizzes_passed INT DEFAULT 0,
    average_score DECIMAL(5,2),
    weak_topics TEXT[],
    strong_topics TEXT[],
    last_attempted TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, subject_id)
);

CREATE INDEX idx_subject_performance_user ON subject_performance(user_id);

-- Materials Table
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subjects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    material_type material_type DEFAULT 'pdf',
    file_url TEXT NOT NULL,
    file_size_mb DECIMAL(10,2),
    file_name VARCHAR(255),
    thumbnail_url TEXT,
    duration_minutes INT,
    uploaded_by INT NOT NULL REFERENCES users(id),
    is_published BOOLEAN DEFAULT false,
    views_count INT DEFAULT 0,
    downloads_count INT DEFAULT 0,
    requires_subscription BOOLEAN DEFAULT false,
    min_plan_required INT,
    premium_only BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_materials_subject ON materials(subject_id);
CREATE INDEX idx_materials_uploaded_by ON materials(uploaded_by);

-- Material Progress Table
CREATE TABLE material_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    material_id INT NOT NULL REFERENCES materials(id),
    views_count INT DEFAULT 0,
    downloaded BOOLEAN DEFAULT false,
    time_spent_seconds INT DEFAULT 0,
    progress_percentage INT DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    last_viewed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, material_id)
);

CREATE INDEX idx_material_progress_user ON material_progress(user_id);

-- Helpdesk Tickets Table
CREATE TABLE helpdesk_tickets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ticket_priority DEFAULT 'medium',
    status ticket_status DEFAULT 'open',
    category VARCHAR(100),
    assigned_to INT REFERENCES users(id),
    attachments TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE INDEX idx_helpdesk_tickets_user ON helpdesk_tickets(user_id);
CREATE INDEX idx_helpdesk_tickets_status ON helpdesk_tickets(status);
CREATE INDEX idx_helpdesk_tickets_assigned ON helpdesk_tickets(assigned_to);

-- Helpdesk Messages Table
CREATE TABLE helpdesk_messages (
    id SERIAL PRIMARY KEY,
    ticket_id INT NOT NULL REFERENCES helpdesk_tickets(id) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES users(id),
    message_text TEXT NOT NULL,
    attachments TEXT[],
    is_admin_reply BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_helpdesk_messages_ticket ON helpdesk_messages(ticket_id);

-- FAQ Table
CREATE TABLE faq (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    helpful_count INT DEFAULT 0,
    unhelpful_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_faq_category ON faq(category);

-- Achievements Table
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    badge_icon_url TEXT,
    criteria_type VARCHAR(50) DEFAULT 'score_threshold',
    criteria_value INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Achievements Table
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    achievement_id INT NOT NULL REFERENCES achievements(id),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'system',
    related_id INT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- PAYMENT SYSTEM TABLES

-- Subscription Plans Table
CREATE TABLE subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    billing_cycle billing_cycle DEFAULT 'monthly',
    duration_days INT,
    features TEXT[] NOT NULL,
    max_quizzes_per_day INT,
    max_materials_per_month INT,
    helpdesk_priority VARCHAR(20) DEFAULT 'low',
    is_active BOOLEAN DEFAULT true,
    display_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert subscription plans
INSERT INTO subscription_plans (name, description, price, billing_cycle, duration_days, features, max_quizzes_per_day, max_materials_per_month, helpdesk_priority, display_order) VALUES
('Free Trial', 'Limited access to learning materials', 0, 'monthly', 30, ARRAY['5 free quizzes/month', 'Limited material access', 'Basic analytics'], 1, 3, 'low', 1),
('Basic', 'Essential access for exam preparation', 299, 'monthly', 30, ARRAY['Unlimited quizzes', 'All materials', 'Progress tracking', 'Basic analytics', 'Email support'], 10, 50, 'medium', 2),
('Premium', 'Advanced features with priority support', 699, 'monthly', 30, ARRAY['Unlimited everything', 'Advanced analytics', 'Priority support', 'Doubt clearing sessions', 'Custom study plans'], 999, 999, 'high', 3),
('Pro Yearly', 'Best value annual subscription', 5999, 'yearly', 365, ARRAY['Unlimited everything', 'Advanced analytics', 'Priority 24/7 support', 'Live sessions', 'One-on-one mentoring'], 999, 999, 'high', 4);

-- User Subscriptions Table
CREATE TABLE user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    plan_id INT NOT NULL REFERENCES subscription_plans(id),
    status subscription_status DEFAULT 'pending',
    subscription_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subscription_end_date TIMESTAMP NOT NULL,
    renewal_date TIMESTAMP,
    is_auto_renew BOOLEAN DEFAULT true,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_expiry ON user_subscriptions(subscription_end_date);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    subscription_id INT REFERENCES user_subscriptions(id),
    plan_id INT NOT NULL REFERENCES subscription_plans(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method VARCHAR(50) DEFAULT 'razorpay',
    payment_status payment_status DEFAULT 'pending',
    transaction_id VARCHAR(255),
    invoice_id VARCHAR(255),
    payment_reference VARCHAR(255),
    receipt_url TEXT,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    paid_at TIMESTAMP,
    failed_at TIMESTAMP,
    refunded_at TIMESTAMP,
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
CREATE INDEX idx_payments_date ON payments(created_at);

-- Payment Methods Table
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payment_gateway VARCHAR(50) NOT NULL,
    gateway_customer_id VARCHAR(255),
    gateway_payment_method_id VARCHAR(255),
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    card_expiry_month INT,
    card_expiry_year INT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_default ON payment_methods(user_id, is_default);

-- Invoices Table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    payment_id INT REFERENCES payments(id),
    subscription_id INT REFERENCES user_subscriptions(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(50) DEFAULT 'draft',
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    paid_date TIMESTAMP,
    invoice_url TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Promotional Codes Table
CREATE TABLE promotional_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    max_usage INT,
    current_usage INT DEFAULT 0,
    applicable_plans INT[],
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promo_codes_code ON promotional_codes(code);
CREATE INDEX idx_promo_codes_active ON promotional_codes(is_active);

-- Subscription Usage Table
CREATE TABLE subscription_usage (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    subscription_id INT NOT NULL REFERENCES user_subscriptions(id),
    quizzes_taken_this_month INT DEFAULT 0,
    materials_accessed_this_month INT DEFAULT 0,
    helpdesk_tickets_created INT DEFAULT 0,
    live_sessions_attended INT DEFAULT 0,
    last_reset_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscription_usage_user ON subscription_usage(user_id);

-- Access Restrictions Table
CREATE TABLE access_restrictions (
    id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quizzes(id),
    material_id INT REFERENCES materials(id),
    required_plan_id INT REFERENCES subscription_plans(id),
    restriction_type VARCHAR(50) DEFAULT 'free_only',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_access_restrictions_quiz ON access_restrictions(quiz_id);
CREATE INDEX idx_access_restrictions_material ON access_restrictions(material_id);
