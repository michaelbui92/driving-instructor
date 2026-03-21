# Supabase Setup Instructions

## 1. Create Tables in Supabase

Go to your Supabase dashboard at: https://cxmpdqsqbwmelywssuew.supabase.co

### Method A: SQL Editor
1. Navigate to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the contents of `scripts/create-tables.sql`
4. Click **Run** to execute

### Method B: Table Editor
Alternatively, you can create tables manually:

#### Bookings Table
```sql
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  lesson_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Availability Rules Table
```sql
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
```

#### Instructor Profile Table
```sql
CREATE TABLE IF NOT EXISTS instructor_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio TEXT,
  experience TEXT,
  teaching_philosophy TEXT,
  car_details TEXT,
  service_area TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 2. Insert Initial Data

After creating tables, run these inserts:

```sql
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
INSERT INTO availability_rules (type, day_type, start_time, end_time, priority, repeat_type)
VALUES 
  ('weekly', 'monday', '09:00', '17:00', 1, 'weekly'),
  ('weekly', 'tuesday', '09:00', '17:00', 1, 'weekly'),
  ('weekly', 'wednesday', '09:00', '17:00', 1, 'weekly'),
  ('weekly', 'thursday', '09:00', '17:00', 1, 'weekly'),
  ('weekly', 'friday', '09:00', '17:00', 1, 'weekly'),
  ('weekly', 'saturday', '09:00', '15:00', 1, 'weekly')
ON CONFLICT DO NOTHING;
```

## 3. Set Up Row Level Security (RLS)

For production, you should enable Row Level Security:

### Bookings Table
```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public insert" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "Allow public update" ON bookings
  FOR UPDATE USING (true);
```

### Availability Rules Table
```sql
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select" ON availability_rules
  FOR SELECT USING (true);
```

### Instructor Profile Table
```sql
ALTER TABLE instructor_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select" ON instructor_profile
  FOR SELECT USING (true);
```

## 4. Test the API

After setting up tables, test the API endpoints:

1. **Check availability**: `GET /api/availability?date=2026-03-22`
2. **Create booking**: `POST /api/bookings` with JSON body
3. **List bookings**: `GET /api/bookings`

## 5. Update Booking Page

The booking page (`app/book/page.tsx`) still uses localStorage. You'll need to update it to:
1. Fetch availability from `/api/availability`
2. Submit bookings to `/api/bookings`
3. Store booking confirmation from API response

## Environment Variables

Make sure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=https://cxmpdqsqbwmelywssuew.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4bXBkcXNxYndtZWx5d3NzdWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMTk4NTAsImV4cCI6MjA4OTY5NTg1MH0.TyDqKmGhLA3ut_VqFF5VcQx-x8B6S5rf_g3bIxayWcA
```

## Next Steps

1. Run the SQL in Supabase dashboard
2. Test API endpoints work
3. Update booking page to use new API
4. Consider running migration script if you have existing localStorage data
5. Deploy to Vercel/Netlify with environment variables set