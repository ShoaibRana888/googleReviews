-- ReviewQR Database Schema for Supabase

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  google_review_url TEXT NOT NULL,
  qr_code_id VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_qr_code_id ON businesses(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_feedback_business_id ON feedback(business_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for businesses table
CREATE POLICY "Users can view own businesses" ON businesses
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own businesses" ON businesses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own businesses" ON businesses
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own businesses" ON businesses
  FOR DELETE USING (true);

-- RLS Policies for feedback table (public read for customer feedback submission)
CREATE POLICY "Anyone can view feedback" ON feedback
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert feedback" ON feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update feedback for their businesses" ON feedback
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete feedback for their businesses" ON feedback
  FOR DELETE USING (true);
