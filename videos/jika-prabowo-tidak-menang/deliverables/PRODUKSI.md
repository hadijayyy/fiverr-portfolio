# Jika Prabowo Tidak Menang? — Paket Produksi

Video explainer animasi 3D, Instagram Reels · 1080 × 1920 · 30 fps · **59,5 detik** · narasi Bahasa Indonesia.

| Berkas | Isi |
|---|---|
| `jika-prabowo-tidak-menang.mp4` | Video final (H.264 + AAC) |
| `cover.png` | Cover Reels "JIKA PRABOWO TIDAK MENANG?" |
| `subtitle.srt` | Subtitle terpisah (sama dengan yang tertanam di video) |
| `CAPTION.txt` | Caption satu paragraf |
| `SUMBER.md` | Daftar sumber & catatan verifikasi |
| `../` | Source project Remotion + Three.js |

---

## 1. Naskah final (130 kata, durasi suara 56,8 detik)

> Kalau Prabowo tidak menang di Pilpres 2024, apa yang berubah di Indonesia?
>
> Faktanya, KPU menetapkan Prabowo–Gibran menang satu putaran dengan 58,6 persen suara sah. Dalam skenario lain, presidennya bisa Anies–Muhaimin atau Ganjar–Mahfud, mungkin lewat putaran kedua.
>
> Pertama, anggaran. Prabowo–Gibran mengusung makan siang dan susu gratis. Anies–Muhaimin menonjolkan perumahan rakyat. Ganjar–Mahfud: KTP Sakti dan satu desa, satu faskes, satu nakes. Porsi anggaran berpotensi bergeser.
>
> Kedua, koalisi. Tak satu kubu pun menguasai mayoritas DPR. Pemenang mana pun perlu merangkul partai lain.
>
> Ketiga, kecepatan. Prabowo–Gibran berjanji melanjutkan Ibu Kota Nusantara; Ganjar–Mahfud secara bertahap; Anies–Muhaimin mendahulukan kebutuhan dasar.
>
> Tapi presiden tidak bekerja sendiri. Undang-undang dan APBN dibahas bersama DPR, birokrasi menjalankan, dan kondisi ekonomi membatasi ruang belanja.
>
> Jadi, arah prioritas mungkin berubah, tetapi hasilnya bergantung pada pelaksanaan. Menurutmu, kebijakan apa yang paling mungkin berbeda?

Hitungan kata: 130 jika nama pasangan ("Prabowo–Gibran") dihitung satu kata, 139 jika dihitung dua. Sumber kebenaran naskah ada di `narration/script.json`. Kolom `say` berisi ejaan untuk mesin suara, misalnya "De-Pe-Er" dan "dua ribu dua puluh empat".

## 2. Storyboard bertimestamp

Waktu diambil dari hasil ukur suara (`src/timeline.json`). Ada pergeseran dari brief: bagian "tiga kemungkinan" berjalan pada 16–42 detik, bukan 12–36 detik. Penyebabnya, pembacaan angka resmi dan aturan kemenangan di titik percabangan butuh sekitar 11 detik. Penutup tetap di 50–60 detik.

