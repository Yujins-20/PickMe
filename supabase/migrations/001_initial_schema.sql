-- supabase/migrations/001_initial_schema.sql
-- PickMe Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Voting Rooms Table
CREATE TABLE voting_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_code VARCHAR(10) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    settings JSONB DEFAULT '{}'::jsonb
);

-- Voting Items Table
CREATE TABLE voting_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES voting_rooms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    metadata JSONB,
    rating DECIMAL(10, 2) DEFAULT 1500,
    comparisons INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comparisons Table (tracks each pairwise comparison)
CREATE TABLE comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES voting_rooms(id) ON DELETE CASCADE,
    user_id UUID,
    winner_id UUID NOT NULL REFERENCES voting_items(id) ON DELETE CASCADE,
    loser_id UUID NOT NULL REFERENCES voting_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences Table (for learning user taste)
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    category VARCHAR(100) NOT NULL,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category)
);

-- Indexes for performance
CREATE INDEX idx_voting_rooms_code ON voting_rooms(room_code);
CREATE INDEX idx_voting_rooms_status ON voting_rooms(status);
CREATE INDEX idx_voting_items_room ON voting_items(room_id);
CREATE INDEX idx_voting_items_rating ON voting_items(room_id, rating DESC);
CREATE INDEX idx_comparisons_room ON comparisons(room_id);
CREATE INDEX idx_comparisons_created ON comparisons(created_at DESC);
CREATE INDEX idx_user_preferences_user ON user_preferences(user_id, category);

-- Function to generate random room code
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS VARCHAR(10) AS $$
DECLARE
    chars VARCHAR(36) := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(10) := '';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_preferences updated_at
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE voting_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Public can read all voting rooms and items
CREATE POLICY "Public can view voting rooms" ON voting_rooms
    FOR SELECT USING (true);

CREATE POLICY "Public can view voting items" ON voting_items
    FOR SELECT USING (true);

-- Anyone can create rooms and items
CREATE POLICY "Anyone can create voting rooms" ON voting_rooms
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create voting items" ON voting_items
    FOR INSERT WITH CHECK (true);

-- Anyone can record comparisons
CREATE POLICY "Anyone can create comparisons" ON comparisons
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view comparisons" ON comparisons
    FOR SELECT USING (true);

-- Users can manage their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (true);
