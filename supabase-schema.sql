-- ==========================================================
-- SUPABASE SCHEMA UNTUK PORTOFOLIO DANENDRA ATHALLAH INDIARTO
-- (Junior Backend Developer & Database Management)
-- Jalankan skrip ini di SQL Editor pada Supabase Dashboard
-- ==========================================================

-- 1. TABEL PROFILE (Menyimpan foto avatar & data profil dinamis)
CREATE TABLE IF NOT EXISTS public.profile (
  id TEXT PRIMARY KEY DEFAULT 'main-profile',
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  whatsapp_number TEXT,
  email TEXT,
  location TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  formspree_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABEL PROJECTS (Koleksi portofolio proyek backend & database)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  category TEXT DEFAULT 'Aplikasi Web',
  featured BOOLEAN DEFAULT FALSE,
  metrics TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL CERTIFICATES (Koleksi sertifikat resmi)
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT,
  credential_url TEXT,
  image_url TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BUCKET STORAGE UNTUK ASSET (Foto Avatar, Screenshot Proyek, File Sertifikat)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 5. ATURAN KEAMANAN & AKSES (RLS & Storage Policies)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Allow all profile" ON public.profile FOR ALL USING (true);

CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow all projects" ON public.projects FOR ALL USING (true);

CREATE POLICY "Allow public read certs" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow all certs" ON public.certificates FOR ALL USING (true);

CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Insert Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Public Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-assets');

-- 6. DATA AWAL (SEED DATA BERDASARKAN CV DANENDRA)
INSERT INTO public.profile (id, name, title, tagline, bio, avatar_url, resume_url, whatsapp_number, email, location, github_url, linkedin_url, instagram_url)
VALUES (
  'main-profile',
  'Danendra Athallah Indiarto',
  'Junior Backend Developer',
  'Junior Backend Developer & Database Management',
  'Halo, saya Danendra Athallah Indiarto. Berfokus pada perancangan RESTful API yang efisien, pengelolaan database MySQL, serta manajemen server menggunakan Linux Ubuntu dan PM2. Memiliki pengalaman dalam integrasi database relasional, otomasi deployment menggunakan GitHub Actions, dan pembuatan aplikasi web modern.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  '#contact',
  '6282334027274',
  'danendra.athallah@gmail.com',
  'Malang, Indonesia',
  'https://github.com',
  'https://linkedin.com',
  'https://instagram.com'
)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  whatsapp_number = EXCLUDED.whatsapp_number,
  updated_at = NOW();

INSERT INTO public.projects (id, title, description, tech_stack, image_url, demo_url, github_url, category, featured, metrics)
VALUES
(
  'proj-1',
  'Situs Web Kasir (Point of Sale / POS Web)',
  'Sistem aplikasi web kasir untuk pencatatan transaksi penjualan secara real-time, manajemen inventaris stok produk, dan pencetakan struk pembayaran terintegrasi dengan database MySQL.',
  ARRAY['Node.js', 'Express.js', 'MySQL', 'React', 'REST API', 'PM2'],
  'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=1200&q=80',
  'https://github.com',
  'https://github.com',
  'Aplikasi Web',
  TRUE,
  'Real-time POS & Inventory Sync'
),
(
  'proj-2',
  'Situs Web Penyimpanan Dokumen Digital',
  'Platform pengelolaan arsip dan dokumen digital berbasis web dengan fitur upload file aman, kategorisasi folder, pencarian metadata cepat, dan manajemen hak akses pengguna.',
  ARRAY['NestJS', 'Node.js', 'MySQL', 'Next.js', 'Linux Ubuntu', 'PM2'],
  'https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1200&q=80',
  'https://github.com',
  'https://github.com',
  'Sistem Dokumen',
  TRUE,
  'Secure Digital Archiving'
),
(
  'proj-3',
  'Aplikasi Web & Otomasi Deployment',
  'Pengembangan arsitektur backend REST API modular dengan otomatisasi pipeline CI/CD menggunakan GitHub Actions menuju server VPS Linux Ubuntu yang dikelola dengan PM2 Process Manager.',
  ARRAY['Node.js', 'Express.js', 'MySQL', 'GitHub Actions', 'Linux Ubuntu', 'PM2'],
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'https://github.com',
  'https://github.com',
  'Backend & Server',
  TRUE,
  'Automated Zero-Downtime Deploy'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.certificates (id, title, issuer, issue_date, credential_url, image_url, skills)
VALUES
(
  'cert-1',
  'Pengembangan Backend & RESTful API Terstruktur',
  'Platform Pembelajaran Terkemuka (Dicoding)',
  '2023',
  'https://www.dicoding.com',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
  ARRAY['Node.js', 'Express.js', 'RESTful API', 'Error Handling']
),
(
  'cert-2',
  'Pengelolaan & Perancangan Basis Data Relasional MySQL',
  'Sertifikasi Kompetensi Database',
  '2023',
  'https://hackerrank.com',
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1000&q=80',
  ARRAY['MySQL', 'Relational Schema', 'SQL Queries', 'Data Integrity']
),
(
  'cert-3',
  'Problem Solving & Algoritma Pemrograman',
  'HackerRank Skill Certificate',
  '2023',
  'https://hackerrank.com',
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1000&q=80',
  ARRAY['Problem Solving', 'Logic Building', 'Data Structures']
),
(
  'cert-4',
  'Dasar Administrasi Server Linux Ubuntu & PM2',
  'Platform Edukasi TI',
  '2022',
  'https://github.com',
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1000&q=80',
  ARRAY['Linux Ubuntu', 'PM2 Process Manager', 'CLI & Bash', 'Deployment']
)
ON CONFLICT (id) DO NOTHING;
