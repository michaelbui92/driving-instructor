-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  lesson_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  instructor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create availability_rules table
CREATE TABLE IF NOT EXISTS availability_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('weekly', 'specific_date', 'recurring')),
  day_type TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  priority INTEGER DEFAULT 0,
  repeat_type TEXT CHECK (repeat_type IN ('weekly', 'biweekly', 'monthly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create instructor_profile table
CREATE TABLE IF NOT EXISTS instructor_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio TEXT,
  experience TEXT,
  teaching_philosophy TEXT,
  car_details TEXT,
  service_area TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial instructor profile
INSERT INTO instructor_profile (bio, experience, teaching_philosophy, car_details, service_area)
VALUES (
  'Experienced driving instructor with a passion for teaching safe driving habits. Currently awaiting final license approval.',
  '5+ years teaching students of all ages, 100+ students successfully passed their driving tests',
  'I believe in building confidence through patient, structured lessons tailored to each student''s learning style.',
  'Automatic transmission vehicle with dual controls for safety',
  'Lidcombe and surrounding suburbs in Western Sydney'
) ON CONFLICT DO NOTHING;

-- Insert availability rules from existing JSON structure
-- Monday to Friday rules
INSERT INTO availability_rules (type, day_type, start_time, end_time, priority, repeat_type)
VALUES 
  ('weekly', 'monday', '09:00', '17:00', 1, 'weekly'),
  ('weekly', 'tuesday', '09:00', '17:00', 1, 'weekly'),
  ('weekly', 'wednesday', '09:00', '17:00', 1, 'weekly'),
  ('weekly', 'thursday', '09:00', '17:00', 1, 'weekly'),
  ('weekly', 'friday', '09:00', '17:00', 1, 'weekly'),
  ('weekly', 'saturday', '09:00', '15:00', 1, 'weekly')
ON CONFLICT DO NOTHING;