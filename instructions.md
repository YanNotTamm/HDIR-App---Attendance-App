# instructions.md — Panduan Eksekusi untuk AI Code Builder

Dokumen ini berisi instruksi langkah-demi-langkah. Kerjakan **berurutan sesuai fase**, jangan lompat ke fase berikutnya sebelum deliverable fase sebelumnya berjalan (build sukses, test dasar lewat). Selalu rujuk `SKILL.md` untuk konvensi dan `PLAN.md` untuk konteks fitur/skema.

## Aturan Umum Sebelum Mulai

1. Baca `PLAN.md` dan `SKILL.md` secara penuh sebelum menulis kode apapun.
2. Buat monorepo sesuai struktur folder di `SKILL.md`.
3. Setiap fase, akhiri dengan: (a) kode bisa di-build/run, (b) buat file `CHANGELOG.md` entry singkat, (c) tulis daftar environment variable baru yang dibutuhkan ke `.env.example`.
4. Jangan hardcode kredensial, URL kantor, atau kuota cuti — semua harus configurable dari database/dashboard HR.

---

## FASE 1 — Fondasi (Backend + Database + Auth)

1. Inisialisasi monorepo (Turborepo/Nx) dengan folder `apps/api`, `apps/web-dashboard`, `apps/pwa`, `apps/mobile-android`, `packages/core`.
2. Setup `apps/api` dengan NestJS + MySQL + ORM (Prisma/TypeORM).
3. Buat migrasi database untuk tabel inti: `roles`, `users`, `departments`, `offices` (sesuai skema di `PLAN.md` §5).
4. Implementasi Auth:
   - `POST /api/v1/auth/login` (email + password → access token + refresh token)
   - `POST /api/v1/auth/refresh`
   - `POST /api/v1/auth/logout`
   - Middleware RBAC: `admin`, `hr`, `employee`.
5. Seed data awal: 1 admin, 1 HR, 3 role, 1 office contoh.
6. Test manual: login berhasil untuk masing-masing role, endpoint terproteksi menolak token invalid.

**Output**: API auth berjalan, bisa dites via Postman/curl.

## FASE 2 — Manajemen Karyawan & Kantor (dasar dashboard HR)

1. Buat modul `users` (CRUD karyawan) — hanya role `hr`/`admin` yang boleh akses.
2. Buat modul `offices` (CRUD kantor/cabang: nama, latitude, longitude, radius_meters).
3. Bangun `apps/web-dashboard` skeleton (Next.js) dengan:
   - Halaman login.
   - Halaman daftar karyawan (list, tambah, edit, nonaktifkan).
   - Halaman pengaturan kantor & radius geofence.
4. Hubungkan dashboard ke API menggunakan client di `packages/core`.

**Output**: HR bisa CRUD karyawan & kantor dari dashboard web, tersimpan di MySQL.

## FASE 3 — Face Recognition

1. Tentukan library sesuai `SKILL.md` (face-api.js sebagai baseline lintas platform).
2. Backend: buat modul `face`:
   - `POST /api/v1/face/enroll` — terima beberapa foto/embedding saat onboarding karyawan, simpan rata-rata embedding.
   - `POST /api/v1/face/verify` — terima embedding baru, hitung similarity (cosine distance) terhadap embedding tersimpan, return skor & pass/fail (threshold default 0.6, configurable).
3. Di `packages/core`, buat helper `extractFaceEmbedding(imageData)` yang dipakai baik oleh PWA maupun native (via WebView jika perlu, atau native module terpisah untuk Android jika performa jadi masalah).
4. Buat UI enrollment sederhana (kamera → capture 3 pose: depan, kiri, kanan) di web-dashboard (untuk HR daftarkan karyawan baru) DAN di app native/PWA (self-enrollment opsional).
5. Tambahkan validasi kualitas gambar dasar (deteksi ada wajah, tidak blur, cukup terang) sebelum kirim ke backend.

**Output**: Karyawan ter-enroll wajahnya, dan proses verifikasi mengembalikan skor kecocokan yang bisa dites dengan foto yang sama vs berbeda.

## FASE 4 — Geofencing & Absen (Normal / Jarak Jauh)

1. Backend: buat modul `attendance`:
   - `POST /api/v1/attendance/check-in` dan `/check-out` — terima `userId`, `latitude`, `longitude`, `faceEmbedding`/foto.
   - Logika: verifikasi wajah dulu (panggil modul face) → jika gagal, tolak. Jika lolos, hitung jarak Haversine ke semua `offices`, ambil jarak minimum.
   - Jika `distance <= office.radius_meters` → simpan `status: approved`, `mode: normal`.
   - Jika lebih besar → wajib field `reason` dari client, simpan `status: pending`, `mode: remote`, trigger notifikasi ke semua user role `hr`.
2. `GET /api/v1/attendance/history?userId=` — riwayat absen karyawan.
3. `GET /api/v1/attendance/pending` — daftar pengajuan absen jarak jauh yang menunggu approval (untuk HR).
4. Bangun UI absen di `apps/pwa` dan `apps/mobile-android`:
   - Buka kamera → capture wajah → ambil GPS → kirim ke API.
   - Tampilkan status hasil: "Absen berhasil (Normal)" atau "Menunggu approval HR (Jarak Jauh)".
