# 🎓 SIKS Fasdik Report Generator

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Aplikasi *web-based* murni (Client-Side) yang dirancang khusus untuk membantu Pendamping Program Keluarga Harapan (PKH) dalam mengotomatisasi pembuatan **Lembar Verifikasi Komitmen Fasilitas Pendidikan** langsung dari data mentah `.CSV` portal SIKS Kemensos. 

Aplikasi ini mengeliminasi pekerjaan manual dalam memilah ribuan data siswa, menyusun tabel, dan membuat kop surat, sehingga meningkatkan efisiensi administrasi e-Kinerja SKP secara drastis.

---

## ✨ Fitur Unggulan

* ⚡ **Robust CSV Parser (Anti-Error):** Mesin pembaca CSV cerdas yang mampu memproses ribuan baris data, tahan terhadap karakter aneh/koma tersembunyi, dan memiliki sistem pintar untuk mendeteksi & menghapus data siswa duplikat bawaan dari server SIKS.
* 🗂️ **Auto-Split School & Batch Zip:** Secara otomatis memecah data siswa berdasarkan sekolah asal. Jika terdapat lebih dari 1 sekolah, dokumen akan di-generate sekaligus dan diunduh dalam format `.zip`.
* 📄 **Ekspor Presisi (PDF & Excel):** 
  * **PDF:** Ter-generate otomatis lengkap dengan pengaturan ukuran kertas (F4/A4), kop surat, watermark logo kustom, penomoran halaman otomatis, dan tata letak tabel resmi.
  * **Excel (.xlsx):** Ekspor dengan *cell merging* dan format tebal/border yang sudah disesuaikan persis seperti cetakan PDF.
* 🎨 **Antarmuka Modern & Responsif:** Desain UI/UX menggunakan sistem *grid* yang rapi di layar HP maupun laptop. Dilengkapi *Floating Toolbar* untuk mode Gelap/Terang (Auto) dan sinkronisasi Zona Waktu (WIB, WITA, WIT).
* 🕰️ **Estetika Jam Meja (Flip Clock):** Elemen visual *flip clock* memanjang dengan presisi waktu yang disinkronkan langsung via API *WorldTime* (pengganti SNTP).
* 🔔 **Silent Telegram Logging:** Fitur pemantauan diam-diam (bot tracking) untuk mencatat rekap aktivitas (User, NIP, Aksi, Jumlah Data) langsung ke chat Telegram admin.
* 🔒 **100% Aman (No Database):** Semua pemrosesan data KPM dilakukan secara lokal di *browser* (Client-Side). Tidak ada satu pun data privasi yang dikirim atau disimpan ke server.

---

## 🚀 Cara Penggunaan

1. **Unduh Data SIKS:** Buka web SIKS Kemensos, ubah opsi *"Show entries"* menjadi **Semua/1000**, lalu klik **Ekspor CSV**.
2. **Buka Aplikasi:** Akses halaman web aplikasi ini.
3. **Upload CSV:** Seret (drag & drop) file `.csv` yang baru diunduh ke area yang disediakan.
4. **Isi Parameter Dokumen:** 
   * Pilih Filter Pendamping (jika ingin mencetak spesifik).
   * Masukkan Nama Petugas, NIP, dan Tanggal TTD.
   * Upload Kustom Logo (Opsional) untuk dijadikan Kop & Watermark.
   * Pilih periode Triwulan atau Bulanan.
5. **Generate:** Klik tombol **Generate PDF** atau **Ekspor Excel**. Selesai!

---

## ⚙️ Konfigurasi (Untuk Developer)

Aplikasi ini menggunakan beberapa *library* eksternal melalui CDN (jsPDF, jsPDF-AutoTable, SheetJS, JSZip, Tabler Icons). Tidak perlu `npm install`.

**Mengaktifkan Notifikasi Bot Telegram:**
Untuk menggunakan fitur *Silent Tracking*, Anda harus memasukkan kredensial bot Telegram Anda sendiri.
1. Buka file `index.html`.
2. Cari fungsi `sendTelegramLog(aksi)` di bagian bawah dalam tag `<script>`.
3. Ganti variabel berikut dengan milik Anda:
   ```javascript
   const botToken = "MASUKKAN_BOT_TOKEN_DISINI"; 
   const chatId = "MASUKKAN_CHAT_ID_DISINI";


☕ Dukung Pengembangan
Di balik kemudahan sebuah aplikasi, ada waktu, riset, dan dedikasi panjang yang dicurahkan di depan layar. Jika aplikasi ini membantu mempermudah pekerjaan Anda di lapangan, mari dukung developer dengan secangkir kopi agar sistem ini bisa terus dipelihara dan dikembangkan! ❤️

👉 Traktir Developer di Trakteer

© 2026 Andriadi, S.Kom

Dikembangkan untuk efisiensi Pendamping PKH Kecamatan Bukit Santuai & Kementerian Sosial Republik Indonesia.