| Waktu | Bagian | Narasi | Visual 3D & sebab-akibat | Label di layar |
|---|---|---|---|---|
| 0:00–0:05 | **Hook** | "Kalau Prabowo tidak menang di Pilpres 2024, apa yang berubah di Indonesia?" | Surat suara masuk ke kotak suara 3D, lalu jalur hasil tumbuh dari kotak dan bercabang: jalur padat "Sejarah: hasil resmi" dan jalur putus-putus "Bagaimana jika…?" | Judul "Jika Prabowo tidak menang?", badge **SKENARIO HIPOTETIS** |
| 0:05–0:11 | **Titik percabangan: fakta** | "Faktanya, KPU menetapkan … 58,6 persen suara sah." | Diorama peta Indonesia. Tiga kolom tumbuh setinggi hasil resmi (24,9 / 58,6 / 16,5%) dan melewati garis 50%. | Badge **FAKTA · DATA RESMI**, catatan Keputusan KPU 360/2024 + aturan Pasal 6A |
| 0:11–0:16 | **Titik percabangan: skenario** | "Dalam skenario lain … mungkin lewat putaran kedua." | Kolom resmi memudar menjadi bayangan. Dua jalur putus-putus dari peta menuju "01 · Anies–Muhaimin?" dan "03 · Ganjar–Mahfud?", plus tanda "Putaran kedua?". **Tanpa angka simulasi.** | Badge **SKENARIO HIPOTETIS**, "Tidak ada angka simulasi" |
| 0:16–0:28 | **1/3 Anggaran** | Program unggulan tiap pasangan; "Porsi anggaran berpotensi bergeser." | Nampan "APBN" berisi enam blok sama besar. Token nomor pasangan jatuh ke nampan, lalu blok program unggulannya terangkat dan berwarna. Di akhir, blok-blok bertukar posisi: prioritas bergeser. | "Blok berukuran sama — ilustrasi prioritas, bukan angka anggaran" |
| 0:28–0:34 | **2/3 Koalisi** | "Tak satu kubu pun menguasai mayoritas DPR. Pemenang mana pun perlu merangkul partai lain." | Hemisiklus 580 kursi DPR terisi, lalu diwarnai sesuai kursi partai pengusung (190 / 280 / 110). Batang kursi dibandingkan dengan garis mayoritas 291. Perpanjangan putus-putus "+ partai lain" menunjukkan semua kubu butuh tambahan. | Sumber Keputusan KPU 1205/2024 |
| 0:34–0:42 | **3/3 Kecepatan** | IKN dilanjutkan / bertahap / kebutuhan dasar didahulukan | Tiga lintasan proyek. Kartu prioritas di pangkal tiap lintasan menentukan proyek mana yang bergerak lebih dulu: 02 maju terus, 03 maju bertahap (berhenti-jalan), dan 01 mendahulukan blok klinik/sekolah sementara IKN menunggu di antrean. | "Ilustrasi urutan prioritas, bukan prediksi jadwal. … timnya menyatakan IKN tidak dibatalkan" |
| 0:42–0:50 | **Batas perubahan** | "Tapi presiden tidak bekerja sendiri …" | Figur 3D generik "PRESIDEN (siapa pun)" di tengah. Blok "Kebijakan" bergerak ke DPR (bersama Aturan & UU), lalu ke Birokrasi, lalu ke Kondisi ekonomi. Di sana gerbang menyempit dan blok mengecil: ruang belanja terbatas. | Badge **KONTEKS SISTEM**, UUD 1945 Pasal 20 & 23 |
| 0:50–0:55 | **Penutup** | "Jadi, arah prioritas mungkin berubah, tetapi hasilnya bergantung pada pelaksanaan." | Jalur "Arah prioritas" (padat) dan "bisa berubah" (putus-putus) menyatu melewati gerbang **PELAKSANAAN** sebelum mencapai "Hasil". | "Skenario hipotetis, bukan prediksi" |
| 0:55–0:59,5 | **Pertanyaan** | "Menurutmu, kebijakan apa yang paling mungkin berbeda?" | Kartu pertanyaan besar. | — |

## 3. Arahan visual & audio yang diterapkan

