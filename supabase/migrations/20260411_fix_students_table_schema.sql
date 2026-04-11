-- Fix students table schema - add all missing columns
-- First check if columns exist, add them if they don't

-- Add name column if it doesn't exist
ALTER TABLE students ADD COLUMN IF NOT EXISTS name TEXT;

-- Add phone column if it doesn't exist  
ALTER TABLE students ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add address column if it doesn't exist
ALTER TABLE students ADD COLUMN IF NOT EXISTS address TEXT;

-- Add details_completed column if it doesn't exist
ALTER TABLE students ADD COLUMN IF NOT EXISTS details_completed BOOLEAN DEFAULT FALSE;

-- Add onboarding_completed column if it doesn't exist
ALTER TABLE students ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add onboarding_skipped column if it doesn't exist
ALTER TABLE students ADD COLUMN IF NOT EXISTS onboarding_skipped BOOLEAN DEFAULT FALSE;

-- Update details_completed for existing students with complete info
UPDATE students 
SET details_completed = true 
WHERE name IS NOT NULL 
  AND name != '' 
  AND phone IS NOT NULL 
  AND phone != '' 
  AND address IS NOT NULL 
  AND address != '';

-- Show the updated schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;