# Cloudinary Setup Guide

Sistem ini menggunakan **Cloudinary** untuk menyimpan gambar produk di cloud, sehingga gambar tetap tersimpan dengan aman saat aplikasi di-deploy ke platform seperti Vercel, Heroku, atau platform hosting lainnya.

## Mengapa Menggunakan Cloudinary?

### Masalah dengan Local Storage:
- ❌ **File hilang saat redeploy** - Platform seperti Vercel/Heroku memiliki ephemeral filesystem
- ❌ **Tidak scalable** - Jika menggunakan multiple servers, file hanya ada di satu server
- ❌ **Backup sulit** - File gambar terpisah dari database
- ❌ **Tidak portable** - Saat pindah server, gambar tidak ikut

### Keuntungan Cloudinary:
- ✅ **Persistent storage** - File tersimpan permanen di cloud
- ✅ **CDN global** - Gambar di-load cepat dari server terdekat
- ✅ **Automatic optimization** - Gambar otomatis dioptimasi
- ✅ **Image transformation** - Resize, crop, format conversion on-the-fly
- ✅ **Free tier** - 25GB storage & 25GB bandwidth per bulan gratis

---

## Cara Setup Cloudinary

### 1. Buat Akun Cloudinary (Gratis)

1. Kunjungi: https://cloudinary.com/users/register/free
2. Daftar menggunakan email atau Google account
3. Verifikasi email Anda

### 2. Dapatkan Credentials

Setelah login, Anda akan melihat **Dashboard**:

1. Buka: https://cloudinary.com/console
2. Catat informasi berikut:
   - **Cloud Name**: `your_cloud_name`
   - **API Key**: `123456789012345`
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz123`

### 3. Update File `.env` di Server

Edit file `server/.env` dan ganti nilai Cloudinary:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**⚠️ PENTING:** 
- Jangan commit file `.env` ke Git!
- File `.env` sudah ada di `.gitignore`
- Untuk deployment, set environment variables di platform hosting Anda

### 4. Testing

1. Restart server backend:
   ```bash
   cd server
   npm run dev
   ```

2. Login sebagai admin
3. Buka halaman `/admin/insert`
4. Upload gambar menggunakan "Upload File"
5. Submit form
6. Cek di Cloudinary Dashboard → Media Library
7. Gambar seharusnya muncul di folder `ayadesign/products`

---

## Deployment ke Production

### Vercel

Tambahkan environment variables di **Vercel Dashboard**:

1. Buka project di Vercel
2. Settings → Environment Variables
3. Tambahkan:
   - `CLOUDINARY_CLOUD_NAME` = `your_cloud_name`
   - `CLOUDINARY_API_KEY` = `your_api_key`
   - `CLOUDINARY_API_SECRET` = `your_api_secret`

### Heroku

```bash
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
```

### Railway / Render

Tambahkan environment variables melalui dashboard masing-masing platform.

---

## Cara Kerja Upload

### Backend Flow:

1. **Form submit** dengan file gambar (multipart/form-data)
2. **Multer** menerima file di memory (`multer.memoryStorage()`)
3. **Cloudinary SDK** upload file dari buffer ke cloud:
   ```javascript
   cloudinary.uploader.upload_stream(
       {
           folder: 'ayadesign/products',
           transformation: [
               { width: 1000, height: 1000, crop: 'limit' },
               { quality: 'auto:good' }
           ]
       }
   )
   ```
4. **Cloudinary returns URL**: `https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/ayadesign/products/xyz.jpg`
5. **Save URL to MongoDB** dalam field `imageUrl`

### Frontend Display:

Helper function `getImageUrl()` di semua halaman:
```javascript
const getImageUrl = (imageUrl) => {
    // Local file (backward compatibility)
    if (imageUrl && imageUrl.startsWith('/uploads')) {
        return baseURL + imageUrl;
    }
    // Cloudinary URL atau external URL (langsung pakai)
    return imageUrl;
};
```

---

## Fitur Cloudinary yang Digunakan

### 1. Automatic Image Optimization
```javascript
transformation: [
    { width: 1000, height: 1000, crop: 'limit' },  // Max 1000x1000px
    { quality: 'auto:good' }                        // Auto quality compression
]
```

### 2. Folder Organization
- Semua gambar produk disimpan di folder: `ayadesign/products`
- Mudah untuk manage dan organize

### 3. Secure URLs
- HTTPS by default
- Public read, private write (hanya melalui API)

---

## Troubleshooting

### ❌ Error: "Must supply cloud_name"
**Solusi**: Pastikan environment variables sudah di-set dengan benar di `.env`

### ❌ Error: "Invalid API Key"
**Solusi**: Cek kembali CLOUDINARY_API_KEY di dashboard Cloudinary

### ❌ Gambar tidak muncul setelah upload
**Solusi**: 
1. Cek console browser untuk error
2. Cek URL gambar di database (MongoDB)
3. Pastikan URL Cloudinary valid dan accessible

### ❌ Upload lambat
**Solusi**: 
- Cloudinary free tier memiliki limit bandwidth
- Upgrade ke paid plan jika perlu
- Atau compress gambar sebelum upload (di frontend)

---

## Migration dari Local Storage ke Cloudinary

Jika Anda sudah punya gambar di folder `uploads/products/`:

### Option 1: Upload Manual
1. Download semua gambar dari folder `uploads/products/`
2. Re-upload melalui form admin dengan "Upload File"

### Option 2: Bulk Upload Script
Buat script untuk upload existing images ke Cloudinary:

```javascript
// scripts/migrateToCloudinary.js
const cloudinary = require('../config/cloudinary');
const ImageCarousel = require('../models/imageModels');
const path = require('path');
const fs = require('fs');

async function migrateImages() {
    try {
        const products = await ImageCarousel.find({
            imageUrl: { $regex: '^/uploads' }  // Only local files
        });

        for (const product of products) {
            const localPath = path.join(__dirname, '..', product.imageUrl);
            
            if (fs.existsSync(localPath)) {
                const result = await cloudinary.uploader.upload(localPath, {
                    folder: 'ayadesign/products'
                });
                
                product.imageUrl = result.secure_url;
                await product.save();
                console.log(`Migrated: ${product.title}`);
            }
        }
        
        console.log('Migration complete!');
    } catch (error) {
        console.error('Migration error:', error);
    }
}

migrateImages();
```

Run: `node scripts/migrateToCloudinary.js`

---

## Resources

- **Cloudinary Dashboard**: https://cloudinary.com/console
- **Documentation**: https://cloudinary.com/documentation
- **Node.js SDK**: https://cloudinary.com/documentation/node_integration
- **Pricing**: https://cloudinary.com/pricing (Free tier: 25GB storage, 25GB bandwidth)

---

## Support

Jika ada pertanyaan atau masalah dengan Cloudinary setup, silakan:
1. Cek dokumentasi di atas
2. Review error logs di console
3. Cek Cloudinary dashboard untuk monitoring usage

**Free Tier Limits:**
- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25,000/month
- More than enough untuk small-medium e-commerce!
