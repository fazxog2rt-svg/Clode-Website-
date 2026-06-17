'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CheckCircle2,
  Video, FileText, Headphones, BookOpen, Clock, Star, Users,
  ChevronLeft, ChevronRight, Play, BookMarked, Menu, X
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

// ─── Course Data ───────────────────────────────────────────────────────────────

const coursesData: Record<string, CourseData> = {
  '1': {
    id: 1, title: 'Fiqih Muslimah Lengkap', instructor: 'Ustadzah Hana Fauziyah',
    color: 'from-teal-400 to-emerald-600', image: '📖', duration: '12 jam', lessons: 24,
    rating: 4.9, students: 2847, level: 'Pemula', progress: 65,
    description: 'Panduan lengkap fiqih untuk Muslimah modern dari bersuci hingga ibadah sehari-hari.',
    syllabus: [
      { id: 1, title: 'Pengenalan Fiqih Muslimah', duration: '15 mnt', completed: true, type: 'video', content: `
## Pengenalan Fiqih Muslimah

Bismillahirrahmanirrahim.

**Apa itu Fiqih?**

Fiqih secara bahasa berarti pemahaman yang mendalam. Secara istilah, fiqih adalah ilmu yang mempelajari hukum-hukum syariat Islam yang bersifat amaliah (perbuatan) yang diambil dari dalil-dalil yang rinci.

**Mengapa Muslimah Perlu Belajar Fiqih?**

Allah SWT berfirman dalam Al-Quran:
> *"فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ"*
> *"Maka bertanyalah kepada orang yang mempunyai pengetahuan jika kamu tidak mengetahui."* (QS. An-Nahl: 43)

Rasulullah SAW bersabda: *"Menuntut ilmu adalah kewajiban bagi setiap Muslim."* (HR. Ibnu Majah)

Sebagai Muslimah, kita memiliki kekhususan dalam beberapa hukum fiqih yang berkaitan dengan:
1. **Thaharah (bersuci)** — haid, nifas, istihadhah
2. **Ibadah** — shalat, puasa, zakat
3. **Muamalah** — jual beli, pernikahan
4. **Akhlak dan Adab** — berpakaian, bergaul

**Sumber Hukum dalam Fiqih:**
- Al-Quran Al-Karim
- As-Sunnah (Hadits Nabi)
- Ijma' (kesepakatan ulama)
- Qiyas (analogi hukum)

**Mazhab Fiqih yang Mu'tamad:**
Dalam kursus ini kita akan mempelajari fiqih berdasarkan mazhab Syafi'i yang banyak dianut oleh umat Muslim di Indonesia dan Asia Tenggara, dengan beberapa perbandingan dengan mazhab lainnya.

---
✅ **Ringkasan:** Fiqih adalah panduan praktis beribadah dan menjalani kehidupan sesuai syariat Islam. Sebagai Muslimah, memahami fiqih adalah kewajiban agar ibadah kita sah dan diterima Allah.
      ` },
      { id: 2, title: 'Thaharah: Bersuci dalam Islam', duration: '25 mnt', completed: true, type: 'video', content: `
## Thaharah: Bersuci dalam Islam

**Pengertian Thaharah**

Thaharah (الطهارة) artinya bersuci atau kebersihan. Dalam Islam, thaharah adalah membersihkan diri dari hadats (najis yang bersifat maknawi) dan najis (kotoran yang bersifat fisik).

**Pentingnya Thaharah**

Allah SWT berfirman:
> *"إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ"*
> *"Sesungguhnya Allah menyukai orang-orang yang bertaubat dan menyukai orang-orang yang mensucikan diri."* (QS. Al-Baqarah: 222)

**Jenis-Jenis Hadats:**

### 1. Hadats Kecil
Penyebabnya:
- Keluar sesuatu dari qubul/dubur (buang air kecil/besar, kentut)
- Hilang akal (tidur, pingsan, mabuk)
- Menyentuh kemaluan tanpa penghalang (menurut mazhab Syafi'i)

Cara mensucikan: **Wudhu**

### 2. Hadats Besar
Penyebabnya:
- Junub (bersetubuh atau keluar mani)
- Haid (menstruasi)
- Nifas (darah pasca melahirkan)
- Wiladah (melahirkan)

Cara mensucikan: **Mandi Wajib (Ghusl)**

**Jenis-Jenis Najis:**

| Jenis | Contoh | Cara Mensucikan |
|-------|--------|-----------------|
| Najis Mughallazhah (berat) | Jilatan anjing/babi | Dibasuh 7x, 1x dengan tanah |
| Najis Mutawassithah (sedang) | Darah, kotoran | Dihilangkan zatnya, dibasuh |
| Najis Mukhaffafah (ringan) | Air kencing bayi laki-laki | Diperciki air |

**Air yang Sah untuk Bersuci:**
1. Air hujan
2. Air sungai/danau
3. Air laut
4. Air sumur
5. Air mata air
6. Air es yang mencair

---
✅ **Quiz:** Apakah air dalam kemasan (aqua) bisa digunakan untuk wudhu? **Ya**, karena air kemasan berasal dari mata air yang suci dan mensucikan.
      ` },
      { id: 3, title: 'Wudhu: Rukun dan Cara Praktis', duration: '20 mnt', completed: true, type: 'video', content: `
## Wudhu: Rukun dan Cara Praktis

**Pengertian Wudhu**

Wudhu adalah bersuci dari hadats kecil menggunakan air yang dilakukan dengan cara tertentu sesuai syariat Islam.

**Dalil Wajibnya Wudhu**

Allah SWT berfirman:
> *"يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ"*
> *"Wahai orang-orang yang beriman, apabila kamu hendak melaksanakan shalat, maka basuhlah wajahmu dan tanganmu sampai ke siku..."* (QS. Al-Maidah: 6)

**Rukun Wudhu (6 rukun):**

1. **Niat** — di dalam hati, bersamaan dengan membasuh wajah
2. **Membasuh wajah** — dari dahi hingga dagu, dari telinga ke telinga
3. **Membasuh tangan** — dari ujung jari hingga siku (termasuk siku)
4. **Mengusap sebagian kepala** — minimal selebar satu rambut
5. **Membasuh kaki** — dari ujung jari hingga mata kaki (termasuk mata kaki)
6. **Tertib** — berurutan sesuai urutan di atas

**Sunnah-Sunnah Wudhu:**
- Membaca basmalah di awal
- Bersiwak (menggosok gigi)
- Mencuci telapak tangan 3x sebelum memulai
- Berkumur-kumur (madmadlah)
- Istinsyaq (menghirup air ke hidung)
- Membasuh setiap anggota 3x
- Membasuh antara jari-jari tangan dan kaki
- Mendahulukan anggota yang kanan
- Membaca doa setelah wudhu

**Doa Setelah Wudhu:**
> *أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّداً عَبْدُهُ وَرَسُولُهُ*
> *"Asyhadu allaa ilaaha illallahu wahdahu laa syarika lahu wa asyhadu anna Muhammadan 'abduhu wa rasuuluh"*

**Yang Membatalkan Wudhu:**
1. Keluar sesuatu dari qubul/dubur
2. Hilang akal
3. Menyentuh kemaluan
4. Bersentuhan dengan lawan jenis yang bukan mahram (menurut Syafi'i)

---
✅ **Tips Praktis:** Pastikan air merata ke seluruh anggota wudhu. Rambut yang lebat tidak menghalangi sah-nya wudhu selama kulit kepala terusap minimal sebagian kecil.
      ` },
      { id: 4, title: 'Haid: Hukum dan Ketentuan', duration: '30 mnt', completed: true, type: 'video', content: `
## Haid: Hukum dan Ketentuan bagi Muslimah

**Pengertian Haid**

Haid adalah darah yang keluar dari rahim wanita yang telah baligh dalam keadaan sehat (bukan karena sakit atau melahirkan), pada waktu-waktu tertentu.

**Usia Wanita yang Bisa Haid:**
- Minimal: 9 tahun Hijriyah (sekitar 8 tahun 9 bulan)
- Maksimal usia haid: tidak ada batas pasti dalam mazhab Syafi'i

**Masa Haid:**
- Minimal: 1 hari 1 malam (24 jam)
- Umumnya: 6-7 hari
- Maksimal: 15 hari

**Warna Darah Haid:**
1. Hitam (aswad)
2. Merah (ahmar)
3. Merah kecoklatan (asyfar/ashfarr)
4. Kuning (ashfar)
5. Keruh (akdar)

**Yang Diharamkan saat Haid:**
1. ❌ Shalat
2. ❌ Puasa (wajib diqadha)
3. ❌ Thawaf
4. ❌ Menyentuh mushaf Al-Quran
5. ❌ Berdiam di masjid
6. ❌ Berhubungan intim suami-istri

**Yang Dibolehkan saat Haid:**
1. ✅ Membaca Al-Quran dari hafalan (ikhtilaf ulama)
2. ✅ Berdzikir, berdoa
3. ✅ Mendengarkan kajian
4. ✅ Bersentuhan suami-istri di luar zona haid (di atas pusar/bawah lutut)

**Mandi Wajib Setelah Haid:**

Niat: *"Nawaitu ghusla liraf'il hadatsil akbari minal haidhi fardhal lillahi ta'ala"*

Caranya:
1. Niat
2. Basuh tangan 3x
3. Bersihkan kemaluan dari najis
4. Wudhu sempurna
5. Siram kepala 3x sambil memastikan air merata ke kulit kepala
6. Siram seluruh badan, dimulai dari kanan

---
✅ **Penting:** Wanita yang haid tidak berdosa karena tidak shalat. Ini adalah keringanan (rukhsah) dari Allah SWT. Yang wajib diqadha hanya puasa Ramadhan.
      ` },
      { id: 5, title: 'Shalat Fardhu: Rukun dan Keutamaan', duration: '35 mnt', completed: false, type: 'video', content: `
## Shalat Fardhu: Rukun dan Keutamaan

**Keutamaan Shalat**

Rasulullah SAW bersabda:
> *"الصَّلاَةُ عِمَادُ الدِّينِ"*
> *"Shalat adalah tiang agama."* (HR. Al-Baihaqi)

Shalat adalah amalan pertama yang akan dihisab pada hari kiamat.

**5 Waktu Shalat Fardhu:**

| Shalat | Rakaat | Waktu |
|--------|--------|-------|
| Subuh | 2 | Fajar Shadiq hingga terbit matahari |
| Dzuhur | 4 | Matahari tergelincir hingga bayangan = benda |
| Ashar | 4 | Bayangan = benda hingga matahari kuning |
| Maghrib | 3 | Terbenam matahari hingga hilang syafaq merah |
| Isya | 4 | Hilang syafaq merah hingga separuh malam |

**Syarat Sah Shalat:**
1. Islam
2. Baligh dan berakal
3. Suci dari hadats (kecil & besar)
4. Suci badan, pakaian, dan tempat dari najis
5. Menutup aurat
6. Menghadap kiblat
7. Masuk waktu shalat

**Aurat Wanita dalam Shalat:**
Seluruh tubuh kecuali **wajah** dan **telapak tangan** (menurut mazhab Syafi'i).

**Rukun Shalat (13 rukun):**
1. Niat
2. Takbiratul ihram
3. Berdiri (bagi yang mampu)
4. Membaca Al-Fatihah
5. Ruku'
6. I'tidal
7. Sujud (2x per rakaat)
8. Duduk antara dua sujud
9. Tuma'ninah
10. Tasyahud akhir
11. Membaca shalawat dalam tasyahud akhir
12. Salam
13. Tertib

---
✅ **Amalan Setelah Shalat:** Baca istighfar 3x, lalu baca: Allahu Akbar 33x, Alhamdulillah 33x, Subhanallah 33x, kemudian La ilaha illallah wahdahu la syarikalah lahul mulku walahul hamdu wahuwa 'ala kulli syai'in qadir.
      ` },
      { id: 6, title: 'Puasa Ramadhan & Qadha', duration: '25 mnt', completed: false, type: 'video', content: '## Puasa Ramadhan\n\nMateri akan segera hadir...' },
      { id: 7, title: 'Zakat Fitrah & Zakat Mal', duration: '20 mnt', completed: false, type: 'video', content: '## Zakat\n\nMateri akan segera hadir...' },
      { id: 8, title: 'Doa Sehari-hari Muslimah', duration: '30 mnt', completed: false, type: 'video', content: '## Doa Sehari-hari\n\nMateri akan segera hadir...' },
    ]
  },
  '2': {
    id: 2, title: 'Aqidah Islamiyah untuk Muslimah', instructor: 'Ustadzah Dr. Maryam',
    color: 'from-amber-400 to-orange-500', image: '🌟', duration: '8 jam', lessons: 18,
    rating: 4.8, students: 1923, level: 'Semua Level', progress: 30,
    description: 'Memahami aqidah Islam yang benar sebagai pondasi kehidupan Muslimah.',
    syllabus: [
      { id: 1, title: 'Mengenal Allah: Asmaul Husna', duration: '30 mnt', completed: true, type: 'video', content: `
## Mengenal Allah Melalui Asmaul Husna

**Bismillahirrahmanirrahim**

Allah SWT berfirman:
> *"وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا"*
> *"Dan Allah memiliki Asmaul Husna (nama-nama yang terbaik), maka bermohonlah kepada-Nya dengan menyebut nama-nama itu."* (QS. Al-A'raf: 180)

**Apa itu Asmaul Husna?**

Asmaul Husna adalah 99 nama Allah yang indah, yang menggambarkan sifat-sifat kesempurnaan Allah SWT.

**10 Asmaul Husna dan Maknanya:**

1. **الرَّحْمَنُ (Ar-Rahman)** — Yang Maha Pengasih kepada semua makhluk di dunia
2. **الرَّحِيمُ (Ar-Rahim)** — Yang Maha Penyayang khusus kepada orang-orang beriman di akhirat
3. **الْمَلِكُ (Al-Malik)** — Yang Maha Raja, penguasa seluruh alam
4. **الْقُدُّوسُ (Al-Quddus)** — Yang Maha Suci dari segala kekurangan
5. **السَّلَامُ (As-Salam)** — Yang Maha Memberi Keselamatan
6. **الْمُؤْمِنُ (Al-Mu'min)** — Yang Maha Memberi Keamanan
7. **الْعَزِيزُ (Al-Aziz)** — Yang Maha Perkasa
8. **الْخَالِقُ (Al-Khaliq)** — Yang Maha Pencipta
9. **الرَّزَّاقُ (Ar-Razzaq)** — Yang Maha Pemberi Rezeki
10. **الْعَلِيمُ (Al-Alim)** — Yang Maha Mengetahui

**Cara Mengamalkan Asmaul Husna:**
- Menghafalkannya
- Memahami maknanya
- Berdoa dengan menyebut nama-nama itu
- Menghiasi akhlak dengan sifat-sifat tersebut (dalam kapasitas sebagai hamba)

---
✅ **Amalan:** Biasakan membaca *"Ya Rahman Ya Rahim"* saat membutuhkan kasih sayang Allah, dan *"Ya Razzaq"* saat memohon rezeki.
      ` },
      { id: 2, title: 'Rukun Iman yang 6', duration: '25 mnt', completed: true, type: 'video', content: `
## Rukun Iman yang 6

**Pengertian Iman**

Iman secara bahasa berarti pembenaran (tashdiq). Dalam istilah syariat, iman adalah:
- Membenarkan dengan hati
- Mengucapkan dengan lisan
- Mengamalkan dengan perbuatan

**6 Rukun Iman:**

### 1. Iman kepada Allah
Meyakini bahwa Allah ada, Esa (tauhid), dan memiliki sifat-sifat kesempurnaan.

Tauhid terbagi tiga:
- **Tauhid Rububiyyah** — Allah satu-satunya Pencipta dan Pemelihara
- **Tauhid Uluhiyyah** — Allah satu-satunya yang berhak disembah
- **Tauhid Asma wa Sifat** — mengimani nama-nama dan sifat-sifat Allah

### 2. Iman kepada Malaikat
Malaikat diciptakan dari cahaya, tidak makan/minum/tidur, selalu taat kepada Allah.
Malaikat yang wajib diketahui: Jibril, Mikail, Israfil, Izrail, Munkar, Nakir, Raqib, Atid, Malik, Ridwan

### 3. Iman kepada Kitab-kitab Allah
- Taurat (kepada Nabi Musa AS)
- Zabur (kepada Nabi Dawud AS)
- Injil (kepada Nabi Isa AS)
- **Al-Quran** (kepada Nabi Muhammad SAW) — penyempurna semua kitab

### 4. Iman kepada Para Rasul
25 Nabi/Rasul yang wajib diketahui, mulai Adam AS hingga Muhammad SAW.
Rasul terakhir: **Muhammad SAW** — tidak ada nabi setelahnya.

### 5. Iman kepada Hari Akhir
Meyakini: kematian, alam kubur, hari kebangkitan, mahsyar, hisab, shirath, surga dan neraka.

### 6. Iman kepada Qadha dan Qadar
Meyakini bahwa segala sesuatu terjadi atas ilmu, kehendak, dan ketetapan Allah SWT.

4 perkara yang harus diimani:
1. Allah mengetahui segalanya (Ilmu)
2. Allah telah menulis di Lauhul Mahfuzh (Kitabah)
3. Apa yang Allah kehendaki pasti terjadi (Masyi'ah)
4. Allah menciptakan segala sesuatu (Khalq)

---
✅ **Renungan:** Iman kepada qadar bukan berarti fatalis/pasrah tanpa usaha. Justru kita wajib berusaha maksimal, lalu bertawakal atas hasilnya kepada Allah.
      ` },
      { id: 3, title: 'Tauhid: Pondasi Aqidah', duration: '35 mnt', completed: false, type: 'video', content: '## Tauhid\n\nMateri akan segera hadir...' },
      { id: 4, title: 'Syirik dan Cara Menghindarinya', duration: '30 mnt', completed: false, type: 'video', content: '## Syirik\n\nMateri akan segera hadir...' },
    ]
  },
  '3': {
    id: 3, title: 'Adab Muslimah dalam Kehidupan', instructor: 'Ustadzah Siti Aisyah',
    color: 'from-pink-400 to-rose-500', image: '🌸', duration: '5 jam baca', lessons: 15,
    rating: 4.7, students: 3102, level: 'Pemula', progress: 0,
    description: 'Panduan adab dan akhlak mulia bagi Muslimah dalam berbagai situasi kehidupan.',
    syllabus: [
      { id: 1, title: 'Adab Berpakaian Muslimah', duration: '20 mnt baca', completed: false, type: 'article', content: `
## Adab Berpakaian Muslimah

**Dalil Menutup Aurat**

Allah SWT berfirman:
> *"يَا أَيُّهَا النَّبِيُّ قُل لِّأَزْوَاجِكَ وَبَنَاتِكَ وَنِسَاءِ الْمُؤْمِنِينَ يُدْنِينَ عَلَيْهِنَّ مِن جَلَابِيبِهِنَّ"*
> *"Wahai Nabi, katakanlah kepada istri-istrimu, anak-anak perempuanmu dan istri-istri orang mukmin, hendaklah mereka menutupkan jilbabnya ke seluruh tubuh mereka."* (QS. Al-Ahzab: 59)

**Syarat Pakaian Muslimah:**

1. **Menutup aurat** — Aurat wanita di hadapan laki-laki non-mahram: seluruh tubuh kecuali wajah dan telapak tangan (mayoritas ulama)
2. **Tidak ketat** — Tidak menggambarkan lekuk tubuh
3. **Tidak transparan/tipis** — Tidak memperlihatkan kulit di baliknya
4. **Tidak menyerupai pakaian laki-laki** — Rasulullah SAW melaknat wanita yang menyerupai laki-laki
5. **Tidak menyerupai pakaian non-Muslim** — sebaiknya berpenampilan sebagai Muslimah yang bangga
6. **Tidak berlebihan (israf)** — tidak bermewah-mewah hingga melalaikan

**Adab Berpakaian:**
- Mulai dari kanan
- Baca doa saat mengenakan pakaian
- Baca doa saat melepas pakaian

**Doa Memakai Pakaian:**
> *الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ*
> *"Segala puji bagi Allah yang telah memakaikan ini kepadaku dan memberikannya kepadaku tanpa daya dan kekuatan dariku."*

**Memilih Warna Hijab:**
Islam tidak melarang warna tertentu, namun para ulama menganjurkan warna yang tidak menarik perhatian berlebihan (mencolok) sehingga justru mengundang perhatian.

---
✅ **Motivasi:** Hijab bukan penjara, melainkan mahkota kemuliaan Muslimah. Wanita yang berhijab dengan benar mendapat perlindungan dan kemuliaan dari Allah SWT.
      ` },
      { id: 2, title: 'Adab Berbicara dan Bergaul', duration: '15 mnt baca', completed: false, type: 'article', content: '## Adab Berbicara\n\nMateri akan segera hadir...' },
    ]
  },
  '4': {
    id: 4, title: 'Parenting Islami: Mendidik Generasi Qurani', instructor: 'Ustadzah Ummu Ibrahim',
    color: 'from-blue-400 to-cyan-500', image: '👶', duration: '15 jam', lessons: 30,
    rating: 4.9, students: 1567, level: 'Menengah', progress: 80,
    description: 'Panduan mendidik anak sesuai Al-Quran dan Sunnah dari para pakar parenting islami.',
    syllabus: [
      { id: 1, title: 'Mendidik Anak Sejak dalam Kandungan', duration: '25 mnt', completed: true, type: 'podcast', content: `
## Mendidik Anak Sejak dalam Kandungan

**Stimulasi Islami untuk Janin**

Rasulullah SAW mengajarkan bahwa pendidikan dimulai bahkan sebelum kelahiran. Saat ini ilmu pengetahuan modern pun membuktikan bahwa janin sudah bisa merasakan dan mendengar sejak usia 18-20 minggu.

**Amalan Ibu Hamil:**

### 1. Membaca Al-Quran
- Surah Yusuf: agar anak tampan/cantik dan berakhlak mulia
- Surah Maryam: agar anak taat dan sholeh
- Surah Luqman: agar anak berbakti kepada orang tua

### 2. Banyak Berdzikir
> *سُبْحَانَ اللهِ وَبِحَمْدِهِ سُبْحَانَ اللهِ الْعَظِيمِ*

Dzikir ibu akan terasa oleh janin dan menjadi "makanan ruh" pertama bagi sang anak.

### 3. Menjaga Makanan yang Halal dan Thayyib
Rasulullah SAW bersabda bahwa setiap daging yang tumbuh dari harta haram, maka neraka lebih layak untuknya. Makanan halal membentuk karakter yang baik.

### 4. Menjaga Akhlak dan Emosi
Emosi ibu berpengaruh langsung pada janin. Sering tersenyum, berpikir positif, dan menghindari amarah.

### 5. Berdoa untuk Anak
> *رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ*
> *"Ya Rabb-ku, anugerahkanlah kepadaku dari sisi-Mu seorang anak yang baik. Sesungguhnya Engkau Maha Mendengar doa."* (QS. Ali Imran: 38)

**Adab Suami kepada Istri yang Hamil:**
- Membantu pekerjaan rumah
- Memberikan dukungan emosional
- Mengajak istri ke kajian bersama
- Mendoakan istri dan janin setiap hari

---
✅ **Praktik Hari Ini:** Luangkan 10 menit malam ini untuk membacakan Al-Quran kepada janin/anak sambil mengelus perut. Ini adalah investasi akhirat terbaik.
      ` },
      { id: 2, title: 'Aqiqah dan Nama yang Baik', duration: '20 mnt', completed: true, type: 'podcast', content: '## Aqiqah\n\nMateri akan segera hadir...' },
    ]
  },
  '5': {
    id: 5, title: 'Pernikahan Barokah: Membangun Rumah Tangga Islami', instructor: 'Ustadzah Zainab M.',
    color: 'from-purple-400 to-violet-500', image: '💍', duration: '10 jam', lessons: 20,
    rating: 4.8, students: 2234, level: 'Semua Level', progress: 0,
    description: 'Mempersiapkan diri dan membangun rumah tangga yang sakinah, mawaddah, warahmah.',
    syllabus: [
      { id: 1, title: 'Mempersiapkan Diri Sebelum Menikah', duration: '30 mnt', completed: false, type: 'video', content: `
## Mempersiapkan Diri Sebelum Menikah

**Pernikahan dalam Islam**

Allah SWT berfirman:
> *"وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"*
> *"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."* (QS. Ar-Rum: 21)

**3 Persiapan Penting:**

### 1. Persiapan Spiritual (Ruhiyah)
- Perbaiki kualitas ibadah sebelum menikah
- Biasakan shalat malam (tahajud)
- Banyak berdoa dan istikharah
- Belajar ilmu pernikahan dari sumber yang shahih

### 2. Persiapan Mental (Nafsiyah)
- Pahami hak dan kewajiban suami-istri
- Siapkan diri untuk berkompromi
- Belajar komunikasi yang baik
- Kesiapan menerima kekurangan pasangan

### 3. Persiapan Ilmu (Aqliyah)
- Fiqih nikah: rukun, syarat, mahram
- Hak-hak istri yang wajib dipenuhi suami
- Kewajiban istri kepada suami
- Manajemen keuangan rumah tangga

**Kriteria Memilih Pasangan:**

Rasulullah SAW bersabda:
> *"تُنْكَحُ الْمَرْأَةُ لِأَرْبَعٍ: لِمَالِهَا وَلِحَسَبِهَا وَلِجَمَالِهَا وَلِدِينِهَا، فَاظْفَرْ بِذَاتِ الدِّينِ تَرِبَتْ يَدَاكَ"*
> *"Wanita dinikahi karena empat perkara: hartanya, nasabnya, kecantikannya, dan agamanya. Maka pilihlah yang beragama, niscaya kamu beruntung."* (HR. Bukhari Muslim)

**Doa Istikharah:**
Bacalah doa istikharah setiap malam selama 7 malam sambil berniat memohon petunjuk Allah tentang calon pasangan.

---
✅ **Reminder:** Siapkan dirimu terlebih dahulu sebelum mencari pasangan yang sempurna. Jadilah wanita Muslimah yang terbaik — maka Allah akan menghadirkan pasangan yang setara denganmu.
      ` },
    ]
  },
  '6': {
    id: 6, title: 'Tahsin Al-Quran: Memperbaiki Bacaan', instructor: 'Ustadzah Hafshah',
    color: 'from-green-400 to-teal-500', image: '💚', duration: '20 jam', lessons: 40,
    rating: 5.0, students: 4521, level: 'Semua Level', progress: 45,
    description: 'Pelajari tajwid dan makhrajul huruf dengan bimbingan ustadzah hafizah berpengalaman.',
    syllabus: [
      { id: 1, title: 'Pengenalan Ilmu Tajwid', duration: '20 mnt', completed: true, type: 'video', content: `
## Pengenalan Ilmu Tajwid

**Pengertian Tajwid**

Tajwid (تَجْوِيدٌ) secara bahasa berarti memperindah atau memperbaiki. Secara istilah, tajwid adalah ilmu yang mempelajari cara membaca Al-Quran dengan benar sesuai dengan yang diajarkan Rasulullah SAW.

**Dalil Mempelajari Tajwid**

Allah SWT berfirman:
> *"وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"*
> *"Dan bacalah Al-Quran itu dengan perlahan-lahan (tartil)."* (QS. Al-Muzzammil: 4)

**Hukum Mempelajari Tajwid:**

Menurut para ulama:
- Mempraktikkan tajwid dalam bacaan Al-Quran: **Fardhu 'Ain** (wajib bagi setiap Muslim)
- Mempelajari ilmu tajwid secara teoritis: **Fardhu Kifayah**

**Ruang Lingkup Ilmu Tajwid:**

### 1. Makharijul Huruf
Tempat keluarnya huruf-huruf hijaiyah dari 5 area:
- **Al-Jauf** (rongga mulut) — huruf mad
- **Al-Halq** (tenggorokan) — ء ه ع ح غ خ
- **Al-Lisan** (lidah) — 18 huruf
- **Asy-Syafatain** (dua bibir) — ب م و ف
- **Al-Khaisyum** (hidung) — ghunnah

### 2. Sifatul Huruf
Sifat-sifat huruf yang membedakan karakteristik setiap huruf.

### 3. Ahkamul Huruf
Hukum-hukum yang berlaku pada huruf tertentu seperti:
- Hukum Nun Sukun dan Tanwin
- Hukum Mim Sukun
- Hukum Mad
- Hukum Ra
- Hukum Lam

**Manfaat Belajar Tajwid:**
1. Bacaan Al-Quran menjadi benar dan indah
2. Terhindar dari kesalahan yang bisa mengubah makna
3. Mendapat pahala berlipat membaca dengan tartil
4. Menjaga kemurnian Al-Quran

---
✅ **Latihan:** Coba baca Surah Al-Fatihah dengan perlahan, perhatikan setiap huruf. Apakah kamu sudah mengeluarkan huruf dari makhraj yang benar?
      ` },
      { id: 2, title: 'Makharijul Huruf: Tempat Keluar Huruf', duration: '35 mnt', completed: true, type: 'video', content: '## Makharijul Huruf\n\nMateri akan segera hadir...' },
      { id: 3, title: 'Hukum Nun Sukun dan Tanwin', duration: '30 mnt', completed: false, type: 'video', content: '## Hukum Nun Sukun\n\nMateri akan segera hadir...' },
    ]
  },
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Lesson {
  id: number
  title: string
  duration: string
  completed: boolean
  type: string
  content: string
}

interface CourseData {
  id: number
  title: string
  instructor: string
  color: string
  image: string
  duration: string
  lessons: number
  rating: number
  students: number
  level: string
  progress: number
  description: string
  syllabus: Lesson[]
}

// ─── Type Icons ─────────────────────────────────────────────────────────────────

const typeIconMap: Record<string, React.ElementType> = {
  video: Video,
  article: FileText,
  podcast: Headphones,
  ebook: BookOpen,
}

const typeLabelMap: Record<string, string> = {
  video: 'Video',
  article: 'Artikel',
  podcast: 'Podcast',
  ebook: 'E-Book',
}

// ─── Content Renderer ──────────────────────────────────────────────────────────

function renderContent(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  let listBuffer: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null

  const flushList = () => {
    if (listBuffer) {
      if (listBuffer.type === 'ul') {
        elements.push(
          <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-3 text-foreground/90 pl-2">
            {listBuffer.items}
          </ul>
        )
      } else {
        elements.push(
          <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 my-3 text-foreground/90 pl-2">
            {listBuffer.items}
          </ol>
        )
      }
      listBuffer = null
    }
  }

  const parseBold = (line: string): React.ReactNode => {
    const parts = line.split(/\*\*(.+?)\*\*/)
    if (parts.length === 1) return line
    return (
      <>
        {parts.map((part, idx) =>
          idx % 2 === 1 ? <strong key={idx} className="font-semibold text-foreground">{part}</strong> : part
        )}
      </>
    )
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={i} className="text-xl font-bold text-teal-600 dark:text-teal-400 mt-6 mb-3 pb-2 border-b border-teal-100 dark:border-teal-900">
          {trimmed.slice(3)}
        </h2>
      )
    } else if (trimmed.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={i} className="text-base font-bold text-foreground mt-5 mb-2">
          {trimmed.slice(4)}
        </h3>
      )
    } else if (trimmed.startsWith('> ')) {
      flushList()
      elements.push(
        <blockquote key={i} className="my-4 pl-4 border-l-4 border-teal-400 bg-amber-50 dark:bg-amber-950/20 rounded-r-lg py-3 pr-3 text-sm italic text-foreground/80">
          {parseBold(trimmed.slice(2))}
        </blockquote>
      )
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const item = <li key={i}>{parseBold(trimmed.slice(2))}</li>
      if (listBuffer && listBuffer.type === 'ul') {
        listBuffer.items.push(item)
      } else {
        flushList()
        listBuffer = { type: 'ul', items: [item] }
      }
    } else if (/^\d+\.\s/.test(trimmed)) {
      const item = <li key={i}>{parseBold(trimmed.replace(/^\d+\.\s/, ''))}</li>
      if (listBuffer && listBuffer.type === 'ol') {
        listBuffer.items.push(item)
      } else {
        flushList()
        listBuffer = { type: 'ol', items: [item] }
      }
    } else if (trimmed === '---') {
      flushList()
      elements.push(<hr key={i} className="my-5 border-border" />)
    } else if (trimmed === '') {
      flushList()
      elements.push(<div key={i} className="h-2" />)
    } else if (trimmed.startsWith('|')) {
      // Simple table row — just render as monospace text
      flushList()
      elements.push(
        <div key={i} className="font-mono text-xs bg-muted/50 px-3 py-1 rounded my-0.5 overflow-x-auto whitespace-nowrap">
          {trimmed}
        </div>
      )
    } else {
      flushList()
      elements.push(
        <p key={i} className="text-sm leading-relaxed text-foreground/85 my-1.5">
          {parseBold(trimmed)}
        </p>
      )
    }

    i++
  }

  flushList()
  return elements
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const course = coursesData[courseId]

  const [activeLessonId, setActiveLessonId] = useState<number>(
    course ? (course.syllabus.find(l => !l.completed)?.id ?? course.syllabus[0]?.id ?? 1) : 1
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>(
    course
      ? Object.fromEntries(course.syllabus.map(l => [l.id, l.completed]))
      : {}
  )

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="text-5xl">📚</div>
        <h2 className="text-xl font-bold text-foreground">Kursus tidak ditemukan</h2>
        <p className="text-muted-foreground text-sm">Kursus dengan ID ini tidak tersedia.</p>
        <Button onClick={() => router.push('/dashboard/learning')} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Learning Center
        </Button>
      </div>
    )
  }

  const activeLesson = course.syllabus.find(l => l.id === activeLessonId) ?? course.syllabus[0]
  const activeLessonIndex = course.syllabus.findIndex(l => l.id === activeLessonId)
  const prevLesson = activeLessonIndex > 0 ? course.syllabus[activeLessonIndex - 1] : null
  const nextLesson = activeLessonIndex < course.syllabus.length - 1 ? course.syllabus[activeLessonIndex + 1] : null

  const completedCount = Object.values(completedMap).filter(Boolean).length
  const totalCount = course.syllabus.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const markComplete = () => {
    setCompletedMap(prev => ({ ...prev, [activeLessonId]: true }))
    if (nextLesson) setActiveLessonId(nextLesson.id)
  }

  const TypeIcon = typeIconMap[activeLesson.type] ?? BookOpen

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 min-h-screen -mt-2">

      {/* ── Mobile Top Bar ─────────────────────────────────────────────────────── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-background border-b border-border sticky top-0 z-30">
        <button
          onClick={() => router.push('/dashboard/learning')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kursus</span>
        </button>
        <span className="font-semibold text-sm text-foreground truncate max-w-[180px]">{course.title}</span>
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Mobile Lesson Accordion ────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-b border-border bg-card"
          >
            <div className="p-3 space-y-1 max-h-72 overflow-y-auto">
              {course.syllabus.map((lesson, idx) => {
                const LessonTypeIcon = typeIconMap[lesson.type] ?? BookOpen
                const isActive = lesson.id === activeLessonId
                const isDone = completedMap[lesson.id]
                return (
                  <button
                    key={lesson.id}
                    onClick={() => { setActiveLessonId(lesson.id); setSidebarOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isActive ? 'bg-teal-600 text-white' : isDone ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-muted text-muted-foreground'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${isActive ? 'text-teal-700 dark:text-teal-300' : 'text-foreground'}`}>{lesson.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <LessonTypeIcon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-80 xl:w-96 shrink-0">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/learning')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-teal-600 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Learning Center
        </button>

        {/* Course header card */}
        <Card className="overflow-hidden mb-4">
          <div className={`h-24 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
            <span className="text-5xl">{course.image}</span>
          </div>
          <CardContent className="p-4">
            <h2 className="font-bold text-sm text-foreground mb-1 line-clamp-2">{course.title}</h2>
            <p className="text-xs text-teal-600 font-medium mb-3">{course.instructor}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {course.students.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.duration}
              </div>
            </div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">{completedCount}/{totalCount} pelajaran</span>
              <span className="font-semibold text-teal-600">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </CardContent>
        </Card>

        {/* Lesson list */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[calc(100vh-320px)]">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-2">
            Daftar Pelajaran
          </p>
          {course.syllabus.map((lesson, idx) => {
            const LessonTypeIcon = typeIconMap[lesson.type] ?? BookOpen
            const isActive = lesson.id === activeLessonId
            const isDone = completedMap[lesson.id]
            return (
              <motion.button
                key={lesson.id}
                onClick={() => setActiveLessonId(lesson.id)}
                whileHover={{ x: 2 }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 shadow-sm'
                    : 'hover:bg-muted/60'
                }`}
              >
                {/* Number / status indicator */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : isDone
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {isDone && !isActive ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium leading-snug line-clamp-2 ${
                    isActive ? 'text-teal-700 dark:text-teal-300' : 'text-foreground'
                  }`}>
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <LessonTypeIcon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                    {isDone && (
                      <Badge className="text-[10px] px-1.5 py-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border-0 h-4">
                        Selesai
                      </Badge>
                    )}
                  </div>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                )}
              </motion.button>
            )
          })}
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0">
        <motion.div
          key={activeLessonId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          {/* Lesson header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="gap-1 text-xs bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800">
                  <TypeIcon className="w-3 h-3" />
                  {typeLabelMap[activeLesson.type] ?? activeLesson.type}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {activeLesson.duration}
                </div>
                <span className="text-xs text-muted-foreground">
                  Pelajaran {activeLessonIndex + 1} dari {course.syllabus.length}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                {activeLesson.title}
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {completedMap[activeLessonId] ? (
                <Badge className="gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border-0 px-3 py-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Selesai
                </Badge>
              ) : (
                <Button onClick={markComplete} size="sm" className="gap-1.5 bg-teal-600 hover:bg-teal-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tandai Selesai
                </Button>
              )}
            </div>
          </div>

          {/* Content area */}
          <Card>
            <CardContent className="p-5 sm:p-7">
              {/* Lesson type visual indicator */}
              {activeLesson.type === 'video' && (
                <div className={`w-full h-36 rounded-xl bg-gradient-to-br ${course.color} flex flex-col items-center justify-center gap-3 mb-6 opacity-90`}>
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">Video Pelajaran</span>
                </div>
              )}
              {activeLesson.type === 'podcast' && (
                <div className={`w-full h-28 rounded-xl bg-gradient-to-br ${course.color} flex flex-col items-center justify-center gap-2 mb-6 opacity-90`}>
                  <Headphones className="w-10 h-10 text-white/90" />
                  <span className="text-white/90 text-sm font-medium">Audio Podcast</span>
                </div>
              )}
              {activeLesson.type === 'article' && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 mb-5">
                  <BookMarked className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-300">Artikel — baca dengan tenang dan hayati setiap poin</p>
                </div>
              )}

              {/* Rendered lesson content */}
              <div className="prose-sm max-w-none">
                {renderContent(activeLesson.content)}
              </div>
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-3 pb-8">
            <Button
              variant="outline"
              onClick={() => prevLesson && setActiveLessonId(prevLesson.id)}
              disabled={!prevLesson}
              className="gap-2 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Pelajaran Sebelumnya</span>
              <span className="sm:hidden">Sebelumnya</span>
            </Button>

            <div className="flex gap-1">
              {course.syllabus.slice(0, 8).map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    lesson.id === activeLessonId
                      ? 'bg-teal-600 w-5'
                      : completedMap[lesson.id]
                      ? 'bg-emerald-400'
                      : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
              {course.syllabus.length > 8 && (
                <span className="text-xs text-muted-foreground self-center ml-1">+{course.syllabus.length - 8}</span>
              )}
            </div>

            {nextLesson ? (
              <Button
                onClick={() => setActiveLessonId(nextLesson.id)}
                className="gap-2 text-sm bg-teal-600 hover:bg-teal-700"
              >
                <span className="hidden sm:inline">Pelajaran Berikutnya</span>
                <span className="sm:hidden">Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/dashboard/learning')}
                variant="outline"
                className="gap-2 text-sm text-emerald-600 border-emerald-200"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Selesai Semua</span>
                <span className="sm:hidden">Selesai</span>
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
