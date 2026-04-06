-- Add missing columns to bookings_new table

-- Notes field for customer booking notes
ALTER TABLE bookings_new ADD COLUMN IF NOT EXISTS notes TEXT;

-- Instructor notes for feedback visible to students
ALTER TABLE bookings_new ADD COLUMN IF NOT EXISTS instructor_notes TEXT;

-- Verify columns were added
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bookings_new';
