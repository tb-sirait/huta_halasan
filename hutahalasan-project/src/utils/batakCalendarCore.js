// ============================================================
// batakCalendarCore.js
// Single source of truth — di-import oleh Calendar.jsx dan BatakCalendarSEO.jsx
// Data sinkronisasi 100% akurat dari kalender_batak.xlsx
// ============================================================

export const BATAK_HARI = [
  "Artia",               // 1
  "Suma",                // 2
  "Anggara",             // 3
  "Muda",                // 4
  "Boraspati",           // 5
  "Singkora",            // 6
  "Samisara",            // 7
  "Artia Ni Aek",        // 8
  "Suma Ni Mangadop",    // 9
  "Anggara Sampulu",     // 10
  "Muda Ni Mangadop",    // 11
  "Boraspati Ni Tangkup",// 12
  "Singkora Purasa",     // 13
  "Samisara Purasa",     // 14
  "Tula",                // 15
  "Suma Ni Holom",       // 16
  "Anggara Ni Holom",    // 17
  "Muda Ni Holom",       // 18
  "Boraspati Ni Holom",  // 19
  "Singkora Moraturun",  // 20
  "Samisara Moraturun",  // 21
  "Artia Ni Angga",      // 22
  "Suma Ni Mate",        // 23
  "Anggara Ni Begu",     // 24
  "Muda Ni Mate",        // 25
  "Boraspati Nagok",     // 26
  "Singkora Duduk",      // 27
  "Samisara Bulan Mate", // 28
  "Hurung",              // 29
  "Ringkar",             // 30
];

// ── Aturan panjang bulan terakhir per tahun ──────────────────────────────────
//
// Bulan terakhir = Lamadu (tahun Lamadu: 2025, 2028, …) atau Hurung (tahun biasa).
// Data akurat dari kalender_batak.xlsx:
//   2025 → Lamadu 30 hari  → Mangan Napaet tgl 29 & 30
//   2026 → Hurung 30 hari  → Mangan Napaet tgl 29 & 30
//   2027 → Hurung 29 hari  → Mangan Napaet tgl 28 & 29
//   2028 → Lamadu 29 hari  → Mangan Napaet tgl 28 & 29
//   2029 → Hurung 29 hari  → Mangan Napaet tgl 28 & 29
//   2030 → Hurung 30 hari  → Mangan Napaet tgl 29 & 30

const LAST_BATAK_MONTH_LENGTH = {
  2025: 30, // Lamadu 30 hari
  2026: 30, // Hurung 30 hari
  2027: 29, // Hurung 29 hari
  2028: 29, // Lamadu 29 hari
  2029: 29, // Hurung 29 hari
  2030: 30, // Hurung 30 hari
};

/** Apakah tahun Masehi termasuk tahun Lamadu (bulan ke-13)? */
export function isTahunLamadu(year) {
  return (year - 2025) % 3 === 0;
}

/**
 * Nama bulan terakhir kalender Batak untuk tahun Masehi tertentu.
 * Tahun Lamadu → "Lamadu", lainnya → "Hurung"
 */
export function getBulanTerakhir(year) {
  return isTahunLamadu(year) ? "Lamadu" : "Hurung";
}

/**
 * Panjang bulan terakhir (Hurung atau Lamadu) untuk tahun Masehi.
 * Default 30 hari jika tahun di luar tabel.
 */
export function getPanjangBulanTerakhir(year) {
  return LAST_BATAK_MONTH_LENGTH[year] ?? 30;
}

/**
 * Dua tanggal Batak Mangan Napaet di tahun ini.
 * Mangan Napaet dirayakan pada Ari Hurung (tgl 29) dan Ringkar (tgl 30)
 * di bulan terakhir. Jika bulan terakhir hanya 29 hari, dimajukan 1 hari
 * menjadi Samisara Bulan Mate (tgl 28) dan Hurung (tgl 29).
 *
 * 30-hari → [29, 30]  (Hurung & Ringkar)
 * 29-hari → [28, 29]  (Samisara Bulan Mate & Hurung)
 */
export function getManganNapaetTanggal(year) {
  const len = getPanjangBulanTerakhir(year);
  return len === 30 ? [29, 30] : [28, 29];
}

