-- Update the entries table to include emotion data
ALTER TABLE entries ADD COLUMN IF NOT EXISTS emotion TEXT;
ALTER TABLE entries ADD COLUMN IF NOT EXISTS emotion_probabilities JSONB;
ALTER TABLE entries ADD COLUMN IF NOT EXISTS ai_insights TEXT;
ALTER TABLE entries ADD COLUMN IF NOT EXISTS ai_suggestions TEXT;

-- Update the table structure to match what we need
ALTER TABLE entries ALTER COLUMN content TYPE TEXT;
ALTER TABLE entries ADD COLUMN IF NOT EXISTS content TEXT;

-- Make sure we have all the columns we need
DO $$ 
BEGIN
    -- Add content column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'entries' AND column_name = 'content') THEN
        ALTER TABLE entries ADD COLUMN content TEXT;
    END IF;
    
    -- Add emotion column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'entries' AND column_name = 'emotion') THEN
        ALTER TABLE entries ADD COLUMN emotion TEXT;
    END IF;
    
    -- Add emotion_probabilities column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'entries' AND column_name = 'emotion_probabilities') THEN
        ALTER TABLE entries ADD COLUMN emotion_probabilities JSONB;
    END IF;
    
    -- Add ai_insights column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'entries' AND column_name = 'ai_insights') THEN
        ALTER TABLE entries ADD COLUMN ai_insights TEXT;
    END IF;
    
    -- Add ai_suggestions column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'entries' AND column_name = 'ai_suggestions') THEN
        ALTER TABLE entries ADD COLUMN ai_suggestions TEXT;
    END IF;
END $$;
