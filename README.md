# UnfollIG — Instagram Non-Follower Tracker & Safe Cleaner

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Deploy with Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

Aplikasi web modern untuk melihat akun Instagram yang Anda ikuti tetapi **tidak follback** Anda, serta membantu membersihkan (unfollow) akun secara bertahap atau sekaligus dengan menjaga privasi 100% dan keamanan akun tanpa risiko kena ban.

---

## 🛡️ Mengapa Aplikasi Ini 100% Aman & Menjaga Privasi?

1. **Tanpa Form Login / Password Instagram:**
   - Memasukkan password Instagram di website pihak ketiga sangat berbahaya dan melanggar aturan Meta.
   - Serverless Vercel menggunakan IP cloud data center (AWS), sehingga jika login diproses dari server luar, Instagram akan langsung memicu *Checkpoint / Suspicious Login Attempt* atau bahkan **banned permanen**.
   - **Solusi Kami:** Data diproses **100% di browser lokal Anda (Client-Side)** menggunakan file ekspor resmi dari Meta. Tidak ada data yang dikirim ke server mana pun.

2. **Smart In-Browser Auto-Unfollower (Anti-Spam & Anti-Ban):**
   - Dijalankan di tab browser Anda sendiri di mana Anda sudah login ke `instagram.com` menggunakan alamat IP asli Anda.
   - Dilengkapi **jeda keamanan acak (8 - 15 detik)**, countdown timer, serta tombol jeda (pause) & hentikan (stop) agar aktivitas unfollow Anda terlihat wajar dan tidak terdeteksi sebagai bot.

3. **Fitur Whitelist / Proteksi Akun Favorit:**
   - Anda bisa menandai akun keluarga, sahabat, atau artis idola dengan ikon bintang ⭐ agar terlindungi dan tidak akan pernah ikut ter-unfollow saat proses pembersihan.

---

## 🚀 Fitur Utama

- ⚡ **Ekstrak Otomatis File ZIP Meta:** Langsung drag & drop file `.zip` dari Meta, sistem akan membaca file pengikut dan mengikuti secara otomatis.
- 🎯 **Kategori Lengkap:**
  - *Tidak Follback Kamu* (Orang yang Anda follow, tapi mereka tidak follow balik).
  - *Fans* (Orang yang follow Anda, tapi Anda belum follow balik).
  - *Mutuals* (Teman yang saling follow).
  - *Whitelist* (Akun yang sengaja dilindungi).
- 🔍 **Pencarian & Urutan:** Cari berdasarkan `@username` dan urutkan berdasarkan tanggal follow (terbaru/terlama) atau abjad A-Z.
- 📦 **Pilihan Fleksibel:** Pilih satuan dengan checkbox, pilih 10, 25, 50 akun sekaligus, atau pilih semua.
- 🤖 **3 Metode Unfollow Praktis:**
  1. **Bookmarklet:** Seret tombol ke Bilah Bookmark browser Anda, buka tab Instagram, lalu klik bookmark tersebut.
  2. **Console Script (F12):** Salin script dan jalankan di tab Console Instagram.
  3. **Fast-Click:** Buka profil berurutan untuk unfollow manual dalam 1-klik tanpa repot mengetik username.
- 📊 **Export Data:** Download daftar akun dalam format `.csv` kapan saja.

---

## 🛠️ Cara Menjalankan Secara Lokal

```bash
# 1. Clone repositori ini
git clone https://github.com/Marcelloaja/remove-following-instagram.git
cd remove-following-instagram

# 2. Instal dependensi
npm install

# 3. Jalankan server lokal
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## ☁️ Cara Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** &rarr; **"Project"**.
3. Pilih repository **`Marcelloaja/remove-following-instagram`**.
4. Klik **"Deploy"**. Vercel akan otomatis melakukan proses build dan website Anda langsung online dalam hitungan detik!

---

## 📖 Cara Mendapatkan File Data Instagram Resmi (1-3 Menit)

1. Buka [accountscenter.instagram.com/info_and_permissions/dyi/](https://accountscenter.instagram.com/info_and_permissions/dyi/)
2. Klik **"Unduh atau transfer informasi"** &rarr; Pilih akun Instagram Anda.
3. Pilih opsi **"Sebagian informasi"**.
4. Centang kategori **"Pengikut dan mengikuti" (Followers and following)**.
5. Pada pengaturan format, pilih:
   - Format: **JSON**
   - Rentang Tanggal: **Sepanjang Waktu (All time)**
6. Klik **"Buat file"**. Dalam 1-3 menit, Meta akan mengirimkan notifikasi file unduhan `.zip`.
7. Unggah file `.zip` tersebut langsung ke aplikasi web ini!

---

## ❓ FAQ & Troubleshooting

#### Q: Di tab Console Instagram muncul tulisan merah besar "Stop!", apakah aman?
**A:** Sangat aman! Tulisan merah "Stop!" itu adalah pesan perlindungan bawaan resmi dari Meta (*Self-XSS Protection*) yang selalu muncul kepada siapa saja yang membuka menu F12 di situs Instagram/Facebook.

#### Q: Browser Chrome tidak mengizinkan paste script di Console?
**A:** Di Chrome/Edge terbaru, ketik kata `allow pasting` di console lalu tekan **Enter**. Setelah itu, tekan `Ctrl + V` untuk menempelkan script dan tekan **Enter** lagi.
