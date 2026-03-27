-- Fix Supabase replication lag issues
-- Run this in Supabase SQL Editor

-- 1. Add updated_at column to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create a trigger to auto-update updated_at on any change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Update all existing bookings to have updated_at = created_at
UPDATE bookings SET updated_at = created_at WHERE updated_at IS NULL;

-- 4. Make API query use updated_at for ordering (fresher data)
-- The API should query: ORDER BY updated_at DESC, created_at DESC

-- 5. Optional: Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_updated_at ON bookings(updated_at DESC);

-- 6. Check current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

-- 7. Verify RLS is disabled (important!)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'bookings';

-- If rowsecurity is true, disable it:
-- ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;