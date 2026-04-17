// src/utils/helpers.js

// Ambil 2 inisial dari nama
export const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

// Format tanggal Indonesia
export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Format angka singkat
export const formatNumber = (n = 0) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "Jt";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "Rb";
  return String(n);
};

// Warna badge status validasi
export const statusColor = (status) =>
  status === "sudah" ? "green" : "orange";

// Warna badge subrole
export const subroleColor = (subrole) =>
  ({
    Pengembang: "#6366f1",
    Manajer: "#0ea5e9",
    Validator: "#10b981",
    Jurnalis: "#f59e0b",
    User: "#6b7280",
  })[subrole] || "#6b7280";

// Potong teks panjang
export const truncate = (text = "", max = 80) =>
  text.length > max ? text.slice(0, max) + "…" : text;
