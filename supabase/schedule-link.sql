-- =====================================================================
-- Kaitkan pendaftar ke jadwal & batasi nilai status pembayaran.
-- Jalankan sekali di Supabase → SQL Editor SEBELUM kode yang mengisi
-- registrations.schedule_id di-deploy.
--
--   * schedule_id: relasi ke schedules.id (tampil sebagai garis di Schema
--     Visualizer). Jika jadwal dihapus, pendaftar tetap ada dan schedule_id
--     menjadi null; program_pilihan menyimpan judul saat mendaftar.
--   * status_pembayaran hanya boleh berisi pilihan yang ada di admin.
-- =====================================================================

alter table public.registrations
  add column if not exists schedule_id integer references public.schedules (id) on delete set null;

create index if not exists registrations_schedule_id_idx on public.registrations (schedule_id);

-- Isi data lama dari judul program, hanya jika judulnya tidak kembar.
update public.registrations r
set schedule_id = s.id
from public.schedules s
where r.schedule_id is null
  and s.title = r.program_pilihan
  and (select count(*) from public.schedules s2 where s2.title = s.title) = 1;

update public.registrations set status_pembayaran = 'Menunggu Pembayaran' where status_pembayaran is null;

alter table public.registrations
  alter column status_pembayaran set default 'Menunggu Pembayaran',
  alter column status_pembayaran set not null;

alter table public.registrations drop constraint if exists registrations_status_pembayaran_check;
alter table public.registrations
  add constraint registrations_status_pembayaran_check
  check (status_pembayaran in ('Menunggu Pembayaran', 'Lunas / Terkonfirmasi'));

comment on column public.registrations.schedule_id is 'Jadwal yang dipilih; null jika jadwalnya sudah dihapus.';
comment on column public.registrations.program_pilihan is 'Judul program saat mendaftar (tetap meski jadwal diedit atau dihapus).';
