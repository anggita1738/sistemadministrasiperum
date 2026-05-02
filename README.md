# Sistem Administrasi Perumahan

Sistem Administrasi Perumahan yang dibangun menggunakan Laravel 12 (API Backend) dan React (Frontend menggunakan Vite). Sistem ini mendukung pengelolaan data penghuni, rumah, riwayat hunian, tagihan iuran bulanan (satpam & kebersihan), pengeluaran, serta laporan keuangan bulanan.

## Persyaratan
- PHP >= 8.2
- Composer
- Node.js & npm
- MySQL

## Panduan Instalasi (Langkah demi Langkah)

### 1. Persiapan Database
1. Buka aplikasi MySQL Server atau XAMPP.
2. Buat sebuah database bernama `sistemadministrasiperum`. Anda bisa menggunakan perintah SQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS sistemadministrasiperum;
   ```

### 2. Setup Backend (Laravel API)
1. Buka terminal di folder utama proyek (`sistemadministrasiperum`).
2. Pastikan file `.env` sudah sesuai dengan kredensial database Anda:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sistemadministrasiperum
   DB_USERNAME=root
   DB_PASSWORD=
   ```
3. Install dependensi PHP dengan menjalankan:
   ```bash
   composer install
   ```
4. Jalankan migrasi dan seeder untuk membuat tabel dan data default (20 rumah, penghuni, dll):
   ```bash
   php artisan migrate:fresh --seed
   ```
5. Jalankan server backend:
   ```bash
   php artisan serve
   ```
   *Catatan: Backend akan berjalan di `http://localhost:8000`.*

### 3. Setup Frontend (React)
1. Buka tab terminal baru.
2. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
3. Install dependensi Node:
   ```bash
   npm install
   ```
4. Jalankan development server frontend:
   ```bash
   npm run dev
   ```
   *Catatan: Frontend akan berjalan di `http://localhost:5173`.*

### 4. Menjalankan Aplikasi
Buka browser dan akses alamat `http://localhost:5173`. Anda akan langsung melihat Dashboard Sistem Administrasi Perumahan.

## Fitur Utama
1. **Kelola Penghuni:** Tambah dan Ubah data penghuni (Tetap/Kontrak).
2. **Kelola Rumah:** Lihat 20 rumah, assign penghuni ke rumah dengan tanggal menempati.
3. **Pembayaran Iuran:** Buat tagihan Satpam (Rp100.000) dan Kebersihan (Rp15.000), serta pelunasan iuran.
4. **Pengeluaran:** Catat pengeluaran operasional perumahan.
5. **Dashboard & Laporan:** Grafik Pemasukan vs Pengeluaran 1 tahun terakhir, serta rincian detail bulanan.
