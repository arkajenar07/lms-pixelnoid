-- ============================================================
-- PIXELNOID — Database Trigger: Sinkronisasi auth.users → users
-- ============================================================
-- Jalankan SQL ini di: Supabase Dashboard → SQL Editor
-- Tujuan: Setiap kali ada user baru di auth.users (baik via Admin API
--         maupun signUp biasa), tabel `public.users` otomatis terisi.
-- ============================================================

-- 1. Buat fungsi trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer        -- jalankan dengan hak pemilik function, bukan caller
set search_path = public -- hindari serangan search_path injection
as $$
begin
  insert into public.users (
    id,
    fullname,
    username,
    roles,
    avatar_url
  )
  values (
    new.id,
    -- Ambil dari user_metadata yang dikirim saat Admin API / signUp
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    -- roles disimpan sebagai array text; jika tidak ada, default ke ['student']
    case
      when new.raw_user_meta_data->'role' is not null
        then array(select jsonb_array_elements_text(new.raw_user_meta_data->'role'))
      else array['student']
    end,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;  -- idempotent: abaikan jika sudah ada (insert manual sebelumnya)

  return new;
end;
$$;

-- 2. Pasang trigger ke tabel auth.users
--    (drop dulu jika sudah ada, agar tidak dobel)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();


-- ============================================================
-- CATATAN PENTING
-- ============================================================
-- Dengan trigger ini + Admin API (email_confirm: true):
--   1. Admin klik "Buat Akun" di /admin/users
--   2. Server API memanggil admin.createUser → auth.users terisi
--   3. Trigger otomatis insert ke public.users dalam transaksi yang sama
--   4. Akun langsung aktif, tidak perlu klik email
--
-- Server API kita (/api/admin/create-user) juga melakukan upsert ke
-- public.users sebagai fallback jika trigger belum terpasang.
-- ============================================================