// ── Transisi bulan Batak 2025–2030 ─────────────────────────────────────────
//
// Semua data di bawah ini 100% akurat dari kalender_batak.xlsx.
// Format: { date: new Date(Y, M-1, D), bulan: "NamaBulan", tanggal: N }
// → tanggal = tanggal Batak pada hari pertama Masehi masuk bulan tersebut
//
// Catatan: Untuk entri awal tahun yang merupakan lanjutan bulan sebelumnya,
// tanggal > 1 menandakan di mana posisi tanggal Batak pada 1 Januari.

export const BATAK_MONTH_TRANSITIONS = [
  // ── 2024 (akhir tahun — anchor untuk Jan 2025) ───────────────────────────
  // Jan 1 2025 = Li tgl 2, maka Li tgl 1 = Dec 31 2024
  { date: new Date(2024, 11, 31), bulan: "Li",             tanggal: 1  },

  // ── 2025 (tahun Lamadu) — data dari Excel ────────────────────────────────
  { date: new Date(2025,  0, 29), bulan: "Hurung",         tanggal: 1  },
  { date: new Date(2025,  1, 28), bulan: "Lamadu",         tanggal: 1  }, // bulan ke-13
  { date: new Date(2025,  2, 30), bulan: "Sipaha Sada",    tanggal: 1  },
  { date: new Date(2025,  3, 28), bulan: "Sipaha Dua",     tanggal: 1  },
  { date: new Date(2025,  4, 28), bulan: "Sipaha Tolu",    tanggal: 1  },
  { date: new Date(2025,  5, 27), bulan: "Sipaha Opat",    tanggal: 1  },
  { date: new Date(2025,  6, 26), bulan: "Sipaha Lima",    tanggal: 1  },
  { date: new Date(2025,  7, 25), bulan: "Sipaha Onom",    tanggal: 1  },
  { date: new Date(2025,  8, 23), bulan: "Sipaha Pitu",    tanggal: 1  },
  { date: new Date(2025,  9, 22), bulan: "Sipaha Ualu",    tanggal: 1  },
  { date: new Date(2025, 10, 21), bulan: "Sipaha Sia",     tanggal: 1  },
  { date: new Date(2025, 11, 20), bulan: "Sipaha Sampulu", tanggal: 1  },

  // ── 2026 (bukan tahun Lamadu) — data dari Excel ──────────────────────────
  { date: new Date(2026,  0, 19), bulan: "Li",             tanggal: 1  },
  { date: new Date(2026,  1, 17), bulan: "Hurung",         tanggal: 1  },
  { date: new Date(2026,  2, 19), bulan: "Sipaha Sada",    tanggal: 1  },
  { date: new Date(2026,  3, 18), bulan: "Sipaha Dua",     tanggal: 1  },
  { date: new Date(2026,  4, 17), bulan: "Sipaha Tolu",    tanggal: 1  },
  { date: new Date(2026,  5, 16), bulan: "Sipaha Opat",    tanggal: 1  },
  { date: new Date(2026,  6, 15), bulan: "Sipaha Lima",    tanggal: 1  },
  { date: new Date(2026,  7, 14), bulan: "Sipaha Onom",    tanggal: 1  },
  { date: new Date(2026,  8, 12), bulan: "Sipaha Pitu",    tanggal: 1  },
  { date: new Date(2026,  9, 12), bulan: "Sipaha Ualu",    tanggal: 1  },
  { date: new Date(2026, 10, 10), bulan: "Sipaha Sia",     tanggal: 1  },
  { date: new Date(2026, 11, 10), bulan: "Sipaha Sampulu", tanggal: 1  },

  // ── 2027 (bukan tahun Lamadu — Hurung 29 hari) — data dari Excel ─────────
  { date: new Date(2027,  0,  8), bulan: "Li",             tanggal: 1  },
  { date: new Date(2027,  1,  7), bulan: "Hurung",         tanggal: 1  }, // 29 hari
  { date: new Date(2027,  2,  8), bulan: "Sipaha Sada",    tanggal: 1  },
  { date: new Date(2027,  3,  7), bulan: "Sipaha Dua",     tanggal: 1  },
  { date: new Date(2027,  4,  6), bulan: "Sipaha Tolu",    tanggal: 1  },
  { date: new Date(2027,  5,  5), bulan: "Sipaha Opat",    tanggal: 1  },
  { date: new Date(2027,  6,  4), bulan: "Sipaha Lima",    tanggal: 1  },
  { date: new Date(2027,  7,  3), bulan: "Sipaha Onom",    tanggal: 1  },
  { date: new Date(2027,  8,  2), bulan: "Sipaha Pitu",    tanggal: 1  },
  { date: new Date(2027,  9,  1), bulan: "Sipaha Ualu",    tanggal: 1  },
  { date: new Date(2027,  9, 31), bulan: "Sipaha Sia",     tanggal: 1  },
  { date: new Date(2027, 10, 29), bulan: "Sipaha Sampulu", tanggal: 1  },
  { date: new Date(2027, 11, 29), bulan: "Li",             tanggal: 1  },

  // ── 2028 (tahun Lamadu — Hurung 30 hari, Lamadu 29 hari) — data dari Excel
  { date: new Date(2028,  0, 27), bulan: "Hurung",         tanggal: 1  }, // 30 hari
  { date: new Date(2028,  1, 26), bulan: "Lamadu",         tanggal: 1  }, // 29 hari, bulan ke-13
  { date: new Date(2028,  2, 26), bulan: "Sipaha Sada",    tanggal: 1  },
  { date: new Date(2028,  3, 25), bulan: "Sipaha Dua",     tanggal: 1  },
  { date: new Date(2028,  4, 24), bulan: "Sipaha Tolu",    tanggal: 1  },
  { date: new Date(2028,  5, 23), bulan: "Sipaha Opat",    tanggal: 1  },
  { date: new Date(2028,  6, 22), bulan: "Sipaha Lima",    tanggal: 1  },
  { date: new Date(2028,  7, 21), bulan: "Sipaha Onom",    tanggal: 1  },
  { date: new Date(2028,  8, 19), bulan: "Sipaha Pitu",    tanggal: 1  },
  { date: new Date(2028,  9, 19), bulan: "Sipaha Ualu",    tanggal: 1  },
  { date: new Date(2028, 10, 18), bulan: "Sipaha Sia",     tanggal: 1  },
  { date: new Date(2028, 11, 17), bulan: "Sipaha Sampulu", tanggal: 1  },

  // ── 2029 (bukan tahun Lamadu — Hurung 29 hari) — data dari Excel ─────────
  { date: new Date(2029,  0, 16), bulan: "Li",             tanggal: 1  },
  { date: new Date(2029,  1, 15), bulan: "Hurung",         tanggal: 1  }, // 29 hari
  { date: new Date(2029,  2, 16), bulan: "Sipaha Sada",    tanggal: 1  },
  { date: new Date(2029,  3, 14), bulan: "Sipaha Dua",     tanggal: 1  },
  { date: new Date(2029,  4, 14), bulan: "Sipaha Tolu",    tanggal: 1  },
  { date: new Date(2029,  5, 12), bulan: "Sipaha Opat",    tanggal: 1  },
  { date: new Date(2029,  6, 11), bulan: "Sipaha Lima",    tanggal: 1  },
  { date: new Date(2029,  7, 10), bulan: "Sipaha Onom",    tanggal: 1  },
  { date: new Date(2029,  8,  8), bulan: "Sipaha Pitu",    tanggal: 1  },
  { date: new Date(2029,  9,  8), bulan: "Sipaha Ualu",    tanggal: 1  },
  { date: new Date(2029, 10,  7), bulan: "Sipaha Sia",     tanggal: 1  },
  { date: new Date(2029, 11,  7), bulan: "Sipaha Sampulu", tanggal: 1  },

  // ── 2030 (bukan tahun Lamadu — Hurung 30 hari) — data dari Excel ─────────
  { date: new Date(2030,  0,  5), bulan: "Li",             tanggal: 1  },
  { date: new Date(2030,  1,  4), bulan: "Hurung",         tanggal: 1  }, // 30 hari
  { date: new Date(2030,  2,  6), bulan: "Sipaha Sada",    tanggal: 1  },
  { date: new Date(2030,  3,  4), bulan: "Sipaha Dua",     tanggal: 1  },
  { date: new Date(2030,  4,  3), bulan: "Sipaha Tolu",    tanggal: 1  },
  { date: new Date(2030,  5,  2), bulan: "Sipaha Opat",    tanggal: 1  },
  { date: new Date(2030,  6,  1), bulan: "Sipaha Lima",    tanggal: 1  },
  { date: new Date(2030,  6, 30), bulan: "Sipaha Onom",    tanggal: 1  },
  { date: new Date(2030,  7, 29), bulan: "Sipaha Pitu",    tanggal: 1  },
  { date: new Date(2030,  8, 27), bulan: "Sipaha Ualu",    tanggal: 1  },
  { date: new Date(2030,  9, 27), bulan: "Sipaha Sia",     tanggal: 1  },
  { date: new Date(2030, 10, 26), bulan: "Sipaha Sampulu", tanggal: 1  },
  { date: new Date(2030, 11, 26), bulan: "Li",             tanggal: 1  },
].sort((a, b) => a.date - b.date);

