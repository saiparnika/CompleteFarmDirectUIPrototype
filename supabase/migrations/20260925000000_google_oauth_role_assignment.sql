-- ============================================================
-- Phase 7: Google OAuth — Secure Role Assignment
-- ============================================================
--
-- Problem:
--   The handle_new_user() trigger fires for Google OAuth users
--   and auto-assigns role='buyer' because Google metadata has
--   no 'role' field. The user never gets to choose.
--
--   The frontend cannot directly INSERT/UPDATE profiles because:
--   1. No INSERT/UPDATE GRANT exists on profiles for authenticated
--   2. handle_profile_update() blocks non-admin role changes
--   3. No INSERT RLS policy exists on profiles
--
-- Solution:
--   A SECURITY DEFINER RPC that allows a user to set their role
--   exactly ONCE, only if their profile was auto-created by the
--   trigger (i.e. user_metadata has no 'role' key yet).
--
--   This avoids:
--   - Adding INSERT/UPDATE grants on profiles (weakens security)
--   - Modifying handle_new_user() (breaks email/password signup)
--   - Modifying handle_profile_update() (weakens role protection)
-- ============================================================

CREATE OR REPLACE FUNCTION public.assign_initial_role(p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid;
    v_current_profile record;
    v_user_meta jsonb;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Only allow valid non-admin roles
    IF p_role NOT IN ('farmer', 'buyer', 'bulk_buyer') THEN
        RAISE EXCEPTION 'Invalid role. Must be farmer, buyer, or bulk_buyer.';
    END IF;

    -- Fetch the user's auth metadata to check if they already chose a role
    SELECT raw_user_meta_data INTO v_user_meta
    FROM auth.users
    WHERE id = v_user_id;

    -- If user_metadata already contains a 'role' key, the user chose their role
    -- during email/password signup or a previous call. Block re-assignment.
    IF v_user_meta IS NOT NULL AND v_user_meta ? 'role' THEN
        RAISE EXCEPTION 'Role has already been assigned. Contact support to change your role.';
    END IF;

    -- Fetch current profile (auto-created by handle_new_user trigger)
    SELECT * INTO v_current_profile
    FROM public.profiles
    WHERE id = v_user_id;

    IF NOT FOUND THEN
        -- Edge case: profile wasn't created by trigger (shouldn't happen, but handle it)
        INSERT INTO public.profiles (id, full_name, role, is_verified)
        VALUES (
            v_user_id,
            COALESCE(v_user_meta->>'full_name', v_user_meta->>'name', 'User'),
            p_role,
            false
        );
    ELSE
        -- The handle_profile_update() BEFORE UPDATE trigger reverts role changes
        -- for non-admin users (NEW.role = OLD.role). We must temporarily disable
        -- it to allow this one-time role assignment.
        --
        -- This is safe because:
        -- 1. This function is SECURITY DEFINER (runs as table owner)
        -- 2. We re-enable in a finally-equivalent block
        -- 3. The entire function runs in a single transaction — if it fails,
        --    PostgreSQL rolls back ALL changes including the ALTER TABLE
        --
        -- Note: ALTER TABLE ... DISABLE/ENABLE TRIGGER is transactional in
        -- PostgreSQL — if the transaction rolls back, the trigger state reverts.
        ALTER TABLE public.profiles DISABLE TRIGGER on_profile_update;

        UPDATE public.profiles
        SET role = p_role,
            full_name = COALESCE(
                NULLIF(v_current_profile.full_name, ''),
                v_user_meta->>'full_name',
                v_user_meta->>'name',
                'User'
            ),
            updated_at = now()
        WHERE id = v_user_id;

        ALTER TABLE public.profiles ENABLE TRIGGER on_profile_update;
    END IF;

    -- Stamp the role into user_metadata so this function cannot be called again.
    -- This is the authoritative "role has been chosen" marker.
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', p_role)
    WHERE id = v_user_id;
END;
$$;

-- Restrict execution to authenticated users only
REVOKE EXECUTE ON FUNCTION public.assign_initial_role(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_initial_role(text) TO authenticated;
