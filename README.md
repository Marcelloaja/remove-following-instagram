# UnfollIG — Instagram Non-Follower Tracker & Safe Cleaner

Aplikasi web modern berbasis **Next.js (App Router)** dan **Tailwind CSS** untuk melihat akun Instagram yang Anda ikuti tetapi **tidak follback** Anda, serta membantu membersihkan (unfollow) secara bertahap atau sekaligus dengan menjaga keamanan akun dan privasi 100%.

Didesain khusus untuk langsung di-deploy ke **Vercel**.

---

## 🛡️ Mengapa Aplikasi Ini 100% Aman & Menjaga Privasi?

1. **Tanpa Form Login / Password Instagram:**
   - Memasukkan password Instagram di website pihak ketiga sangat berbahaya dan melanggar Terms of Service Meta.
   - Serverless Vercel menggunakan IP cloud data center (AWS), sehingga jika login diproses dari server, Instagram akan langsung memicu *Checkpoint/Suspicious Login Attempt* atau bahkan **banned permanen**.
   - **Solusi kami:** Data diproses **100% di browser Anda (Client-Side)** menggunakan file ekspor data resmi dari Meta. Tidak ada data yang dikirim ke server.

2. **Smart In-Browser Auto-Unfollower (Anti-Spam & Anti-Ban):**
   - Dijalankan di tab browser Anda sendiri di mana Anda sudah login ke `instagram.com` menggunakan IP asli rumah/HP Anda.
   - Dilengkapi **jeda keamanan acak (8 - 15 detik)** dan tombol jeda/hentikan otomatis agar aktivitas unfollow Anda terlihat wajar dan tidak terdeteksi sebagai bot oleh sistem proteksi Instagram.

3. **Fitur Whitelist / Proteksi Akun:**
   - Anda bisa menandai akun keluarga, sahabat, atau artis favorit dengan ikon bintang agar tidak akan pernah ikut ter-unfollow saat proses pembersihan massal.

---

## 🚀 Fitur Utama

- ⚡ **Ekstrak Otomatis File ZIP Meta:** Langsung drag & drop file `.zip` dari Meta, sistem akan membaca file pengikut dan mengikuti secara otomatis.
- 🎯 **Kategori Lengkap:**
  - *Tidak Follback Kamu* (Orang yang Anda follow, tapi mereka tidak follow balik).
  - *Fans* (Orang yang follow Anda, tapi Anda belum follow balik).
  - *Mutuals* (Teman yang saling follow).
  - *Whitelist* (Akun yang sengaja dilindungi).
- 🔍 **Pencarian & Urutan:** Cari berdasarkan `@username` dan urutkan berdasarkan tanggal follow (terbaru/terlama) atau abjad.
- 📦 **Pilihan Fleksibel:** Pilih satuan, pilih 10, 25, 50 akun sekaligus, atau semua.
- 🤖 **3 Metode Unfollow:**
  1. **Bookmarklet:** Cukup seret tombol ke Bilah Bookmark browser Anda, buka tab Instagram, lalu klik bookmark tersebut.
  2. **Console Script (F12):** Copy script dan jalankan di tab Console Instagram.
  3. **Fast-Click:** Buka profil berurutan untuk unfollow manual dalam 1-klik.
- 📊 **Export Data:** Download daftar akun dalam format `.csv` kapan saja.

---

## 🛠️ Cara Menjalankan Secara Lokal

```bash
# 1. Masuk ke folder proyek
cd remove-following-instagram

# 2. Jalankan server lokal
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## ☁️ Cara Push & Deploy ke Vercel

### Metode 1: Menggunakan GitHub & Vercel Dashboard (Paling Populer)
1. Buat repository baru di GitHub (misal: `remove-following-instagram`).
2. Jalankan perintah berikut di terminal:
   ```bash
   git add .
   git commit -m "feat: initial commit instagram unfollower app"
   git branch -M main
   git remote add origin https://github.com/<username-kamu>/remove-following-instagram.git
   git push -u origin main
   ```
3. Buka [vercel.com](https://vercel.com) & login.
4. Klik **"Add New..."** &rarr; **"Project"** &rarr; Pilih repository GitHub Anda.
5. Klik **"Deploy"**. Vercel akan langsung meng-compile dan website Anda langsung online dalam hitungan detik!

### Metode 2: Menggunakan Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 📖 Cara Mendapatkan File Data Instagram (1-3 Menit)

1. Buka [accountscenter.instagram.com/info_and_permissions/dyi/](https://accountscenter.instagram.com/info_and_permissions/dyi/)
2. Klik **"Unduh atau transfer informasi"** &rarr; Pilih akun Instagram Anda.
3. Pilih opsi **"Sebagian informasi"**.
4. Centang kategori **"Pengikut dan mengikuti" (Followers and following)**.
5. Pada pengaturan format, pilih:
   - Format: **JSON**
   - Rentang Tanggal: **Sepanjang Waktu (All time)**
6. Klik **"Buat file"**. Dalam 1-3 menit, Meta akan mengirimkan link unduh file `.zip`.
7. Unggah file `.zip` tersebut langsung ke aplikasi web ini!
