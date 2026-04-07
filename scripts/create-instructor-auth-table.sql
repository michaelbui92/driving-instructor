-- Create instructor_auth table for storing PIN hash
-- This enables PIN sync across devices

CREATE TABLE IF NOT EXISTS instructor_auth (
  id INTEGER PRIMARY KEY DEFAULT 1, -- Single row for instructor auth
  pin_hash TEXT,                      -- Hashed PIN (simple hash for MVP)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read/write (this is MVP-level security)
-- For production, add proper RLS policies

-- Insert initial row if not exists
INSERT INTO instructor_auth (id, pin_hash)
VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;

-- Optional: Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_instructor_auth_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp on PIN change
DROP TRIGGER IF EXISTS instructor_auth_update_trigger ON instructor_auth;
CREATE TRIGGER instructor_auth_update_trigger
  BEFORE UPDATE ON instructor_auth
  FOR EACH ROW
  EXECUTE FUNCTION update_instructor_auth_timestamp();
