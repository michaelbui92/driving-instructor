# PIN Sync Across Devices - Implementation

## What Changed

**Problem:** Instructor PIN was stored in localStorage, so logging in on a new device required resetting the PIN.

**Solution:** PIN is now stored in Supabase `instructor_auth` table, syncing across all devices.

## Files Changed

1. **lib/auth.ts** - PIN operations now use Supabase
   - `hasPinSet()` → async, checks Supabase
   - `setPin()` → async, saves to Supabase
   - `login()` → async, verifies against Supabase
   - `getAuthStatus()` → async
   - `resetPin()` → async, clears from Supabase

2. **components/AuthProvider.tsx** - Updated to handle async auth

3. **app/instructor/login/page.tsx** - Updated to handle async auth

## Deployment Steps

### 1. Create the Supabase Table

Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard → your project → SQL Editor):

```sql
-- Create instructor_auth table for storing PIN hash
CREATE TABLE IF NOT EXISTS instructor_auth (
  id INTEGER PRIMARY KEY DEFAULT 1,
  pin_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial row
INSERT INTO instructor_auth (id, pin_hash)
VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_instructor_auth_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS instructor_auth_update_trigger ON instructor_auth;
CREATE TRIGGER instructor_auth_update_trigger
  BEFORE UPDATE ON instructor_auth
  FOR EACH ROW
  EXECUTE FUNCTION update_instructor_auth_timestamp();
```

### 2. Deploy Updated Code

```bash
cd ~/workspace/repos/driving-instructor
git add -A
git commit -m "feat: sync instructor PIN across devices via Supabase"
git push
```

Vercel will auto-deploy from main branch.

### 3. Test

1. On your laptop: Set a PIN via the instructor login page
2. On your phone/tablet: Go to instructor login, enter the same PIN
3. Should work without resetting!

## How It Works

- **PIN stored in Supabase** - One row, `pin_hash` column
- **Session stays local** - 24-hour session stored in localStorage (device-specific)
- **Logout is device-specific** - Logging out on one device doesn't log you out everywhere
- **PIN reset syncs everywhere** - Resetting PIN clears it from Supabase and all local sessions
