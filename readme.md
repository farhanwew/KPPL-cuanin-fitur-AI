# Cuan.in - Sistem Rekomendasi Bisnis UMKM

Untuk mendemonstrsikan Fitur ,  web ini menggunakan FastAPI sebagai backend dan HTML/CSS/JS  sebagai frontend untuk memberikan rekomendasi bisnis UMKM yang  berdasarkan profil pengguna.

## Struktur Project

```
cuan-in/
├── backend/
│   ├── main.py
│   ├── .env
│   └── requirements.txt
└── frontend/
    └── index.html
```

## Cara Menjalankan Aplikasi

### Persiapan

1. Pastikan Python 3.8++++
2. Clone repo ne
3. Buat dan aktifkan virtual environment (disarankan)

```bash
python -m venv venv (tapi di repo ini sudah ada seh, jika mau buat baru)
source venv/bin/activate  # Untuk Linux/Mac
venv\Scripts\activate  # Untuk Windows
```

### Langkah 1: Setup Backend

1. Masuk ke direktori backend:

```bash
cd backend
```

2. Instal dependensi yang diperlukan:

```bash
pip install -r requirements.txt (jika untuk yg baru)
```

1. Edit file `.env` dan tambahkan API key OpenRouter :

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```
(Open router)[https://openrouter.ai/settings/keys]
1. Jalankan server FastAPI:

```bash
uvicorn main:app --reload
```

Server backend akan berjalan di http://localhost:8000

### Langkah 2: Jalankan Frontend

bberapa cara untuk menjalankan frontend:

#### Cara 1: Menggunakan server lokal sederhana

Kalau make Python,  bisa menggunakan HTTP server bawaan:

```bash
# Masuk ke direktori frontend
cd ../frontend

# Jalankan server Python
python -m http.server
```

Frontend akan tersedia di http://localhost:8000

#### Cara 2: Membuka file HTML langsung

Bisa membuka file `index.html` langsung di browser . Namun, ini mungkin menyebabkan masalah CORS saat berkomunikasi dengan API backend.


### Cara Menggunakan Aplikasi

1. Buka frontend di browser 
2. Isi form profil bisnis:
   - Pilih minat bisnis
   - Pilih target pasar
   - Masukkan deskripsi usaha
   - Masukkan email
3. Klik tombol "Dapatkan Rekomendasi"
4. Tunggu beberapa saat hingga rekomendasi bisnis ditampilkan

## API Endpoints

### `POST /recommendations`

Endpoint untuk mendapatkan rekomendasi bisnis berdasarkan profil pengguna.

**Request Body:**
```json
{
  "business_interest": "Teknologi Digital",
  "target_market": "Menengah",
  "description": "Usaha jasa yang memanfaatkan teknologi untuk memudahkan transaksi sehari-hari",
  "email": "contoh@email.com"
}
```

**Response:**
```json
{
  "primary_recommendation": {
    "nama_usaha": "Nama Usaha",
    "deskripsi": "Deskripsi lengkap",
    "modal_yang_dibutuhkan": "Rp XX.XXX.XXX",
    "perkiraan_keuntungan": "Rp X.XXX.XXX per bulan",
    "skala_usaha": "Mikro/Kecil/Menengah",
    "target_pasar": "Detail target pasar"
  },
  "alternative_recommendations": [
    {
      "nama_usaha": "Alternatif 1",
      "deskripsi_singkat": "Deskripsi singkat",
      "modal_yang_dibutuhkan": "Rp XX.XXX.XXX"
    },
    {
      "nama_usaha": "Alternatif 2",
      "deskripsi_singkat": "Deskripsi singkat",
      "modal_yang_dibutuhkan": "Rp XX.XXX.XXX"
    }
  ],
  "success_factors": [
    "Faktor 1",
    "Faktor 2",
    "..."
  ],
  "challenges": [
    "Tantangan 1",
    "Tantangan 2",
    "..."
  ],
  "next_steps": [
    "Langkah 1",
    "Langkah 2",
    "..."
  ]
}
```
## Notes
- Aplikasi ini menggunakan API OpenRouter untuk mendapatkan respons dari LLM
