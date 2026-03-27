-- Export data from Supabase to CSV
-- Run in Supabase SQL Editor

-- Method 1: Export to CSV (recommended)
COPY bookings TO STDOUT WITH (FORMAT csv, HEADER true);

-- Method 2: Get as INSERT statements (alternative)
SELECT 
  'INSERT INTO bookings (id, student_name, email, phone, date, time, lesson_type, status, created_at, updated_at, archived) VALUES (' ||
  '''' || id || ''', ' ||
  '''' || REPLACE(student_name, '''', '''''') || ''', ' ||
  '''' || email || ''', ' ||
  '''' || phone || ''', ' ||
  '''' || date || ''', ' ||
  '''' || time || ''', ' ||
  '''' || lesson_type || ''', ' ||
  '''' || status || ''', ' ||
  '''' || created_at || ''', ' ||
  '''' || COALESCE(updated_at::text, created_at::text) || ''', ' ||
  COALESCE(archived::text, 'false') ||
  ');' as insert_statement
FROM bookings
ORDER BY created_at;

-- Check what data we have
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
  SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
FROM bookings;