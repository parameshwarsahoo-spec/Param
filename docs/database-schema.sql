CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash TEXT,
  full_name VARCHAR(160) NOT NULL,
  avatar_url TEXT,
  default_currency CHAR(3) NOT NULL DEFAULT 'USD',
  locale VARCHAR(16) NOT NULL DEFAULT 'en-US',
  theme VARCHAR(16) NOT NULL DEFAULT 'system',
  provider VARCHAR(32) NOT NULL DEFAULT 'local',
  provider_subject TEXT,
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  type VARCHAR(16) NOT NULL CHECK (type IN ('expense', 'income')),
  color VARCHAR(16) NOT NULL DEFAULT '#2563eb',
  icon VARCHAR(64) NOT NULL DEFAULT 'circle',
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name, type)
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  spent_at TIMESTAMPTZ NOT NULL,
  payment_method VARCHAR(40) NOT NULL,
  notes TEXT,
  receipt_url TEXT,
  merchant VARCHAR(160),
  is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE incomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  received_at TIMESTAMPTZ NOT NULL,
  source VARCHAR(120) NOT NULL,
  notes TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  alert_threshold NUMERIC(5,2) NOT NULL DEFAULT 0.8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, category_id, month)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(40) NOT NULL,
  title VARCHAR(160) NOT NULL,
  body TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(40) NOT NULL,
  format VARCHAR(16) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  file_url TEXT,
  status VARCHAR(24) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expenses_user_spent_at ON expenses(user_id, spent_at DESC);
CREATE INDEX idx_expenses_user_category ON expenses(user_id, category_id);
CREATE INDEX idx_expenses_amount ON expenses(user_id, amount);
CREATE INDEX idx_incomes_user_received_at ON incomes(user_id, received_at DESC);
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month);
CREATE INDEX idx_notifications_user_scheduled ON notifications(user_id, scheduled_for);
CREATE INDEX idx_reports_user_period ON reports(user_id, period_start, period_end);
