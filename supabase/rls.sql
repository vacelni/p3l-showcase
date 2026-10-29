-- =====================================================================
-- Row Level Security untuk database P3L
-- Jalankan di Supabase → SQL Editor SETELAH SUPABASE_SERVICE_ROLE_KEY
-- di-set di Vercel (dan .env.local), karena admin & pendaftaran kini
-- menulis lewat server dengan service role key.
--
-- Hasilnya:
--   * Publik (anon key di browser) HANYA bisa membaca jadwal & konten yang aktif.
--   * Tabel registrations (data pribadi pendaftar) tidak bisa dibaca/diubah publik.
--   * Semua penulisan hanya lewat server (service role melewati RLS).
-- =====================================================================

alter table public.schedules     enable row level security;
alter table public.insights      enable row level security;
alter table public.registrations enable row level security;

-- Hapus policy lama yang mungkin terlalu longgar (abaikan jika tidak ada).
do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('schedules', 'insights', 'registrations')
  loop
    execute format('drop policy if exists %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

create policy "Publik membaca jadwal aktif"
  on public.schedules for select
  to anon, authenticated
  using (is_active = true);

create policy "Publik membaca konten aktif"
  on public.insights for select
  to anon, authenticated
  using (coalesce(is_active, true) = true);

-- Sengaja TIDAK ada policy untuk registrations: hanya service role (server) yang bisa akses.
