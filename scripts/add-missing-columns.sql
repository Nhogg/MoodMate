-- Add missing columns to the entries table
ALTER TABLE entries ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE entries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE entries ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Update existing entries to have timestamps
UPDATE entries SET 
  created_at = NOW(),
  updated_at = NOW()
WHERE created_at IS NULL OR updated_at IS NULL;

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);

-- Create an index on date for better performance
CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
