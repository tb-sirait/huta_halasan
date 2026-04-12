// ============================================================
// index.js — Barrel export semua service
// Import dari file ini untuk kemudahan penggunaan
// ============================================================

export { default as AuthService }        from './services/auth.service.js';
export { default as KontenService }      from './services/konten.service.js';
export { default as PengetahuanService } from './services/pengetahuan.service.js';
export { default as InteraksiService }   from './services/interaksi.service.js';
export { default as UserService }        from './services/user.service.js';
export { TokenService, ApiError }        from './api.config.js';


// ============================================================
// CONTOH PENGGUNAAN LENGKAP
// Salin bagian yang dibutuhkan ke komponen frontend Anda
// ============================================================

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 1. AUTH — Register & Login
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { AuthService } from './index.js';

// Register user biasa
try {
  await AuthService.register({
    nama_user: 'Budi Santoso',
    email: 'budi@email.com',
    password: 'password123',
    role: 'User',
  });
} catch (err) {
  console.error(err.message); // 'Email sudah terdaftar.'
}

// Register Admin Jurnalis
await AuthService.register({
  nama_user: 'Sari Admin',
  email: 'sari@email.com',
  password: 'password123',
  role: 'Admin',
  subrole: 'Jurnalis',
});

// Login
try {
  const { user, token } = await AuthService.login({
    email: 'budi@email.com',
    password: 'password123',
  });
  console.log('Login sebagai:', user.role, user.subrole);
  // Token otomatis tersimpan di localStorage
} catch (err) {
  console.error(err.message); // 'Email atau password salah.'
}

// Route guard — taruh di setiap halaman yang butuh login
if (!AuthService.verifyToken()) {
  window.location.href = '/login'; // redirect jika tidak login / token expired
}

// Cek hak akses sebelum tampilkan tombol
if (AuthService.can.uploadKonten()) {
  // Tampilkan tombol "Buat Konten"
}

// Ambil profil
const { user } = await AuthService.getProfile();

// Update profil
await AuthService.updateProfile({ nama_user: 'Nama Baru' });
await AuthService.updateProfile({ password: 'passwordBaru123' });

// Logout
AuthService.logout();


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 2. KONTEN — CRUD Berita / Edukasi
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { KontenService } from './index.js';

// List konten (publik, hanya yang sudah divalidasi)
const { data, total } = await KontenService.getAll({
  page: 1,
  limit: 10,
  jenis_konten: 'Berita',
  search: 'parmalim',
});

// List SEMUA konten termasuk belum divalidasi (Admin)
const semua = await KontenService.getAll({ status_validasi: 'belum' });

// Detail konten
const { konten } = await KontenService.getById('kid-abc123');

// Buat konten baru (dengan upload gambar)
const fileInput = document.querySelector('input[type="file"]');
await KontenService.create({
  judul: 'Upacara Sipaha Lima 2024',
  penulis: 'Tim Redaksi',
  isi_konten: `Paragraf pertama...\n\nParagraf kedua...\n\nParagraf ketiga...`,
  jenis_konten: 'Berita',
  tagline: 'Upacara, Tradisi, Parmalim',
  gambar: [...fileInput.files], // maks 3 file
});

// Update konten
await KontenService.update('kid-abc123', {
  judul: 'Judul Diperbarui',
  isi_konten: 'Isi baru paragraf satu...\n\nParagraf dua...\n\nParagraf tiga...',
});

// Validasi konten (Admin Validator)
await KontenService.updateValidasi('kid-abc123', 'sudah');
await KontenService.updateValidasi('kid-abc123', 'belum'); // batalkan validasi

// Hapus konten
await KontenService.delete('kid-abc123');

// Lihat siapa yang merancang konten (Pengembang / Manajer)
const { data: perancang } = await KontenService.getRancang('kid-abc123');


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 3. PENGETAHUAN — E-Book / File
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { PengetahuanService } from './index.js';

// List file pengetahuan
const { data } = await PengetahuanService.getAll({ page: 1, limit: 10 });

