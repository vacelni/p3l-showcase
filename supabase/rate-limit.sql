-- =====================================================================
-- Pembatas jumlah request (rate limit) untuk formulir pendaftaran & login admin.
-- Jalankan sekali di Supabase → SQL Editor. Aman dijalankan ulang.
--
-- Tanpa tabel ini website tetap jalan, tetapi pembatasnya hanya disimpan di
-- memori server (reset setiap deploy / cold start). Dengan tabel ini batasnya
-- berlaku untuk semua server Vercel dan tahan restart.
-- =====================================================================

create table if not exists public.rate_limits (
  key          text primary key,
  count        integer     not null default 0,
  window_start timestamptz not null default now()
);

-- Tidak ada policy: publik (anon key) sama sekali tidak bisa membaca/menulis.
alter table public.rate_limits enable row level security;

-- Catat (atau intip) satu percobaan untuk sebuah kunci dalam jendela waktu tertentu.
-- Mengembalikan jumlah percobaan di jendela berjalan, termasuk yang baru dicatat.
create or replace function public.p3l_rate_limit(p_key text, p_window_seconds integer, p_consume boolean default true)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if not p_consume then
    select case when window_start > now() - make_interval(secs => p_window_seconds) then count else 0 end
      into v_count
      from rate_limits where key = p_key;
    return coalesce(v_count, 0);
  end if;

  insert into rate_limits as r (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update
    set count = case when r.window_start > now() - make_interval(secs => p_window_seconds) then r.count + 1 else 1 end,
        window_start = case when r.window_start > now() - make_interval(secs => p_window_seconds) then r.window_start else now() end
  returning count into v_count;

  -- Bersihkan baris lama sesekali agar tabel tidak membengkak.
  if random() < 0.02 then
    delete from rate_limits where window_start < now() - interval '2 days';
  end if;

  return v_count;
end;
$$;

-- Hanya server (service role) yang boleh memanggil fungsi ini.
revoke all on function public.p3l_rate_limit(text, integer, boolean) from public, anon, authenticated;
grant execute on function public.p3l_rate_limit(text, integer, boolean) to service_role;
