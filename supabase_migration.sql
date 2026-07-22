-- ==========================================
-- Supabase / PostgreSQL Schema Migration Script
-- FreshGuard - Food Expiry & Waste Tracker
-- ==========================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
    username TEXT PRIMARY KEY,
    password TEXT,
    role TEXT DEFAULT 'user',
    provider TEXT DEFAULT 'local',
    email TEXT,
    displayName TEXT,
    resetToken TEXT,
    resetTokenExpiry BIGINT,
    adminVerifyCode TEXT,
    adminVerifyStatus TEXT,
    phone TEXT,
    profilePic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Create Failed Logins Tracking Table
CREATE TABLE IF NOT EXISTS public.failed_logins (
    username TEXT PRIMARY KEY REFERENCES public.users(username) ON DELETE CASCADE,
    attempts INTEGER DEFAULT 0,
    lastAttempt BIGINT,
    alertSent INTEGER DEFAULT 0
);

-- 3. Create Food Items Table
CREATE TABLE IF NOT EXISTS public.food_items (
    id TEXT PRIMARY KEY,
    username TEXT REFERENCES public.users(username) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    storage TEXT,
    qty NUMERIC,
    unit TEXT,
    dateAdded TEXT,
    dateExpiry TEXT,
    imageData TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Create History Log Table
CREATE TABLE IF NOT EXISTS public.history_log (
    id TEXT PRIMARY KEY,
    username TEXT REFERENCES public.users(username) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    storage TEXT,
    qty NUMERIC,
    unit TEXT,
    resolution TEXT,
    dateHandled TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS) policies (Optional/Recommended for Supabase)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_log ENABLE ROW LEVEL SECURITY;

-- Allow public service / anon access if using backend API or direct client queries
CREATE POLICY "Allow public full access to users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public full access to failed_logins" ON public.failed_logins FOR ALL USING (true);
CREATE POLICY "Allow public full access to food_items" ON public.food_items FOR ALL USING (true);
CREATE POLICY "Allow public full access to history_log" ON public.history_log FOR ALL USING (true);

-- Seed Default Admin and User Accounts
-- Password for admin is 'admin123' hashed with bcrypt ($2a$10$...)
-- Password for user is 'user123' hashed with bcrypt ($2a$10$...)
INSERT INTO public.users (username, password, role, provider)
VALUES 
    ('admin', '$2a$10$u4v5jF9v4uN.N9T60hNxe.70j04w6GzF68k5hF0h99Rz.N0JmO.Sy', 'admin', 'local'),
    ('user', '$2a$10$wN1G27s.sO1sUvLgDq6Q.Oa7h0M1N1.1h1L.QG5G0g8W8k3N1x1', 'user', 'local')
ON CONFLICT (username) DO NOTHING;
