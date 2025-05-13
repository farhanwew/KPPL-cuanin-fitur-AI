# Panduan Testing API cuan.in

Dokumen ini berisi petunjuk cara melakukan testing pada API backend cuan.in menggunakan   curl hehe.

## Menjalankan Backend

Sebelum testing, pastikan server FastAPI sudah berjalan:

```bash
cd backend
uvicorn main:app --reload
```

Server akan berjalan di `http://localhost:8000`

<!-- ## Testing dengan Postman

1. Buka Postman
2. Buat request baru dengan konfigurasi berikut:
   - Method: POST
   - URL: http://localhost:8000/recommendations
   - Headers: 
     - Content-Type: application/json
   - Body (raw JSON):
   ```json
   {
     "business_interest": "Teknologi Digital",
     "target_market": "Menengah",
     "description": "Usaha kuliner dengan konsep kafe modern yang menyediakan area kerja dan internet cepat. Target pasar adalah pekerja kantoran dan freelancer yang butuh tempat nyaman untuk bekerja sambil menikmati kopi dan makanan ringan.",
     "email": "contoh@email.com"
   }
   ```
3. Klik "Send" dan tunggu respons dari API

### Contoh Permintaan Lain

#### Usaha Pertanian:

```json
{
  "business_interest": "Pertanian dan Peternakan",
  "target_market": "Menengah",
  "description": "Usaha budidaya tanaman hidroponik untuk memenuhi kebutuhan sayuran segar di perkotaan. Ingin memanfaatkan lahan terbatas dengan teknologi yang efisien.",
  "email": "petani@email.com"
}
```

#### Usaha Kreatif:

```json
{
  "business_interest": "Kreatif dan Media",
  "target_market": "Atas",
  "description": "Studio desain grafis dan branding yang fokus pada klien dari industri fashion dan kecantikan. Menawarkan jasa pembuatan identitas visual dan kampanye digital.",
  "email": "kreatif@email.com"
}
``` -->

## Testing dengan curl

### Contoh 1: Teknologi Digital

```bash
curl -X POST \
  http://localhost:8000/recommendations \
  -H 'Content-Type: application/json' \
  -d '{
  "business_interest": "Teknologi Digital",
  "target_market": "Menengah",
  "description": "Usaha kuliner dengan konsep kafe modern yang menyediakan area kerja dan internet cepat. Target pasar adalah pekerja kantoran dan freelancer yang butuh tempat nyaman untuk bekerja sambil menikmati kopi dan makanan ringan.",
  "email": "contoh@email.com"
}'
```

### Contoh 2: Jasa

```bash
curl -X POST \
  http://localhost:8000/recommendations \
  -H 'Content-Type: application/json' \
  -d '{
  "business_interest": "Jasa",
  "target_market": "Menengah",
  "description": "Jasa perawatan dan grooming hewan peliharaan dengan layanan antar jemput. Ingin fokus pada pelanggan yang sibuk tapi peduli dengan kesehatan dan penampilan hewan peliharaan mereka.",
  "email": "petlovers@email.com"
}'
```

## API Documentation

Setelah FastAPI berjalan, lihat docum:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Dokumentasi ini memungkinkan  mencoba endpoint API langsung dari browser.

## Troubleshooting

### Masalah Umum dan Solusi

1. **Error 401 Unauthorized**
   
   Kemungkinan penyebab:
   - API key OpenRouter tidak valid
   - API key OpenRouter tidak memiliki saldo yang cukup
   
   Solusi:
   - Periksa file `.env` dan pastikan API key sudah benar
   - Pastikan akun OpenRouter memiliki saldo yang cukup

2. **Error 500 Internal Server Error**
   
   Kemungkinan penyebab:
   - Format prompt tidak sesuai
   - Masalah dengan koneksi ke API OpenRouter
   - Rate limiting dari OpenRouter (soalnya kalo saya pake free)
   
   Solusi:
   - Periksa log server untuk detil error
   - Pastikan koneksi internet stabil
   - Coba lagi setelah beberapa saat

3. **CORS Error**
   
   Kemungkinan penyebab:
   - Frontend diakses dari domain yang berbeda dengan backend
   
   Solusi:
   - Pastikan CORS middleware di FastAPI sudah dikonfigurasi dengan benar
   - Jika menggunakan file HTML lokal, coba gunakan server lokal
