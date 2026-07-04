# HDIR App — Attendance App

Aplikasi absensi karyawan multi-platform modern dengan **AI Face Recognition** dan **Satelit GPS Geofencing**. Dilengkapi dengan mode absen jarak jauh (membutuhkan persetujuan HR), pengajuan & kuota cuti tahunan, serta dashboard manajemen HR berbasis web.

Proyek ini dibangun menggunakan arsitektur **Monorepo (Turborepo)** dengan komponen berikut:
- **`apps/api`**: Backend API (NestJS + Prisma + SQLite)
- **`apps/web-dashboard`**: Web Dashboard HR Admin (Next.js)
- **`apps/mobile-android`**: Aplikasi Karyawan Mobile (React Native / Expo)
- **`packages/core`**: API Client Shared Package (Axios)

---

## 🌟 Fitur Utama

1. **AI Face Recognition**: Verifikasi wajah biometrik langsung saat absen.
2. **GPS Geofencing**: Deteksi otomatis apakah karyawan berada di dalam radius kantor (*Normal*) atau di luar radius (*Jarak Jauh*) menggunakan jarak koordinat bumi (Haversine Formula).
3. **Absen Jarak Jauh (Remote)**: Memerlukan pengisian alasan penjelas dan persetujuan manual oleh HR Admin.
4. **Manajemen Kuota Cuti**: Pengajuan cuti dari HP terintegrasi langsung dengan pemotongan saldo kuota tahunan di server saat disetujui.
5. **Dashboard HR (Web)**: Pemantauan kehadiran *real-time*, menu persetujuan absen & cuti (*Approval Center*), serta manajemen data karyawan/kantor.

---

## 🚀 Memulai Proyek (Getting Started)

### Prasyarat
- **Node.js** (v18 atau lebih baru)
- **Git**

### Langkah 1: Kloning & Instalasi
1. Kloning repositori:
   ```bash
   git clone https://github.com/YanNotTamm/HDIRApp-AttendanceApp.git
   cd HDIRApp-AttendanceApp
   ```
2. Instal seluruh dependensi di akar folder (*root* monorepo):
   ```bash
   npm install
   ```

### Langkah 2: Setup Database (SQLite)
Aplikasi ini sudah dikonfigurasi menggunakan SQLite agar mudah dijalankan secara lokal tanpa ribet menginstal server database tambahan.
1. Masuk ke folder backend:
   ```bash
   cd apps/api
   ```
2. Generate Prisma Client & Migrate database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

## 💻 Cara Menjalankan Aplikasi Secara Lokal

Setiap komponen monorepo dapat dijalankan di terminal terpisah:

### 1. Jalankan Backend (NestJS API)
```bash
cd apps/api
npm run start:dev
```
*Server API akan berjalan di `http://localhost:3000/api/v1`.*

### 2. Jalankan Web Dashboard (Next.js HR Portal)
```bash
cd apps/web-dashboard
npm run dev
```
*Web dashboard admin dapat diakses di `http://localhost:3001` (atau port terdekat).*

### 3. Jalankan Aplikasi Mobile (React Native / Expo Karyawan)
```bash
cd apps/mobile-android
npx expo start -c
```
*Tekan tombol **`w`** di terminal Expo untuk membukanya di Web Browser, atau scan QR Code menggunakan aplikasi **Expo Go** di HP Anda.*

---

## 📜 Lisensi & Kontribusi (Open Source GNU GPL v3.0)

Aplikasi HDIR dirilis sebagai perangkat lunak **Open Source** di bawah lisensi **GNU General Public License v3.0**. 

### Hak dan Ketentuan Lisensi:
- **Kebebasan Mengembangkan**: Siapapun diperbolehkan untuk melakukan *fork*, mengubah kode sumber, menyesuaikan fitur, dan mengembangkan aplikasi ini lebih lanjut sesuai kebutuhan instansi atau personal.
- **Distribusi Terbuka**: Jika Anda mengubah atau mendistribusikan ulang aplikasi ini, Anda wajib merilis kode sumber hasil modifikasi tersebut di bawah lisensi yang sama (Copyleft).
- **Penggunaan Gratis**: Tidak ada biaya lisensi untuk menggunakan, memodifikasi, atau menyebarkan aplikasi ini.

### Peluang Pengembangan Lebih Lanjut:
Aplikasi ini sangat terbuka untuk dikembangkan lebih jauh, misalnya:
- Mengintegrasikan sistem absensi dengan mesin sidik jari fisik.
- Menambahkan modul slip gaji (*Payroll*) otomatis berdasarkan rekap absensi.
- Memperluas deteksi kecerdasan buatan (Face AI) dengan fitur deteksi keaktifan (*Liveness Detection*) untuk mencegah pemalsuan foto.

Kami sangat menyambut baik kontribusi berupa perbaikan *bug*, penambahan fitur, maupun dokumentasi. Silakan buat **Pull Request** atau buka **Issue** di repositori ini jika Anda menemukan kendala!

