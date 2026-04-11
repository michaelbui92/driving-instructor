-- Add promo_code column to bookings_new for free test bookings
ALTER TABLE bookings_new 
ADD COLUMN IF NOT EXISTS promo_code TEXT;

-- Also add price column if it doesn't exist (for storing $0 when promo applied)
ALTER TABLE bookings_new 
ADD COLUMN IF NOT EXISTS price NUMERIC(10,2);
