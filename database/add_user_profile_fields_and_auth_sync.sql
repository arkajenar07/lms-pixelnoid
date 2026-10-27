-- ==============================================================================
-- MIGRATION: ADD PROFILE FIELDS (WHATSAPP, EMAIL, PEKERJAAN, INSTANSI)
-- DAN INTEGRASI VIEW JOIN ANTARA auth.users & public.users
-- ==============================================================================
-- Jalankan query ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- ── 1. TAMBAH KOLOM PADA TABEL public.users ───────────────────────────────────
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS pekerjaan text,
ADD COLUMN IF NOT EXISTS instansi text;

-- Tambah index pencarian cepat untuk email dan whatsapp
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON public.users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_whatsapp ON public.users (whatsapp);

-- ── 2. SINKRONISASI DATA EMAIL DARI auth.users KE public.users ─────────────────
UPDATE public.users u
SET email = a.email
FROM auth.users a
WHERE u.id = a.id
  AND (u.email IS NULL OR u.email <> a.email);

-- Sinkronisasi metadata whatsapp, pekerjaan, instansi jika ada di raw_user_meta_data
UPDATE public.users u
SET 
  whatsapp = COALESCE(u.whatsapp, a.raw_user_meta_data->>'whatsapp', a.raw_user_meta_data->>'phone'),
  pekerjaan = COALESCE(u.pekerjaan, a.raw_user_meta_data->>'pekerjaan', a.raw_user_meta_data->>'occupation'),
  instansi = COALESCE(u.instansi, a.raw_user_meta_data->>'instansi', a.raw_user_meta_data->>'institution', a.raw_user_meta_data->>'school')
FROM auth.users a
WHERE u.id = a.id;

-- ── 3. OTOMATISASI: TRIGGER SINKRONISASI SETIAP USER BARU / UPDATE EMAIL ───────
CREATE OR REPLACE FUNCTION public.handle_sync_auth_to_public_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    fullname, 
    username, 
    roles, 
    avatar_url, 
    whatsapp, 
    pekerjaan, 
    instansi
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'fullname',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    ),
    CASE 
      WHEN NEW.raw_user_meta_data->'role' IS NOT NULL AND jsonb_typeof(NEW.raw_user_meta_data->'role') = 'array' THEN 
        ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'role'))
      WHEN NEW.raw_user_meta_data->>'role' IS NOT NULL THEN 
        ARRAY[NEW.raw_user_meta_data->>'role']
      ELSE 
        ARRAY['student']::text[]
    END,
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', NEW.raw_user_meta_data->>'phone'),
    COALESCE(NEW.raw_user_meta_data->>'pekerjaan', NEW.raw_user_meta_data->>'occupation'),
    COALESCE(NEW.raw_user_meta_data->>'instansi', NEW.raw_user_meta_data->>'institution', NEW.raw_user_meta_data->>'school')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    fullname = COALESCE(public.users.fullname, EXCLUDED.fullname),
    username = COALESCE(public.users.username, EXCLUDED.username),
    avatar_url = COALESCE(public.users.avatar_url, EXCLUDED.avatar_url),
    whatsapp = COALESCE(public.users.whatsapp, EXCLUDED.whatsapp),
    pekerjaan = COALESCE(public.users.pekerjaan, EXCLUDED.pekerjaan),
    instansi = COALESCE(public.users.instansi, EXCLUDED.instansi);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_sync_auth_to_public_users ON auth.users;
CREATE TRIGGER tr_sync_auth_to_public_users
  AFTER INSERT OR UPDATE OF email, raw_user_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_sync_auth_to_public_users();


-- ── 4. VIEW JOIN public.users DAN auth.users (public.vw_users) ─────────────────
-- View ini memudahkan query langsung saat butuh data gabungan profil & akun
CREATE OR REPLACE VIEW public.vw_users AS
SELECT 
  u.id,
  COALESCE(u.email, a.email) AS email,
  u.fullname,
  u.username,
  u.roles,
  u.avatar_url,
  u.whatsapp,
  u.pekerjaan,
  u.instansi,
  a.email_confirmed_at,
  a.last_sign_in_at,
  a.created_at AS auth_created_at,
  a.phone AS auth_phone,
  a.raw_user_meta_data
FROM public.users u
LEFT JOIN auth.users a ON u.id = a.id;

-- Berikan izin akses select untuk view
GRANT SELECT ON public.vw_users TO authenticated, anon, service_role;
GRANT SELECT, UPDATE, INSERT ON public.users TO authenticated, service_role;

-- ── 5. FUNCTION HELPER UNTUK PENCARIAN USER BERDASARKAN DAFTAR EMAIL ──────────
-- Digunakan oleh API untuk memetakan nama, avatar, whatsapp, dan instansi
CREATE OR REPLACE FUNCTION public.get_users_by_emails(emails text[])
RETURNS TABLE (
  id uuid,
  email text,
  fullname text,
  username text,
  roles text[],
  avatar_url text,
  whatsapp text,
  pekerjaan text,
  instansi text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    u.id,
    LOWER(COALESCE(u.email, a.email)) AS email,
    u.fullname,
    u.username,
    u.roles,
    u.avatar_url,
    u.whatsapp,
    u.pekerjaan,
    u.instansi
  FROM public.users u
  LEFT JOIN auth.users a ON u.id = a.id
  WHERE LOWER(COALESCE(u.email, a.email)) = ANY(
    SELECT LOWER(unnest(emails))
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_users_by_emails(text[]) TO authenticated, service_role;
