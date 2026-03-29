-- Migration: Create availability_rules and blocked_slots tables for instructor persistence
-- Run this in Supabase SQL Editor

-- Availability Rules table
CREATE TABLE IF NOT EXISTS availability_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('TIME_BLOCK', 'EXCEPTION', 'MAX_BOOKING')),
  priority INTEGER DEFAULT 10,
  day_type TEXT DEFAULT 'ALL_DAYS' CHECK (day_type IN ('ALL_DAYS', 'WEEKDAY', 'WEEKEND')),
  start_time TEXT,
  end_time TEXT,
  max_bookings INTEGER DEFAULT 1,
  repeat_type TEXT DEFAULT 'REPEATING' CHECK (repeat_type IN ('REPEATING', 'ONE_TIME')),
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blocked Slots table
CREATE TABLE IF NOT EXISTS blocked_slots (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, time)
);

-- Enable RLS
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations (instructor-only app)
CREATE POLICY "Allow all" ON availability_rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON blocked_slots FOR ALL USING (true) WITH CHECK (true);

-- Optional: Create indexes
CREATE INDEX IF NOT EXISTS idx_rules_enabled ON availability_rules(enabled);
CREATE INDEX IF NOT EXISTS idx_rules_priority ON availability_rules(priority);
CREATE INDEX IF NOT EXISTS idx_blocked_date ON blocked_slots(date);
