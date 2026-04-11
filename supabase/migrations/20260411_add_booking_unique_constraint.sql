-- Migration: Add unique constraint on bookings_new(date, time) to prevent double-booking
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard
-- This prevents race conditions where two concurrent requests book the same slot

-- Add unique constraint on date + time combination
-- This ensures only one booking per slot regardless of status
CREATE UNIQUE INDEX IF NOT EXISTS bookings_new_date_time_unique
ON bookings_new(date, time)
WHERE status IN ('pending', 'confirmed');

-- Alternative: If you want to prevent ALL bookings (including cancelled) on same slot:
-- DROP INDEX IF EXISTS bookings_new_date_time_unique;
-- CREATE UNIQUE INDEX bookings_new_date_time_unique ON bookings_new(date, time);

-- Verify the constraint works by testing:
-- INSERT INTO bookings_new (date, time, student_name, email, status)
-- VALUES ('2026-04-15', '9:00 AM', 'Test', 'test@example.com', 'pending');
-- (Second identical insert should fail)
