-- STUDENT AID PORTAL DATABASE SETUP
-- Run in Supabase SQL Editor.
-- Never make student application records publicly readable.

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    country TEXT,
    education_level TEXT,
    role TEXT NOT NULL DEFAULT 'student'
        CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.funding_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    country TEXT,
    education_level TEXT,
    institution TEXT,
    program TEXT,
    study_start TEXT,
    funding_type TEXT,
    requested_amount NUMERIC,
    funding_purpose TEXT,
    additional_info TEXT,
    status TEXT NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_applications ENABLE ROW LEVEL SECURITY;

-- Remove the policies managed by this setup so it can be rerun.
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Students can view own applications" ON public.funding_applications;
DROP POLICY IF EXISTS "Students can insert own applications" ON public.funding_applications;
DROP POLICY IF EXISTS "Admins can view all funding applications" ON public.funding_applications;

-- Students may access only their own profile.
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (id = (SELECT auth.uid()) AND role = 'student');

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()) AND role = 'student');

-- Students can see only their own applications.
CREATE POLICY "Students can view own applications"
ON public.funding_applications FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Students can submit applications only for their own account.
CREATE POLICY "Students can insert own applications"
ON public.funding_applications FOR INSERT TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

-- Only users with an admin profile may view all applications.
CREATE POLICY "Admins can view all funding applications"
ON public.funding_applications FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = (SELECT auth.uid())
          AND p.role = 'admin'
    )
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT ON public.funding_applications TO authenticated;

-- Verify that the tables exist.
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'funding_applications')
ORDER BY table_name;
