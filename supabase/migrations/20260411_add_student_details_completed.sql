-- Add details_completed field to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS details_completed BOOLEAN DEFAULT FALSE;

-- Update existing students who have name, phone, and address to have details_completed = true
UPDATE students 
SET details_completed = true 
WHERE name IS NOT NULL 
  AND name != '' 
  AND phone IS NOT NULL 
  AND phone != '' 
  AND address IS NOT NULL 
  AND address != '';