-- =====================================================
-- Student Login System - Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────
-- STUDENTS TABLE
-- Links to auth.users and stores student profile info
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-create student record on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.students (auth_user_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create student on auth.users signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────
-- BOOKING CLAIM CODES (reference codes in emails)
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS booking_claim_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  claim_code TEXT NOT NULL,          -- 6-digit code shown in email
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  claimed_at TIMESTAMP WITH TIME ZONE,
  claimed_by UUID REFERENCES students(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────────────
-- EXISTING BOOKINGS TABLE - Add student_id column
-- ─────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'student_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN student_id UUID REFERENCES students(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'claim_code'
  ) THEN
    ALTER TABLE bookings ADD COLUMN claim_code TEXT;
  END IF;
END $$;

-- ─────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_claim_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Students can only see their own record
CREATE POLICY "Students can view own profile"
  ON students FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Students can update own profile"
  ON students FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Bookings: students can only see bookings matching their email
-- (this covers both claimed and email-matched bookings)
CREATE POLICY "Students can view own bookings by email"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.auth_user_id = auth.uid()
      AND students.email = bookings.email
    )
  );

CREATE POLICY "Students can update own bookings by email"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.auth_user_id = auth.uid()
      AND students.email = bookings.email
    )
  );

-- Instructors (authenticated service role) can do everything
-- (handled by service role key, not RLS)

-- Claim codes viewable by student if they own the booking
CREATE POLICY "Students can view claim codes for own bookings"
  ON booking_claim_codes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN bookings b ON b.id = booking_claim_codes.booking_id
      WHERE s.auth_user_id = auth.uid()
      AND s.email = b.email
    )
  );

-- ─────────────────────────────────────────────────────
-- EMAIL TEMPLATES (Supabase Auth configuration)
-- ─────────────────────────────────────────────────────
-- These are configured in Supabase Dashboard > Authentication > Email Templates
-- 
-- Template: Signup (for student registration)
-- Subject: Confirm your email for Drive with Bui
-- 
-- Template: Magic Link / OTP
-- Subject: Your login code for Drive with Bui

-- =====================================================
-- SUMMARY OF FLOW
-- =====================================================
--
-- GUEST BOOKING:
--   1. Student books without logging in
--   2. Booking created with email (no student_id)
--   3. 6-digit claim_code generated and stored in booking_claim_codes
--   4. Confirmation email includes claim_code as reference
--
-- LOGIN:
--   1. Student goes to /student/login, enters email
--   2. Supabase sends OTP to email
--   3. Student enters OTP, authenticated via session
--   4. RLS automatically shows all bookings with matching email
--
-- The claim_code is just a reference number. The actual
-- linking is done via email match on login (via RLS policy).
