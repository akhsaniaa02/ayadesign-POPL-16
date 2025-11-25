git # Aya Design

Selamat datang di Aya Design, platform e-commerce tempat Anda dapat memesan berbagai desain kustom kekinian seperti photocard, banner, dan desain dengan bingkai akrilik. Proyek ini dibangun dengan MERN stack (MongoDB, Express.js, React, Node.js) dan dirancang untuk memberikan pengalaman pemesanan yang mulus dan ramah pengguna.

## Fitur

* **Autentikasi Pengguna:** Pengguna dapat mendaftar dan masuk ke akun mereka untuk mengelola profil dan pesanan mereka.
* **Katalog Produk:** Jelajahi berbagai pilihan desain yang tersedia, yang dikategorikan ke dalam photocard dan banner untuk navigasi yang mudah.
* **Detail Produk:** Lihat informasi terperinci tentang setiap desain, termasuk harga, ukuran, dan opsi kustomisasi.
* **Keranjang Belanja:** Tambahkan beberapa item ke keranjang Anda, lihat ringkasan pesanan, dan lanjutkan ke checkout.
* **Proses Checkout yang Mulus:** Checkout dengan mudah melalui WhatsApp, di mana pesan yang telah diisi sebelumnya dengan detail pesanan Anda akan dibuat secara otomatis.
* **Manajemen Profil:** Pengguna dapat memperbarui informasi profil mereka, termasuk gambar profil dan kata sandi.

## Tumpukan Teknologi

* **Frontend:**
    * React
    * Vite
    * Tailwind CSS
    * Ant Design
* **Backend:**
    * Node.js
    * Express
    * MongoDB
    * Mongoose
* **Autentikasi:**
    * JSON Web Tokens (JWT)
* **Unggahan Gambar:**
    * Multer

## Memulai

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

### Prasyarat

* Node.js
* npm (atau yarn)
* MongoDB

### Instalasi

1.  **Kloning repositori:**
    ```sh
    git clone [https://github.com/akhsaniaa02/ayadesign-popl-16.git](https://github.com/akhsaniaa02/ayadesign-popl-16.git)
    ```
2.  **Instal dependensi untuk server:**
    ```sh
    cd server
    npm install
    ```
3.  **Instal dependensi untuk klien:**
    ```sh
    cd ../client
    npm install
    ```
4.  **Siapkan variabel lingkungan:**
    Buat file `.env` di direktori `server` dan tambahkan variabel lingkungan yang diperlukan, seperti string koneksi MongoDB dan kunci rahasia JWT.
5.  **Jalankan server pengembangan:**
    ```sh
    cd ../server
    npm run dev
    ```
6.  **Jalankan klien pengembangan:**
    ```sh
    cd ../client
    npm run dev
    ```

## Menjalankan dengan Docker

Jika Anda ingin menjalankan proyek ini menggunakan **Docker** tanpa harus menginstal Node.js atau MongoDB secara manual, ikuti langkah-langkah berikut:

### Prasyarat
* **Docker** sudah terinstal di komputer Anda.  
  - [Download Docker Desktop](https://www.docker.com/products/docker-desktop) untuk Windows/Mac  
  - Atau instal di Linux:  
    ```sh
    sudo apt-get update
    sudo apt-get install docker.io -y
    ```

### Menjalankan Aplikasi

1. **Pull image dari Docker Hub:**
   ```sh
   docker pull irfnriza/ayadesign-app:latest

2. **Jalankan container dengan mapping port frontend (5173) dan backend (3000):**
   ```sh
   docker run -d -p 3000:3000 -p 5173:5173 --name ayadesign-app irfnriza/ayadesign-app:latest

3. **Cek apakah container berjalan:**
   ```sh
   docker ps
   ```
   Jika berhasil, Anda akan melihat container ayadesign-app dalam daftar.

4. **Akses aplikasi melalui browser:**
   - Frontend: http://localhost:5173  
   - Backend (API): http://localhost:3000 

## Kontributor

* **akhsaniaa02**
* **irfnriza**
* **aufazaikra**
