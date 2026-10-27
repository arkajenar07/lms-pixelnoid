-- ==============================================================================
-- MIGRATION: ADD JOB & INSTITUTION COLUMNS (KOMPATIBILITAS DENGAN PEKERJAAN & INSTANSI)
-- ==============================================================================
-- Jalankan query ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- ── 1. TAMBAH KOLOM job & institution DI TABEL public.users ───────────────────
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS job text,
ADD COLUMN IF NOT EXISTS institution text;

-- ── 2. PASTIKAN KOLOM pekerjaan & instansi JUGA ADA ───────────────────────────
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS pekerjaan text,
ADD COLUMN IF NOT EXISTS instansi text;

-- ── 3. SINKRONISASI DATA DUA ARAH ─────────────────────────────────────────────
-- Isi job dari pekerjaan jika job masih kosong, dan sebaliknya
UPDATE public.users 
SET 
  job = COALESCE(job, pekerjaan),
  pekerjaan = COALESCE(pekerjaan, job),
  institution = COALESCE(institution, instansi),
  instansi = COALESCE(instansi, institution);

-- Sinkronisasi dari auth.users raw_user_meta_data jika ada data tersimpan di auth
UPDATE public.users u
SET 
  job = COALESCE(u.job, u.pekerjaan, a.raw_user_meta_data->>'job', a.raw_user_meta_data->>'pekerjaan', a.raw_user_meta_data->>'occupation'),
  pekerjaan = COALESCE(u.pekerjaan, u.job, a.raw_user_meta_data->>'pekerjaan', a.raw_user_meta_data->>'job', a.raw_user_meta_data->>'occupation'),
  institution = COALESCE(u.institution, u.instansi, a.raw_user_meta_data->>'institution', a.raw_user_meta_data->>'instansi', a.raw_user_meta_data->>'school'),
  instansi = COALESCE(u.instansi, u.institution, a.raw_user_meta_data->>'instansi', a.raw_user_meta_data->>'institution', a.raw_user_meta_data->>'school')
FROM auth.users a
WHERE u.id = a.id;

-- ── 4. PERBARUI VIEW public.vw_users AGAR MENCAKUP SEMUA ALIAS ────────────────
CREATE OR REPLACE VIEW public.vw_users AS
SELECT 
  u.id,
  COALESCE(u.email, a.email) AS email,
  u.fullname,
  u.username,
  u.roles,
  u.avatar_url,
  u.whatsapp,
  COALESCE(u.pekerjaan, u.job) AS pekerjaan,
  COALESCE(u.instansi, u.institution) AS instansi,
  COALESCE(u.job, u.pekerjaan) AS job,
  COALESCE(u.institution, u.instansi) AS institution,
  a.email_confirmed_at,
  a.last_sign_in_at,
  a.created_at AS auth_created_at,
  a.phone AS auth_phone,
  a.raw_user_meta_data
FROM public.users u
LEFT JOIN auth.users a ON u.id = a.id;

-- Berikan izin akses select untuk view
GRANT SELECT ON public.vw_users TO authenticated, anon, service_role;