/**
 * Menghitung info kalender Batak untuk tanggal Masehi tertentu.
 * @param {Date} date
 * @returns {{ hari: string, tanggal: number, bulan: string }}
 */
export function getBatakInfo(date) {
  // Normalisasi ke tengah hari agar tidak ada masalah timezone
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  let lastEntry = BATAK_MONTH_TRANSITIONS[0];
  for (const t of BATAK_MONTH_TRANSITIONS) {
    const td = new Date(t.date.getFullYear(), t.date.getMonth(), t.date.getDate());
    if (d >= td) lastEntry = t;
  }

  const diffDays = Math.round((d - new Date(
    lastEntry.date.getFullYear(),
    lastEntry.date.getMonth(),
    lastEntry.date.getDate()
  )) / 86400000);

  const tanggal = lastEntry.tanggal + diffDays;
  return {
    hari:    BATAK_HARI[(tanggal - 1) % 30],
    tanggal,
    bulan:   lastEntry.bulan,
  };
}

/** Mendapatkan daftar bulan Batak unik dalam satu bulan Masehi. */
export function getBatakMonthsInView(year, month) {
  const months      = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const { bulan } = getBatakInfo(new Date(year, month, d));
    if (!months.includes(bulan)) months.push(bulan);
  }
  return months;
}

