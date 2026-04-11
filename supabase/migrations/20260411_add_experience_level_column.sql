-- Add experience_level column to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS experience_level TEXT;

-- Show the updated schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;