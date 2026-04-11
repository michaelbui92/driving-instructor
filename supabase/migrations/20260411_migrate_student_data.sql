-- Migrate student data from old columns to new columns

-- 1. Copy full_name to name where name is empty/null but full_name exists
UPDATE students 
SET name = full_name
WHERE (name IS NULL OR name = '') 
  AND full_name IS NOT NULL 
  AND full_name != '';

-- 2. Copy has_completed_details to details_completed
UPDATE students
SET details_completed = has_completed_details
WHERE has_completed_details IS NOT NULL;

-- 3. Set details_completed = true for students with name, phone, and address
UPDATE students 
SET details_completed = true 
WHERE name IS NOT NULL 
  AND name != '' 
  AND phone IS NOT NULL 
  AND phone != '' 
  AND address IS NOT NULL 
  AND address != '';

-- 4. Show the data migration results
SELECT 
  COUNT(*) as total_students,
  COUNT(CASE WHEN name IS NOT NULL AND name != '' THEN 1 END) as has_name,
  COUNT(CASE WHEN full_name IS NOT NULL AND full_name != '' THEN 1 END) as has_full_name,
  COUNT(CASE WHEN details_completed = true THEN 1 END) as details_completed_count,
  COUNT(CASE WHEN has_completed_details = true THEN 1 END) as has_completed_details_count
FROM students;