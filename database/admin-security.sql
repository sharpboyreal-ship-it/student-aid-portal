-- Student Aid Portal: administrator access policy
-- Run this SQL in the Supabase SQL Editor, NOT in Bash.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_applications ENABLE ROW LEVEL SECURITY;

-- Only users whose profile role is admin can view all applications.
DROP POLICY IF EXISTS "Admins can view all funding applications"
ON public.funding_applications;

CREATE POLICY "Admins can view all funding applications"
ON public.funding_applications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'
  )
);

-- Students can view only their own applications.
DROP POLICY IF EXISTS "Students can view own applications"
ON public.funding_applications;

CREATE POLICY "Students can view own applications"
ON public.funding_applications
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid())
);

-- Students can submit applications only under their own user ID.
DROP POLICY IF EXISTS "Students can insert own applications"
ON public.funding_applications;

CREATE POLICY "Students can insert own applications"
ON public.funding_applications
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (SELECT auth.uid())
);