5. Tangani permission kamera & lokasi secara eksplisit di kedua platform (Android permissions, PWA Geolocation API + getUserMedia, dengan pesan error yang jelas jika ditolak user).

**Output**: Karyawan bisa absen dari app, sistem otomatis membedakan mode normal vs jarak jauh berdasarkan GPS.

## FASE 5 — Approval Absen Jarak Jauh

1. Backend: `POST /api/v1/attendance/:id/approve` dan `/:id/reject` — hanya role `hr`, catat `approved_by`, `approved_at`, kirim notifikasi ke karyawan terkait.
2. Realtime: setup Socket.io atau polling interval pendek agar HR langsung lihat pengajuan baru tanpa refresh manual.
3. Bangun UI "Approval Center" di:
   - `apps/mobile-android` (untuk HR yang login via role hr)
   - `apps/pwa` (sama, untuk HR di iOS)
   - `apps/web-dashboard` (versi desktop, lebih lengkap dengan filter & histori)
4. Push notification: setup FCM untuk Android, Web Push untuk PWA (opsional jika waktu terbatas, minimal in-app notification badge harus ada).

**Output**: HR menerima pengajuan absen jarak jauh dan bisa approve/reject dari HP (native/PWA), status tersinkron ke semua platform.

## FASE 6 — Modul Cuti & Kuota Tahunan

1. Backend: buat modul `leave`:
   - `leave_types`, `leave_quotas`, `leave_requests` (CRUD sesuai skema `PLAN.md`).
   - `POST /api/v1/leave-requests` — karyawan ajukan cuti, backend validasi sisa kuota.
   - `POST /api/v1/leave-requests/:id/approve` / `/reject` — HR only, update `used_days` otomatis saat approve.
   - `GET /api/v1/leave-quotas?userId=&year=` — cek saldo cuti.
2. Dashboard HR: halaman **Pengaturan Kuota Cuti Tahunan**:
   - Set default kuota per jenis cuti per tahun.
   - Override kuota per individu karyawan.
   - Job scheduler (cron) untuk reset/alokasi kuota di awal tahun.
3. UI di app native/PWA:
   - Form pengajuan cuti (pilih jenis, rentang tanggal, alasan, upload lampiran opsional).
   - Tampilkan sisa kuota real-time.
   - Riwayat pengajuan + status.
   - Approval cuti masuk ke Approval Center yang sama dengan Fase 5 (gabungkan dengan approval absen jarak jauh dalam satu inbox, dibedakan dengan tab/label jenis).

**Output**: Karyawan bisa ajukan cuti, HR bisa atur kuota tahunan dan approve dari app manapun.

## FASE 7 — Packaging Native Android & PWA iOS

1. **Android**: finalisasi build React Native — icon, splash screen, permission manifest (kamera, lokasi, notifikasi), generate signed APK/AAB.
2. **PWA iOS**: pastikan `manifest.json` lengkap (icons, `display: standalone`), service worker untuk offline shell minimal, uji "Add to Home Screen" di Safari iOS, validasi kamera & geolocation berfungsi dalam mode standalone.
3. Uji lintas-perangkat: pastikan data yang dibuat dari Android muncul di PWA dan Web Dashboard (dan sebaliknya) — verifikasi single source of truth (MySQL) benar-benar tersinkron real-time/near-real-time.

**Output**: APK Android siap diinstall, PWA iOS bisa di-install dari Safari, keduanya terhubung ke backend yang sama dengan Web Dashboard.

## FASE 8 — Laporan, QA, Hardening, Deployment

1. Dashboard HR: halaman laporan/rekap absensi & cuti (filter tanggal, departemen, export ke Excel/PDF).
2. Security pass: rate limiting login, sanitasi input, audit `audit_logs` terisi konsisten, review penyimpanan face embedding (enkripsi at-rest).
3. Testing: unit test untuk logika geofencing (Haversine) dan validasi kuota cuti (kasus tepi: kuota pas habis, dua device absen bersamaan, dsb).
4. Deployment: siapkan Dockerfile untuk `apps/api`, deploy `apps/web-dashboard` (Vercel/self-host), dokumentasikan proses build APK & hosting PWA.

**Output**: Sistem siap dipakai produksi dengan dokumentasi deployment.

---

## Checklist Definisi "Selesai" per Fitur

- [ ] Backend endpoint ada, tervalidasi (schema validator), teruji manual.
- [ ] Role/permission dicek (tidak bisa diakses role yang salah).
- [ ] UI tersedia minimal di satu platform mobile (Android atau PWA) + web dashboard jika relevan.
- [ ] Perubahan data langsung terlihat di platform lain (uji sinkronisasi).
- [ ] Audit log tercatat untuk aksi approval/konfigurasi.
- [ ] Tidak ada kredensial/koordinat/kuota yang di-hardcode.
