# Sistem Administrasi Perumahan

Sistem Administrasi Perumahan yang dibangun menggunakan Laravel 12 (API Backend) dan React (Frontend menggunakan Vite). Sistem ini mendukung pengelolaan data penghuni, rumah, riwayat hunian, tagihan iuran bulanan (satpam & kebersihan), pengeluaran, serta laporan keuangan bulanan.

## ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    residents {
        int id PK
        string full_name
        string ktp_photo
        enum status "tetap, kontrak"
        string phone
        boolean is_married
        timestamps
    }
    houses {
        int id PK
        string code
        boolean is_occupied
        timestamps
    }
    house_residents {
        int id PK
        int house_id FK
        int resident_id FK
        date start_date
        date end_date
        timestamps
    }
    dues {
        int id PK
        int house_id FK
        string month
        enum type "satpam, kebersihan"
        decimal amount
        enum status "belum, lunas"
        timestamp paid_at
        timestamps
    }
    expenses {
        int id PK
        string description
        decimal amount
        date expense_date
        timestamps
    }

    residents ||--o{ house_residents : "occupies"
    houses ||--o{ house_residents : "has history"
    houses ||--o{ dues : "billed to"
```

## Persyaratan
- PHP >= 8.2
- Composer
- Node.js & npm
- MySQL / XAMPP

## Panduan Instalasi (Langkah demi Langkah)

### 1. Persiapan Database
1. Buka aplikasi MySQL Server atau XAMPP.
2. Buat sebuah database bernama `sistemadministrasiperum`. Anda bisa menggunakan perintah SQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS sistemadministrasiperum;
   ```

### 2. Setup Backend (Laravel API)
1. Buka terminal di folder utama proyek (`sistemadministrasiperum`).
2. Buat file `.env` (copy dari `.env.example` jika ada) dan sesuaikan kredensial database:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sistemadministrasiperum
   DB_USERNAME=root
   DB_PASSWORD=
   ```
3. Install dependensi PHP:
   ```bash
   composer install
   ```
4. Jalankan migrasi dan seeder:
   ```bash
   php artisan migrate:fresh --seed
   ```
5. **PENTING:** Jalankan link storage agar foto KTP bisa diakses:
   ```bash
   php artisan storage:link
   ```
6. Jalankan server backend:
   ```bash
   php artisan serve
   ```
   *Backend akan berjalan di `http://localhost:8000`.*

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
4. Jalankan development server:
   ```bash
   npm run dev
   ```
   *Frontend akan berjalan di `http://localhost:5173`.*

### 4. Menjalankan Aplikasi
Buka browser dan akses alamat `http://localhost:5173`.

## Kriteria Sistem yang Terpenuhi
- **Mengelola Penghuni:** Fitur Tambah/Ubah data dengan atribut Lengkap (Nama, Foto KTP, Status, Telepon, Status Nikah).
- **Mengelola Rumah:** Fitur Tambah/Ubah Rumah & Penghuni, serta fitur **Riwayat (Historical)** penghuni per rumah.
- **Status Rumah:** Otomatis berubah (Dihuni / Tidak Dihuni) berdasarkan data penghuni aktif.
- **Mengelola Pembayaran:** Pencatatan iuran Satpam & Kebersihan. Mendukung pembayaran bulk (misal 1 tahun sekaligus).
- **Laporan & Grafik:** Dashboard menampilkan grafik pemasukan vs pengeluaran selama 1 tahun terakhir, serta laporan summary saldo.
- **Export & Print:** Fitur cetak laporan (Excel/PDF/Print) yang bersih (hanya data).