- **Gaya.** Diorama 3D dengan material "clay" matte yang konsisten, latar kertas terang, cahaya lembut, dan bayangan halus. Huruf memakai Plus Jakarta Sans.
- **Netralitas warna.** Tiap pasangan diberi warna netral (01 hijau-teal, 02 oker, 03 ungu) yang sengaja dipilih bukan warna khas partai. Jalur fakta memakai abu tua padat. Jalur hipotetis memakai terakota putus-putus.
- **Tokoh.** Tidak ada wajah, suara, atau kemiripan tokoh nyata. Presiden digambarkan sebagai figur generik tanpa wajah dengan label "siapa pun". Pasangan diwakili nomor urut dan nama tertulis.
- **Subtitle.** Maksimal dua baris dengan ukuran 52 px tebal, teks putih di kotak gelap (kontras sekitar 14:1). Posisinya y 1215–1435 px, x 70–950 px, di luar area UI Reels (atas sekitar 170 px, bawah sekitar 380 px, tombol kanan sekitar 130 px). Nama pasangan tidak pernah terpotong antarbaris. Di akhir, pertanyaan tampil sebagai kartu besar, bukan subtitle.
- **Label hipotetis.** Badge mode tampil terus sepanjang video: FAKTA / SKENARIO HIPOTETIS / KONTEKS SISTEM.
- **Narasi.** Suara sintetis (TTS) Bahasa Indonesia memakai model Piper `id_ID-news_tts-medium` (offline), length-scale 0,66. Tiap kalimat disintesis terpisah sehingga subtitle sinkron persis dengan kalimatnya.
- **Musik.** Dibuat secara prosedural (`scripts/make_music.py`): arpeggio piano lembut dan pad di F mayor (I–vi–IV–V), 84 BPM, volume 16%. Tanpa efek dramatis, tanpa nuansa ancaman atau heroik.

## 4. QA yang dilakukan

| Pemeriksaan | Hasil |
|---|---|
| Durasi | Video 59,5 detik (1.785 frame). Suara berakhir di 57,3 detik. |
| Keterpahaman suara | Audio ditranskripsi ulang dengan Whisper-small (offline). Semua kalimat dikenali. Singkatan bermasalah diperbaiki: "IKN" terbaca "ikan" sehingga diganti "Ibu Kota Nusantara", dan "DPR" dieja "De-Pe-Er". Huruf "r" pada suara TTS ini terdengar lemah. |
| Akurasi angka | 58,6% / 24,9% / 16,5% dihitung dari 96.214.691 / 40.971.906 / 27.040.878 dibagi 164.227.475 suara sah. Kursi 190 / 280 / 110 dari 580 (mayoritas 291). |
| Label hipotetis | Setiap frame membawa badge mode. Bagian skenario tidak memuat angka simulasi. |
| Netralitas | Ketiga pasangan disebut dengan pola kalimat setara. Tidak ada kesimpulan "lebih baik/lebih buruk". Kata "mungkin", "berpotensi", dan "bergantung pada" dipakai di klaim skenario. |
| Kejadian pascapemilu | Tidak ada. Program disebut dengan nama kampanye ("makan siang dan susu gratis"), bukan nama program setelah dilantik. |
| Keterbacaan subtitle | Diperiksa lewat lembar kontak frame. Maksimal dua baris dan tidak bertabrakan dengan label 3D. |
| Render | MP4 diperiksa ulang dengan ffprobe (resolusi, fps, durasi, audio) dan frame acak. |

### Batasan yang perlu diketahui

- **Verifikasi sumber.** Lingkungan produksi tidak bisa membuka situs KPU/JDIH secara langsung karena jaringan dibatasi. Angka dan isi dokumen diverifikasi lewat kutipan pemberitaan yang merujuk dokumen primer (lihat `SUMBER.md`). Sebelum publikasi, sebaiknya cocokkan sekali lagi dengan PDF Keputusan KPU 360/2024 dan 1205/2024 di jdih.kpu.go.id.
- **Peta kursi.** Peta kursi DPR memakai hasil Pileg 2024 yang sebenarnya. Dalam sejarah alternatif, hasil pileg pun bisa berbeda. Karena itu kalimatnya berbunyi "tak satu kubu pun", bukan klaim tentang koalisi pascapemilu.
- **Suara narasi.** Suara adalah TTS. Untuk kualitas siaran, rekam ulang dengan pengisi suara manusia memakai naskah di atas, lalu jalankan ulang `scripts/make_voice.py` atau ganti `public/audio/voice.wav` dan sesuaikan `src/timeline.json`.
