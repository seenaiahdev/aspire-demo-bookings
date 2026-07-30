-- ========================================================
-- ASPIRE NEXT EDU TECH — SUPABASE DATABASE SCHEMA
-- Execute this SQL in your Supabase SQL Editor
-- ========================================================

-- 1. Create demo_bookings table
CREATE TABLE IF NOT EXISTS demo_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id VARCHAR(50) UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  email TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  year_of_study TEXT NOT NULL,
  demo_slot TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate registration for the same email or mobile number
  CONSTRAINT unique_email UNIQUE (email),
  CONSTRAINT unique_mobile UNIQUE (mobile)
);

-- 2. Index for quick lookups by email and mobile
CREATE INDEX IF NOT EXISTS idx_bookings_email ON demo_bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_mobile ON demo_bookings(mobile);
CREATE INDEX IF NOT EXISTS idx_bookings_registration_id ON demo_bookings(registration_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow service role full access
CREATE POLICY "Allow backend service role full access" 
ON demo_bookings 
FOR ALL 
USING (true) 
WITH CHECK (true);
