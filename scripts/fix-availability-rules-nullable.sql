-- ==============================================================================
-- Fix availability_rules table schema for MAX_BOOKING support
-- ==============================================================================

-- Step 1: Drop the existing CHECK constraint on type column
ALTER TABLE availability_rules DROP CONSTRAINT IF EXISTS availability_rules_type_check;

-- Step 2: Add new CHECK constraint with all rule types
ALTER TABLE availability_rules 
  ADD CONSTRAINT availability_rules_type_check 
  CHECK (type IN ('TIME_BLOCK', 'EXCEPTION', 'MAX_BOOKING', 'weekly', 'specific_date', 'recurring'));

-- Step 3: Make start_time nullable (required for MAX_BOOKING rules)
ALTER TABLE availability_rules 
  ALTER COLUMN start_time DROP NOT NULL;

-- Step 4: Make end_time nullable (required for MAX_BOOKING rules)
ALTER TABLE availability_rules 
  ALTER COLUMN end_time DROP NOT NULL;

-- Step 5: Handle any existing NULL values that might violate NOT NULL
-- Set placeholder times for existing rules that need them
UPDATE availability_rules 
SET start_time = '00:00', end_time = '23:59' 
WHERE start_time IS NULL OR end_time IS NULL;

-- Step 6: Verify the table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'availability_rules';

-- ==============================================================================
-- Note: After running this, restart the app to pick up the 8-hour session timeout
-- ==============================================================================
