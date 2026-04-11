-- Student skill levels and self-assessment
CREATE TABLE IF NOT EXISTS student_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  skill_key TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  self_assessment INTEGER DEFAULT 0 CHECK (self_assessment >= 0 AND self_assessment <= 5),
  instructor_rating INTEGER DEFAULT 0 CHECK (instructor_rating >= 0 AND instructor_rating <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, skill_key)
);

-- Add onboarding_completed field to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS onboarding_skipped BOOLEAN DEFAULT FALSE;

-- Skill assessment history
CREATE TABLE IF NOT EXISTS skill_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  skill_key TEXT NOT NULL,
  old_rating INTEGER,
  new_rating INTEGER,
  change_type TEXT CHECK (change_type IN ('self_assessment', 'instructor')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE OR REPLACE TRIGGER update_student_skills_updated_at
  BEFORE UPDATE ON student_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
