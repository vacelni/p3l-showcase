-- Demo data for a showcase deployment. All names and prices are fictional.
-- Run after schema.sql and the migration files (see the header of schema.sql).

insert into public.schedules (title, category, date_start, date_end, price, location, min_participants, description, syllabus)
values
  ('Pelatihan & Sertifikasi BNSP Operator IPAL (POPAL)', 'BNSP',
   current_date + 21, current_date + 24, 'Rp 6.500.000', 'Hotel Contoh, Semarang', 10,
   'Pelatihan 4 hari dan uji kompetensi skema POPAL.',
   E'Hari 1: Karakteristik air limbah\nHari 2: Proses lumpur aktif\nHari 3: Praktik jar test\nHari 4: Uji kompetensi'),
  ('Pelatihan & Sertifikasi BNSP Penanggung Jawab Pengolahan Air Limbah (PPPA)', 'BNSP',
   current_date + 45, current_date + 48, 'Rp 7.500.000', 'Hotel Contoh, Jakarta Pusat', 10,
   'Untuk penanggung jawab IPAL di industri, rumah sakit, dan hotel.', null),
  ('Pelatihan Operasional IPAL Lumpur Aktif', 'Non-BNSP',
   current_date + 60, current_date + 61, 'Rp 3.500.000', 'Online (Zoom)', 5,
   'Troubleshooting bulking sludge, COD tinggi, dan efisiensi aerasi.', null);

insert into public.insights (title, type, category, date, excerpt)
values
  ('Cara Menurunkan COD Air Limbah: Contoh Artikel', 'Artikel', 'Teknis', current_date - 10,
   'Artikel contoh untuk deployment showcase. Isi artikel asli dikelola dari dasbor admin.'),
  ('Jadwal Pelatihan Bulan Depan', 'Berita', 'Pelatihan', current_date - 3,
   'Berita contoh: jadwal pelatihan terbaru sudah dibuka untuk pendaftaran.');
