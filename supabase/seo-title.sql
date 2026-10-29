-- =====================================================================
-- Judul SEO terpisah untuk artikel.
-- Jalankan sekali di Supabase → SQL Editor SEBELUM kode yang menyimpan
-- insights.seo_title di-deploy.
--
--   * seo_title: dipakai untuk <title> di hasil Google (maks. 59 karakter
--     + " | P3L"). Kosong = memakai judul artikel. Judul di halaman dan
--     URL artikel tidak berubah.
-- =====================================================================

alter table public.insights add column if not exists seo_title text;

comment on column public.insights.seo_title is 'Judul pendek untuk <title> Google (maks. 59 karakter); kosong = pakai title.';

update public.insights set seo_title = v.seo_title
from (values
  (1,  'Perubahan Peringkat PROPER Industri 2025 (KepMen LH 2026)'),
  (2,  'Peringkat PROPER Industri 2025: Hasil Penilaian 2024–2025'),
  (3,  'Hasil PROPER Hotel 2025: Penilaian Ketaatan Perhotelan'),
  (4,  'Optimalisasi Lumpur Aktif IPAL Industri Makanan & Minuman'),
  (5,  'Efisiensi Biaya IPAL Rumah Sakit Tanpa Melanggar Baku Mutu'),
  (6,  'Pelatihan Operasional IPAL Semarang – Agustus 2026'),
  (7,  'Pelatihan Operasional IPAL Jakarta – September 2026'),
  (11, 'Cara Menurunkan COD Air Limbah Tinggi: 8 Penyebab & Solusi'),
  (12, 'Bulking Sludge Lumpur Aktif: Penyebab dan Cara Mengatasi'),
  (13, 'POPAL vs PPPA: Sertifikasi BNSP Mana yang Anda Butuhkan?'),
  (14, 'Dari WWTP Menjadi WRRF: Paradigma Baru Pengolahan Limbah'),
  (15, 'Lumpur Aktif untuk Pemanfaatan Nutrisi N dan P Air Limbah')
) as v (id, seo_title)
where insights.id = v.id;
