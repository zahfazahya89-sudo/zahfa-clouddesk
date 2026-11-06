# Zahfa CloudDesk

Personal Productivity & Cloud Dashboard untuk Muhammad Zahfa Zahya.

## Menjalankan secara lokal
1. Ekstrak folder `Zahfa-CloudDesk`.
2. Buka folder tersebut di Visual Studio Code.
3. Buka `index.html`.
4. Jalankan dengan ekstensi Live Server (klik **Go Live**) atau buka file `index.html` langsung di browser.

Tidak membutuhkan `npm`, Node.js, database, atau instalasi dependency.

## Fitur
- Dashboard ringkasan task dan completion rate
- Tambah, edit, hapus, dan tandai task selesai
- Pencarian dan filter task
- Kalender dengan navigasi bulan
- Quick Notes (tambah dan hapus)
- Analytics berbasis data task
- Dark / light mode
- Jam dan tanggal otomatis
- Layout responsif untuk desktop dan mobile

## Penyimpanan data
Data task, notes, dan preferensi tema disimpan pada `localStorage` browser. Artinya data tersimpan pada browser/perangkat yang digunakan, bukan database cloud bersama.

## Deploy ke GitHub Pages
1. Buat repository GitHub baru.
2. Upload seluruh isi folder ini (pastikan `index.html` berada di root repository).
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/(root)`, lalu **Save**.
6. Tunggu proses deployment selesai, kemudian buka URL GitHub Pages yang diberikan.

## Catatan akademik
GitHub Pages menyediakan hosting statis untuk file HTML, CSS, dan JavaScript. Fitur interaktif di project ini berjalan di browser. `localStorage` bukan database cloud dan data tidak otomatis tersinkron antarperangkat. Untuk aplikasi multi-user atau sinkronisasi cloud, diperlukan backend/API dan database terpisah.
