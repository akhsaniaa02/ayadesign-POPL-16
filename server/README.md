# Dokumentasi Server (Backend)

Folder `server` ini berisi kode sumber untuk Backend API yang melayani permintaan data dari Client. Dibangun menggunakan **Node.js** dan **Express**.

## Struktur Folder

Berikut adalah penjelasan fungsi dari setiap direktori di dalam folder server:

### `/config`
- `cloudinary.js`: Berisi konfigurasi untuk layanan Cloudinary (digunakan untuk manajemen penyimpanan gambar/upload file).

### `/controllers`
Berisi logika bisnis utama yang menangani permintaan (request) dan memberikan respons.
- `authController.js`: Menangani logika registrasi, login, dan logout.
- `orderController.js`: Menangani logika pemesanan produk, keranjang, dan transaksi.
- `caraouselController.js`: Mengelola data untuk slider gambar/banner di frontend.

### `/middlewares`
Fungsi perantara yang dijalankan sebelum request mencapai controller utama.
- `authMiddleware.js`: Memverifikasi apakah pengguna sudah login (validasi token).
- `adminMiddleware.js`: Memastikan pengguna memiliki hak akses sebagai Admin.
- `loggingMiddleware.js`: Mencatat aktivitas request yang masuk ke server.

### `/models`
Mendefinisikan skema database (kemungkinan besar menggunakan Mongoose/MongoDB).
- `userModels.js`: Skema data pengguna.
- `cartModels.js`: Skema data keranjang belanja.
- `transactionModel.js`: Skema data transaksi/pesanan.
- `imageModels.js`: Skema untuk penyimpanan referensi gambar.

### `/routes`
Mendefinisikan endpoint API (URL path) dan menghubungkannya ke controller yang sesuai.
- `authRoute.js`: Rute untuk autentikasi (misal: `/api/auth/login`).
- `orderRoute.js`: Rute untuk manajemen pesanan.
- `logRoute.js`: Rute terkait logging sistem.

### `/uploads`
- Direktori lokal untuk menyimpan file yang diunggah sementara sebelum diproses atau jika tidak menggunakan cloud storage penuh.

### `/utils`
Fungsi bantuan umum.
- `verifyToken.js`: Fungsi untuk memverifikasi JSON Web Token (JWT).
- `logToGrafana.js`: Utilitas khusus untuk mengirim log sistem ke dashboard monitoring Grafana.
- `appError.js`: Class untuk standarisasi penanganan error (Error Handling).
- `constant.js`: Menyimpan variabel konstan global.

### File Penting Lainnya
- `index.js`: Titik masuk utama (entry point) aplikasi server.
- `createAdmin.js`: Skrip utilitas (seeding) untuk membuat akun admin pertama kali.

## Cara Menjalankan

1. Pastikan Anda berada di folder `server`.
2. Install dependencies:
   ```bash
   npm install
3. Jalankan server:
   ```bash
   npm start
   # atau untuk mode development
   npm run dev
