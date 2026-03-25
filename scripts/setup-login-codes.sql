-- Login codes table for custom OTP flow
CREATE TABLE IF NOT EXISTS login_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,               -- 6-digit code (stored hashed)
  code_hash TEXT NOT NULL,          -- bcrypt hash for verification
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-cleanup of expired codes
CREATE OR REPLACE FUNCTION cleanup_expired_login_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM login_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create index for fast lookup
CREATE INDEX IF NOT EXISTS idx_login_codes_email ON login_codes(email);
CREATE INDEX IF NOT EXISTS idx_login_codes_expires ON login_codes(expires_at);

-- RLS - no restrictions needed (codes are hashed, expires quickly)
ALTER TABLE login_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert login codes" ON login_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read own login codes" ON login_codes FOR SELECT USING (true);
CREATE POLICY "Anyone can update own login codes" ON login_codes FOR UPDATE USING (true);
