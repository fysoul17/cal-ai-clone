-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_key TEXT NOT NULL UNIQUE,
  billing_key TEXT NOT NULL,
  card_company TEXT,
  card_number TEXT,
  amount INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'KRW',
  status TEXT DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, FAILED
  next_payment_at TIMESTAMPTZ,
  last_payment_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Improve performance
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update/delete (for now, mainly updated via API)
-- If we want users to be able to cancel, we might need an update policy or a specific RPC/API.
-- For now, let's keep it restricted to service role or secure API endpoints which bypass RLS if using service key,
-- OR we can allow Read for user and everything else restricted.