// Detail file
const { pengetahuan } = await PengetahuanService.getById('uuid-file-xxx');

// Upload E-Book baru
const fileInput = document.querySelector('#file-ebook');
await PengetahuanService.upload({
  nama_file: 'Pedoman Ugamo Malim',
  deskripsi: 'Buku panduan lengkap mengenai ajaran Ugamo Malim...',
  tagline: ['Agama', 'Parmalim', 'Pedoman'],
  file: fileInput.files[0],
});

// Update metadata
await PengetahuanService.update('uuid-file-xxx', {
  nama_file: 'Judul Baru',
  tagline: ['Tag1', 'Tag2'],
});

// Validasi file (Admin Validator)
await PengetahuanService.updateValidasi('uuid-file-xxx', 'sudah');

// Hapus file
await PengetahuanService.delete('uuid-file-xxx');


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 4. INTERAKSI — View, Like, Komentar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { InteraksiService } from './index.js';

// Catat view saat halaman dibuka
// (untuk konten biasa)
await InteraksiService.recordView({ id_konten: 'kid-abc123' });
// (untuk file pengetahuan)
await InteraksiService.recordView({ id_file: 'uuid-file-xxx' });

// Toggle like (tekan tombol like)
const { liked, total } = (await InteraksiService.toggleLike({ id_konten: 'kid-abc123' }));
likeButton.textContent = liked ? '❤️ ' + total : '🤍 ' + total;

// Ambil jumlah like
const { total: jumlahLike } = await InteraksiService.getLikeCount({ id_konten: 'kid-abc123' });

// Tambah komentar (siapapun bisa, termasuk yang belum login)
await InteraksiService.addKomentar({
  id_konten: 'kid-abc123',
  isi_komentar: 'Artikel yang sangat informatif!',
});

// Ambil komentar aktif
const { data: komentar, total: totalKomentar } = await InteraksiService.getKomentar({
  id_konten: 'kid-abc123',
  page: 1,
  limit: 20,
});

// Hapus komentar (Manajer / Pengembang)
await InteraksiService.deleteKomentar(id_interaksi);

// Insight semua konten (Manajer / Pengembang)
const { data: insight } = await InteraksiService.getInsightAll({ tipe: 'konten' });
// insight[0] = { target_id, total_view: 120, total_like: 45, total_komentar: 12 }

// Insight konten spesifik
const { insight: detail } = await InteraksiService.getInsightByTarget('kid-abc123');


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 5. USER — Manajemen (Admin Pengembang)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { UserService } from './index.js';

// List semua user
const { data: users } = await UserService.getAll({ page: 1, role: 'Admin' });

// Detail user
const { user } = await UserService.getById('uuid-user-xxx');

// Update role/subrole user
await UserService.update('uuid-user-xxx', {
  role: 'Admin',
  subrole: 'Validator',
});

// Hapus user
await UserService.delete('uuid-user-xxx');


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 6. ERROR HANDLING GLOBAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { ApiError } from './index.js';

// Pattern yang direkomendasikan di setiap komponen
const loadKonten = async () => {
  try {
    const { data } = await KontenService.getAll({ page: 1 });
    renderKonten(data);
  } catch (err) {
    if (err instanceof ApiError) {
      switch (err.status) {
        case 0:   showToast('Tidak ada koneksi internet.', 'error'); break;
        case 401: // ditangani otomatis (redirect login via event 'auth:expired')
                  break;
        case 403: showToast('Anda tidak punya akses ke fitur ini.', 'warning'); break;
        case 404: showToast('Konten tidak ditemukan.', 'info'); break;
        case 422:
        case 400: showToast(err.message, 'warning'); break;
        default:  showToast('Terjadi kesalahan server.', 'error');
      }
    }
  }
};

// Listener token expired (dipanggil otomatis oleh api.config.js)
window.addEventListener('auth:expired', () => {
  showToast('Sesi habis. Silakan login kembali.', 'warning');
  window.location.href = '/login';
});
*/