/**
 * Mengembalikan nama lengkap hari penting Parmalim, atau null jika tidak ada.
 *
 * Aturan event Parmalim:
 *
 * 1. Mangan Napaet — 2 hari TERAKHIR bulan terakhir tahun Batak:
 *    - Bulan terakhir = Lamadu (tahun Lamadu 2025, 2028, …) atau Hurung (tahun biasa)
 *    - Bulan 30 hari → tgl 29 (Hurung) & 30 (Ringkar)
 *    - Bulan 29 hari → tgl 28 (Samisara Bulan Mate) & 29 (Hurung)
 *
 * 2. Robu — tgl 1 bulan Sipaha Sada (Tahun Baru Batak, hari Artia)
 *
 * 3. Ari Hatutubu ni Tuhan Simarimbulubosi — tgl 2 & 3 bulan Sipaha Sada
 *    (hari Suma dan Anggara)
 *
 * 4. Ari Pameleon Bolon — tgl 12, 13, 14 bulan Sipaha Lima
 *    (hari Boraspati Ni Tangkup, Singkora Purasa, Samisara Purasa)
 *
 * @param {Date} date
 * @returns {string|null}
 */
export function getParmalimEvent(date) {
  const { tanggal, bulan } = getBatakInfo(date);
  const year               = date.getFullYear();

  const bulanTerakhir = getBulanTerakhir(year);
  const [mn1, mn2]    = getManganNapaetTanggal(year);

  // Mangan Napaet
  if (bulan === bulanTerakhir && (tanggal === mn1 || tanggal === mn2)) {
    return "Mangan Napaet";
  }

  // Robu (Tahun Baru Batak)
  if (bulan === "Sipaha Sada" && tanggal === 1) {
    return "Robu";
  }

  // Ari Hatutubu ni Tuhan Simarimbulubosi (tgl 2–3 Sipaha Sada)
  if (bulan === "Sipaha Sada" && (tanggal === 2 || tanggal === 3)) {
    return "Ari Hatutubu ni Tuhan Simarimbulubosi";
  }

  // Ari Pameleon Bolon (tgl 12–14 Sipaha Lima)
  // Boraspati Ni Tangkup (12), Singkora Purasa (13), Samisara Purasa (14)
  if (bulan === "Sipaha Lima" && tanggal >= 12 && tanggal <= 14) {
    return "Ari Pameleon Bolon";
  }

  return null;
}

/** Label pendek untuk kotak kalender. */
export const PARMALIM_SHORT_LABEL = {
  "Robu":                                  "Robu",
  "Mangan Napaet":                         "Mangan Napaet",
  "Ari Hatutubu ni Tuhan Simarimbulubosi": "Hatutubu",
  "Ari Pameleon Bolon":                    "Pameleon Bolon",
};

export const MONTH_NAMES = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];