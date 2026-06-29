# 2. Database Schema Documentation

## Complete PostgreSQL Schema for The Naru Platform (with Payments & Subscriptions)

---

## New Tables for Payment System

### 1. SUBSCRIPTION_PLANS Table

```sql
CREATE TABLE subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    billing_cycle ENUM('monthly', 'quarterly', 'yearly') DEFAULT 'monthly',
    duration_days INT,
    features TEXT[] NOT NULL,
    max_quizzes_per_day INT,
    max_materials_per_month INT,
    helpdesk_priority ENUM('low', 'medium', 'high') DEFAULT 'low',
    is_active BOOLEAN DEFAULT true,
    display_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Plans
INSERT INTO subscription_plans (
    name, description, price, billing_cycle, duration_days, features,
    max_quizzes_per_day, max_materials_per_month, helpdesk_priority
) VALUES (
    'Free Trial',
    'Limited access to learning materials',
    0,
    'monthly',
    30,
    ARRAY['5 free quizzes/month', 'Limited material access', 'Basic analytics'],
    1,
    3,
    'low'
),
(
    'Basic',
    'Essential access for exam preparation',
    299,
    'monthly',
    30,
    ARRAY['Unlimited quizzes', 'All materials', 'Progress tracking', 'Basic analytics', 'Email support'],
    10,
    50,
    'medium'
),
(
    'Premium',
    'Advanced features with priority support',
    699,
    'monthly',
    30,
    ARRAY['Unlimited everything', 'Advanced analytics', 'Priority support', 'Doubt clearing sessions', 'Custom study plans'],
    999,
    999,
    'high'
),
(
    'Pro Yearly',
    'Best value annual subscription',
    5999,
    'yearly',
    365,
    ARRAY['Unlimited everything', 'Advanced analytics', 'Priority 24/7 support', 'Live sessions', 'One-on-one mentoring'],
    999,
    999,
    'high'
);
```

### 2. USER_SUBSCRIPTIONS Table

```sql
CREATE TABLE user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    plan_id INT NOT NULL REFERENCES subscription_plans(id),
    status ENUM('active', 'cancelled', 'expired', 'paused', 'pending') DEFAULT 'pending',
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
```

### 3. PAYMENTS Table

```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    subscription_id INT REFERENCES user_subscriptions(id),
    plan_id INT NOT NULL REFERENCES subscription_plans(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method ENUM('stripe', 'razorpay', 'paypal', 'bank_transfer') DEFAULT 'razorpay',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
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
```

### 4. PAYMENT_METHODS Table

```sql
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payment_gateway ENUM('stripe', 'razorpay', 'paypal') NOT NULL,
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
```

### 5. INVOICES Table

```sql
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
    status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
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
```

### 6. PROMOTIONAL_CODES Table

```sql
CREATE TABLE promotional_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed_amount') DEFAULT 'percentage',
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
```

### 7. SUBSCRIPTION_USAGE Table (Track Feature Usage)

```sql
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
```

### 8. ACCESS_RESTRICTIONS Table

```sql
CREATE TABLE access_restrictions (
    id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quizzes(id),
    material_id INT REFERENCES materials(id),
    required_plan_id INT REFERENCES subscription_plans(id),
    restriction_type ENUM('free_only', 'paid_only', 'plan_specific', 'premium_only') DEFAULT 'free_only',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_access_restrictions_quiz ON access_restrictions(quiz_id);
CREATE INDEX idx_access_restrictions_material ON access_restrictions(material_id);
```

---

## Existing Tables Update

### Update USERS Table

```sql
ALTER TABLE users ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'free';
ALTER TABLE users ADD COLUMN subscription_expiry TIMESTAMP;
ALTER TABLE users ADD COLUMN trial_started_at TIMESTAMP;
ALTER TABLE users ADD COLUMN trial_days_remaining INT DEFAULT 0;
```

### Update QUIZZES Table

```sql
ALTER TABLE quizzes ADD COLUMN requires_subscription BOOLEAN DEFAULT false;
ALTER TABLE quizzes ADD COLUMN min_plan_required INT REFERENCES subscription_plans(id);
```

### Update MATERIALS Table

```sql
ALTER TABLE materials ADD COLUMN requires_subscription BOOLEAN DEFAULT false;
ALTER TABLE materials ADD COLUMN min_plan_required INT REFERENCES subscription_plans(id);
ALTER TABLE materials ADD COLUMN premium_only BOOLEAN DEFAULT false;
```

---

## SQL Migration Script

```sql
-- File: database/migrations/002_add_payment_system.sql
-- Execute all CREATE TABLE statements for payment system above
```

---

## Database Relationships Map

```
USERS
  ├── USER_SUBSCRIPTIONS (1:1)
  │   ├── SUBSCRIPTION_PLANS
  │   └── SUBSCRIPTION_USAGE
  ├── PAYMENTS (1:N)
  │   ├── SUBSCRIPTION_PLANS
  │   └── INVOICES
  ├── PAYMENT_METHODS (1:N)
  ├── INVOICES (1:N)
  └── ACCESS_RESTRICTIONS

SUBSCRIPTION_PLANS
  ├── USER_SUBSCRIPTIONS (1:N)
  ├── PAYMENTS (1:N)
  ├── PROMOTIONAL_CODES (N:N)
  └── ACCESS_RESTRICTIONS (1:N)

QUIZZES / MATERIALS
  └── ACCESS_RESTRICTIONS (1:N)
```

---

**Last Updated**: June 29, 2026