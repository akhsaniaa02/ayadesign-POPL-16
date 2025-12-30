# Dokumentasi Client (Frontend)

Folder `client` ini berisi kode sumber untuk antarmuka pengguna (Frontend) dari aplikasi Aya Design. Aplikasi ini dibangun menggunakan **React** dengan **Vite** sebagai build tool, dan **Tailwind CSS** untuk styling.

## Struktur Folder

Berikut adalah penjelasan mengenai struktur direktori utama di dalam folder ini:

### `/public`
Berisi aset statis yang dapat diakses secara publik.
- **assets/image/**: Menyimpan gambar-gambar statis seperti banner, logo, ikon media sosial, dan contoh produk (akrilik, photocard).
- **uploads/**: Folder sementara atau tempat penyimpanan gambar yang diunggah (jika ada).

### `/src` (Source Code)
Ini adalah folder utama tempat pengembangan aplikasi dilakukan.

- **`/api`**:
  - Berisi konfigurasi koneksi ke backend (server), seperti pengaturan Axios atau `fetch` request.
  - `private.client.js`: Kemungkinan berisi instance API client yang memerlukan autentikasi (token).

- **`/Auth`**:
  - Berisi halaman atau komponen khusus untuk autentikasi pengguna.
  - `Login.jsx`: Halaman masuk pengguna.
  - `Register.jsx`: Halaman pendaftaran pengguna baru.

- **`/Components`**:
  - Berisi komponen UI yang dapat digunakan kembali (reusable components).
  - **Elements/**: Elemen kecil seperti tombol atau fitur utilitas (`ScrollToTop.jsx`).
  - **Layouts/**: Struktur tata letak halaman utama (`Layout.jsx`).
  - `Nav.jsx`: Komponen navigasi (Navbar).
  - `Footer.jsx`: Komponen kaki halaman (Footer).
  - `ProtectedRoute.jsx`: Komponen pembungkus untuk melindungi rute yang memerlukan login.

- **`/contexts`**:
  - `AuthContext.jsx`: Mengelola state global untuk status autentikasi pengguna (login/logout state management).

- **`/hooks`**:
  - Berisi custom hooks untuk logika yang bisa digunakan ulang.
  - `useLogin.jsx` & `useSignUp.js`: Hook untuk menangani logika login dan register.
  - `useLogger.jsx`: Hook untuk keperluan logging di sisi klien.

- **`/Pages`**:
  - Berisi halaman-halaman utama aplikasi.
  - **admin/**: Halaman khusus untuk peran Admin (Dashboard, Kelola Pesanan, Edit Produk, Input Data).
  - **user/**: Halaman untuk pengguna umum (Katalog Produk, Keranjang, Detail Pesanan, Profil, Tentang Kami).

- **`/utils`**:
  - Fungsi-fungsi bantuan (utility functions).
  - `clientLogger.js`: Utilitas untuk pencatatan log sisi klien.
  - `webVitals.js`: Untuk performa metrik web.

## Cara Menjalankan (Development)

1. Pastikan Anda berada di folder `client`.
2. Install dependencies:
   ```bash
   npm install
3. Jalankan server pengembangan:
   ```bash
   npm run dev
