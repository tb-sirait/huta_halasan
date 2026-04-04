import React, { useState, useRef } from "react";
import "./Calendar.css";

// ============================================================
// DATA KALENDER BATAK
// ============================================================

const BATAK_HARI = [
  "Artia",
  "Suma",
  "Anggara",
  "Muda",
  "Boraspati",
  "Singkora",
  "Samisara",
  "Artia Ni Aek",
  "Suma Ni Mangadop",
  "Anggara Sampulu",
  "Muda Ni Mangadop",
  "Boraspati Ni Tangkup",
  "Singkora Purasa",
  "Samisara Purasa",
  "Tula",
  "Suma Ni Holom",
  "Anggara Ni Holom",
  "Muda Ni Holom",
  "Boraspati Ni Holom",
  "Singkora Moraturun",
  "Samisara Moraturun",
  "Artia Ni Angga",
  "Suma Ni Mate",
  "Anggara Ni Begu",
  "Muda Ni Mate",
  "Boraspati Nagok",
  "Singkora Duduk",
  "Samisara Bulan Mate",
  "Hurung",
  "Ringkar",
];

// Panjang bulan Batak (berdasarkan data aktual):
// Sipaha Sada(30), Dua(29), Tolu(30), Opat(29), Lima(30), Onom(29),
// Pitu(30), Ualu(29), Sia(30), Sampulu(30), Li(30), Hurung(30), Lamadu(30)
//
// Lamadu (bulan ke-13) muncul setelah Hurung setiap 3 tahun sekali:
// 2028, 2031, 2034, 2037, 2040, 2043, 2046, 2049, ...
// (ditentukan dari tahun Masehi ketika Lamadu mulai)
//
// Transisi dihitung dari anchor: Sipaha Sada tgl 1 = 19 Maret 2026

const BATAK_MONTH_TRANSITIONS = [
  // --- Awal 2026 (sisa tahun Batak sebelumnya) ---
  { date: new Date(2026, 0, 1), bulan: "Sipaha Sampulu", tanggal: 13 },
  { date: new Date(2026, 0, 19), bulan: "Li", tanggal: 1 },
  { date: new Date(2026, 1, 17), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2026 ---
  { date: new Date(2026, 2, 19), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2026, 3, 18), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2026, 4, 17), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2026, 5, 16), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2026, 6, 15), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2026, 7, 14), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2026, 8, 12), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2026, 9, 12), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2026, 10, 10), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2026, 11, 10), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2027, 0, 9), bulan: "Li", tanggal: 1 },
  { date: new Date(2027, 1, 8), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2027 ---
  { date: new Date(2027, 2, 10), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2027, 3, 9), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2027, 4, 8), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2027, 5, 7), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2027, 6, 6), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2027, 7, 5), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2027, 8, 3), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2027, 9, 3), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2027, 10, 1), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2027, 11, 1), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2027, 11, 31), bulan: "Li", tanggal: 1 },
  { date: new Date(2028, 0, 30), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2028 (Lamadu) ---
  { date: new Date(2028, 1, 29), bulan: "Lamadu", tanggal: 1 },
  { date: new Date(2028, 2, 30), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2028, 3, 29), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2028, 4, 28), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2028, 5, 27), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2028, 6, 26), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2028, 7, 25), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2028, 8, 23), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2028, 9, 23), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2028, 10, 21), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2028, 11, 21), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2029, 0, 20), bulan: "Li", tanggal: 1 },
  { date: new Date(2029, 1, 19), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2029 ---
  { date: new Date(2029, 2, 21), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2029, 3, 20), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2029, 4, 19), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2029, 5, 18), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2029, 6, 17), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2029, 7, 16), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2029, 8, 14), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2029, 9, 14), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2029, 10, 12), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2029, 11, 12), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2030, 0, 11), bulan: "Li", tanggal: 1 },
  { date: new Date(2030, 1, 10), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2030 ---
  { date: new Date(2030, 2, 12), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2030, 3, 11), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2030, 4, 10), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2030, 5, 9), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2030, 6, 8), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2030, 7, 7), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2030, 8, 5), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2030, 9, 5), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2030, 10, 3), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2030, 11, 3), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2031, 0, 2), bulan: "Li", tanggal: 1 },
  { date: new Date(2031, 1, 1), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2031 (Lamadu) ---
  { date: new Date(2031, 2, 3), bulan: "Lamadu", tanggal: 1 },
  { date: new Date(2031, 3, 2), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2031, 4, 2), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2031, 4, 31), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2031, 5, 30), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2031, 6, 29), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2031, 7, 28), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2031, 8, 26), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2031, 9, 26), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2031, 10, 24), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2031, 11, 24), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2032, 0, 23), bulan: "Li", tanggal: 1 },
  { date: new Date(2032, 1, 22), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2032 ---
  { date: new Date(2032, 2, 23), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2032, 3, 22), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2032, 4, 21), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2032, 5, 20), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2032, 6, 19), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2032, 7, 18), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2032, 8, 16), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2032, 9, 16), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2032, 10, 14), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2032, 11, 14), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2033, 0, 13), bulan: "Li", tanggal: 1 },
  { date: new Date(2033, 1, 12), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2033 ---
  { date: new Date(2033, 2, 14), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2033, 3, 13), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2033, 4, 12), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2033, 5, 11), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2033, 6, 10), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2033, 7, 9), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2033, 8, 7), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2033, 9, 7), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2033, 10, 5), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2033, 11, 5), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2034, 0, 4), bulan: "Li", tanggal: 1 },
  { date: new Date(2034, 1, 3), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2034 (Lamadu) ---
  { date: new Date(2034, 2, 5), bulan: "Lamadu", tanggal: 1 },
  { date: new Date(2034, 3, 4), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2034, 4, 4), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2034, 5, 2), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2034, 6, 2), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2034, 6, 31), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2034, 7, 30), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2034, 8, 28), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2034, 9, 28), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2034, 10, 26), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2034, 11, 26), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2035, 0, 25), bulan: "Li", tanggal: 1 },
  { date: new Date(2035, 1, 24), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2035 ---
  { date: new Date(2035, 2, 26), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2035, 3, 25), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2035, 4, 24), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2035, 5, 23), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2035, 6, 22), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2035, 7, 21), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2035, 8, 19), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2035, 9, 19), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2035, 10, 17), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2035, 11, 17), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2036, 0, 16), bulan: "Li", tanggal: 1 },
  { date: new Date(2036, 1, 15), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2036 ---
  { date: new Date(2036, 2, 16), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2036, 3, 15), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2036, 4, 14), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2036, 5, 13), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2036, 6, 12), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2036, 7, 11), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2036, 8, 9), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2036, 9, 9), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2036, 10, 7), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2036, 11, 7), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2037, 0, 6), bulan: "Li", tanggal: 1 },
  { date: new Date(2037, 1, 5), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2037 (Lamadu) ---
  { date: new Date(2037, 2, 7), bulan: "Lamadu", tanggal: 1 },
  { date: new Date(2037, 3, 6), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2037, 4, 6), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2037, 5, 4), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2037, 6, 4), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2037, 7, 2), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2037, 8, 1), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2037, 8, 30), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2037, 9, 30), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2037, 10, 28), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2037, 11, 28), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2038, 0, 27), bulan: "Li", tanggal: 1 },
  { date: new Date(2038, 1, 26), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2038 ---
  { date: new Date(2038, 2, 28), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2038, 3, 27), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2038, 4, 26), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2038, 5, 25), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2038, 6, 24), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2038, 7, 23), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2038, 8, 21), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2038, 9, 21), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2038, 10, 19), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2038, 11, 19), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2039, 0, 18), bulan: "Li", tanggal: 1 },
  { date: new Date(2039, 1, 17), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2039 ---
  { date: new Date(2039, 2, 19), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2039, 3, 18), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2039, 4, 17), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2039, 5, 16), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2039, 6, 15), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2039, 7, 14), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2039, 8, 12), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2039, 9, 12), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2039, 10, 10), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2039, 11, 10), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2040, 0, 9), bulan: "Li", tanggal: 1 },
  { date: new Date(2040, 1, 8), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2040 (Lamadu) ---
  { date: new Date(2040, 2, 9), bulan: "Lamadu", tanggal: 1 },
  { date: new Date(2040, 3, 8), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2040, 4, 8), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2040, 5, 6), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2040, 6, 6), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2040, 7, 4), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2040, 8, 3), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2040, 9, 2), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2040, 10, 1), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2040, 10, 30), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2040, 11, 30), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2041, 0, 29), bulan: "Li", tanggal: 1 },
  { date: new Date(2041, 1, 28), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2041 ---
  { date: new Date(2041, 2, 30), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2041, 3, 29), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2041, 4, 28), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2041, 5, 27), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2041, 6, 26), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2041, 7, 25), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2041, 8, 23), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2041, 9, 23), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2041, 10, 21), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2041, 11, 21), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2042, 0, 20), bulan: "Li", tanggal: 1 },
  { date: new Date(2042, 1, 19), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2042 ---
  { date: new Date(2042, 2, 21), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2042, 3, 20), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2042, 4, 19), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2042, 5, 18), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2042, 6, 17), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2042, 7, 16), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2042, 8, 14), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2042, 9, 14), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2042, 10, 12), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2042, 11, 12), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2043, 0, 11), bulan: "Li", tanggal: 1 },
  { date: new Date(2043, 1, 10), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2043 (Lamadu) ---
  { date: new Date(2043, 2, 12), bulan: "Lamadu", tanggal: 1 },
  { date: new Date(2043, 3, 11), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2043, 4, 11), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2043, 5, 9), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2043, 6, 9), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2043, 7, 7), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2043, 8, 6), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2043, 9, 5), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2043, 10, 4), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2043, 11, 3), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2044, 0, 2), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2044, 1, 1), bulan: "Li", tanggal: 1 },
  { date: new Date(2044, 2, 2), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2044 ---
  { date: new Date(2044, 3, 1), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2044, 4, 1), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2044, 4, 30), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2044, 5, 29), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2044, 6, 28), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2044, 7, 27), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2044, 8, 25), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2044, 9, 25), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2044, 10, 23), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2044, 11, 23), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2045, 0, 22), bulan: "Li", tanggal: 1 },
  { date: new Date(2045, 1, 21), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2045 ---
  { date: new Date(2045, 2, 23), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2045, 3, 22), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2045, 4, 21), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2045, 5, 20), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2045, 6, 19), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2045, 7, 18), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2045, 8, 16), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2045, 9, 16), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2045, 10, 14), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2045, 11, 14), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2046, 0, 13), bulan: "Li", tanggal: 1 },
  { date: new Date(2046, 1, 12), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2046 (Lamadu) ---
  { date: new Date(2046, 2, 14), bulan: "Lamadu", tanggal: 1 },
  { date: new Date(2046, 3, 13), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2046, 4, 13), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2046, 5, 11), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2046, 6, 11), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2046, 7, 9), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2046, 8, 8), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2046, 9, 7), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2046, 10, 6), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2046, 11, 5), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2047, 0, 4), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2047, 1, 3), bulan: "Li", tanggal: 1 },
  { date: new Date(2047, 2, 5), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2047 ---
  { date: new Date(2047, 3, 4), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2047, 4, 4), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2047, 5, 2), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2047, 6, 2), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2047, 6, 31), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2047, 7, 30), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2047, 8, 28), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2047, 9, 28), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2047, 10, 26), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2047, 11, 26), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2048, 0, 25), bulan: "Li", tanggal: 1 },
  { date: new Date(2048, 1, 24), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2048 ---
  { date: new Date(2048, 2, 25), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2048, 3, 24), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2048, 4, 23), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2048, 5, 22), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2048, 6, 21), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2048, 7, 20), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2048, 8, 18), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2048, 9, 18), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2048, 10, 16), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2048, 11, 16), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2049, 0, 15), bulan: "Li", tanggal: 1 },
  { date: new Date(2049, 1, 14), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2049 (Lamadu) ---
  { date: new Date(2049, 2, 16), bulan: "Lamadu", tanggal: 1 },
  { date: new Date(2049, 3, 15), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2049, 4, 15), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2049, 5, 13), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2049, 6, 13), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2049, 7, 11), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2049, 8, 10), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2049, 9, 9), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2049, 10, 8), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2049, 11, 7), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2050, 0, 6), bulan: "Sipaha Sampulu", tanggal: 1 },
  { date: new Date(2050, 1, 5), bulan: "Li", tanggal: 1 },
  { date: new Date(2050, 2, 7), bulan: "Hurung", tanggal: 1 },
  // --- Tahun Batak 2050 ---
  { date: new Date(2050, 3, 6), bulan: "Sipaha Sada", tanggal: 1 },
  { date: new Date(2050, 4, 6), bulan: "Sipaha Dua", tanggal: 1 },
  { date: new Date(2050, 5, 4), bulan: "Sipaha Tolu", tanggal: 1 },
  { date: new Date(2050, 6, 4), bulan: "Sipaha Opat", tanggal: 1 },
  { date: new Date(2050, 7, 2), bulan: "Sipaha Lima", tanggal: 1 },
  { date: new Date(2050, 8, 1), bulan: "Sipaha Onom", tanggal: 1 },
  { date: new Date(2050, 8, 30), bulan: "Sipaha Pitu", tanggal: 1 },
  { date: new Date(2050, 9, 30), bulan: "Sipaha Ualu", tanggal: 1 },
  { date: new Date(2050, 10, 28), bulan: "Sipaha Sia", tanggal: 1 },
  { date: new Date(2050, 11, 28), bulan: "Sipaha Sampulu", tanggal: 1 },
  // Sentinel untuk akhir 2050
  { date: new Date(2051, 0, 27), bulan: "Hurung", tanggal: 1 },
].sort((a, b) => a.date - b.date);

/**
 * Menghitung info kalender Batak untuk tanggal Masehi tertentu.
 * Nama hari Batak SELALU sinkron dengan tanggal Batak:
 *   tanggal 1 → Artia, tanggal 2 → Suma, ..., tanggal 30 → Ringkar
 */
function getBatakInfo(date) {
  let lastEntry = BATAK_MONTH_TRANSITIONS[0];
  for (const t of BATAK_MONTH_TRANSITIONS) {
    if (date >= t.date) lastEntry = t;
  }

  const tanggal =
    lastEntry.tanggal + Math.round((date - lastEntry.date) / 86400000);

  // Nama hari langsung dari tanggal Batak (1-indexed → 0-indexed array)
  const hariIdx = (tanggal - 1) % 30;

  return {
    hari: BATAK_HARI[hariIdx],
    tanggal,
    bulan: lastEntry.bulan,
  };
}

/** Mendapatkan daftar bulan Batak unik dalam satu bulan Masehi. */
function getBatakMonthsInView(year, month) {
  const months = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const { bulan } = getBatakInfo(new Date(year, month, d));
    if (!months.includes(bulan)) months.push(bulan);
  }
  return months;
}

// ============================================================
// HARI PENTING PARMALIM
// ============================================================

/** Apakah tahun Masehi ini adalah tahun Lamadu Batak? */
function isTahunLamadu(masehiYear) {
  return (masehiYear - 2025) % 3 === 0;
}

/**
 * Mengembalikan nama lengkap hari penting Parmalim, atau null jika tidak ada.
 */
function getParmalimEvent(date) {
  const { tanggal, bulan } = getBatakInfo(date);
  const tahun = date.getFullYear();

  // Mangan Napaet: tanggal 29 & 30 di bulan Lamadu (tahun Lamadu) atau Hurung (bukan Lamadu)
  const bulanManganNapaet = isTahunLamadu(tahun) ? "Lamadu" : "Hurung";
  if (bulan === bulanManganNapaet && (tanggal === 29 || tanggal === 30)) {
    return "Mangan Napaet";
  }

  // Robu — tanggal 1 Sipaha Sada
  if (bulan === "Sipaha Sada" && tanggal === 1) return "Robu";

  // Ari Hatutubu ni Tuhan Simarimbulubosi — tanggal 2 & 3 Sipaha Sada
  if (bulan === "Sipaha Sada" && (tanggal === 2 || tanggal === 3)) {
    return "Ari Hatutubu ni Tuhan Simarimbulubosi";
  }

  // Ari Pameleon Bolon — tanggal 12–14 Sipaha Lima
  if (bulan === "Sipaha Lima" && tanggal >= 12 && tanggal <= 14) {
    return "Ari Pameleon Bolon";
  }

  return null;
}

/** Label pendek untuk kotak kalender. */
const PARMALIM_SHORT_LABEL = {
  Robu: "Robu",
  "Mangan Napaet": "Mangan Napaet",
  "Ari Hatutubu ni Tuhan Simarimbulubosi": "Hatutubu",
  "Ari Pameleon Bolon": "Pameleon Bolon",
};

// ============================================================
// DATA HARI PENTING NASIONAL
// ============================================================

const importantDates = {
  0: { 1: "Tahun Baru", 29: "Imlek" },
  1: { 14: "Isra Miraj" },
  2: { 22: "Nyepi", 29: "Wafat Isa Almasih" },
  3: {
    1: "Idul Fitri",
    2: "Cuti Bersama",
    3: "Cuti Bersama",
    4: "Cuti Bersama",
  },
  4: { 1: "Hari Buruh", 29: "Kenaikan Isa Almasih" },
  5: { 1: "Hari Lahir Pancasila", 12: "Waisak" },
  6: { 7: "Idul Adha" },
  7: { 17: "Hari Kemerdekaan RI", 28: "Tahun Baru Islam" },
  8: { 5: "Maulid Nabi Muhammad" },
  9: {},
  10: {},
  11: { 25: "Natal" },
};

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// ============================================================
// KOMPONEN KALENDER
// ============================================================

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });
  const tooltipRef = useRef(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const batakMonths = getBatakMonthsInView(year, month);
  const currentEvents = importantDates[month] || {};

  const changeMonth = (offset) =>
    setCurrentDate(new Date(year, month + offset, 1));

  const handleMouseEnter = (e, day) => {
    const date = new Date(year, month, day);
    const batak = getBatakInfo(date);
    const parmalim = getParmalimEvent(date);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      data: { day, batak, national: currentEvents[day] || null, parmalim },
    });
  };

  const handleMouseLeave = () => setTooltip({ visible: false });

  // Kumpulkan hari Parmalim di bulan ini untuk footer
  const parmalimThisMonth = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const parmalim = getParmalimEvent(date);
    if (parmalim)
      parmalimThisMonth.push({ d, parmalim, batak: getBatakInfo(date) });
  }

  const hasNational = Object.keys(currentEvents).length > 0;
  const hasAny = hasNational || parmalimThisMonth.length > 0;

  // ---- Build grid cells ----
  const calendarCells = [];

  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(
      <div key={`empty-${i}`} className="calendar-day empty" />,
    );
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    const batak = getBatakInfo(date);
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === d;
    const hasNatl = !!currentEvents[d];
    const parmalim = getParmalimEvent(date);
    const shortLabel = parmalim ? PARMALIM_SHORT_LABEL[parmalim] : null;
    const bothDots = parmalim && hasNatl;

    const classNames = [
      "calendar-day",
      isToday ? "today" : "",
      dow === 0 ? "sunday" : "",
      dow === 6 ? "saturday" : "",
      parmalim ? "parmalim" : "",
    ]
      .filter(Boolean)
      .join(" ");

    calendarCells.push(
      <div
        key={d}
        className={classNames}
        onMouseEnter={(e) => handleMouseEnter(e, d)}
        onMouseLeave={handleMouseLeave}
      >
        {(parmalim || hasNatl) && (
          <div className="day-dots">
            {parmalim && <span className="dot parmalim-dot" title={parmalim} />}
            {hasNatl && (
              <span
                className={`dot national-dot${bothDots ? " nudge" : ""}`}
                title={currentEvents[d]}
              />
            )}
          </div>
        )}

        <span className="day-masehi-num">{d}</span>
        <span className="day-batak-tanggal">{batak.tanggal}</span>
        <span className="day-batak-hari">{batak.hari}</span>

        {shortLabel && <span className="day-parmalim-label">{shortLabel}</span>}
      </div>,
    );
  }

  return (
    <div className="calendar-container">
      {/* ---- Header navigasi ---- */}
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>
          ←
        </button>
        <div className="calendar-title-block">
          <h2 className="calendar-month-title">
            {MONTH_NAMES[month]} {year}
          </h2>
          <p className="calendar-batak-sub">
            {batakMonths.map((bm, i) => (
              <span key={bm}>
                {i > 0 && " · "}
                <span
                  className={
                    bm === "Lamadu" ? "calendar-lamadu-badge" : undefined
                  }
                >
                  {bm}
                </span>
              </span>
            ))}
          </p>
        </div>
        <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>
          →
        </button>
      </div>

      {/* ---- Header nama hari ---- */}
      <div className="calendar-weekdays">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={[
              "calendar-weekday-header",
              i === 0 ? "sunday" : "",
              i === 6 ? "saturday" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ---- Grid kalender ---- */}
      <div className="calendar-grid">{calendarCells}</div>

      {/* ---- Legenda ---- */}
      <div className="calendar-legend">
        <div className="calendar-legend-item">
          <span className="legend-swatch red" />
          <span className="legend-text">Tanggal Batak</span>
        </div>
        <div className="calendar-legend-item">
          <span className="legend-dot national-legend-dot" />
          <span className="legend-text">Hari penting nasional</span>
        </div>
        <div className="calendar-legend-item">
          <span className="legend-dot parmalim-legend-dot" />
          <span className="legend-text">Hari penting Parmalim</span>
        </div>
        <div className="calendar-legend-item">
          <span className="legend-swatch green" />
          <span className="legend-text">Hari Parmalim (kotak)</span>
        </div>
      </div>

      {/* ---- Footer hari penting ---- */}
      <div className="calendar-footer">
        <h3 className="calendar-footer-title">Hari Penting Bulan Ini</h3>

        {!hasAny && (
          <p className="calendar-no-events">Tidak ada hari penting bulan ini</p>
        )}

        {parmalimThisMonth.length > 0 && (
          <div className="footer-section">
            <p className="footer-section-label parmalim-section-label">
              <span className="footer-section-dot parmalim-section-dot" />
              Parmalim
            </p>
            <ul className="calendar-events-list">
              {parmalimThisMonth.map(({ d, parmalim, batak }) => (
                <li key={`p-${d}`} className="calendar-event-item">
                  <span className="event-date parmalim-event-date">
                    {d} {MONTH_NAMES[month]}
                  </span>
                  <span className="event-name parmalim-event-name">
                    {parmalim}
                  </span>
                  <span className="event-batak-info">
                    {batak.hari} · {batak.bulan}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasNational && (
          <div className="footer-section">
            <p className="footer-section-label national-section-label">
              <span className="footer-section-dot national-section-dot" />
              Nasional
            </p>
            <ul className="calendar-events-list">
              {Object.keys(currentEvents)
                .sort((a, b) => a - b)
                .map((d) => {
                  const batak = getBatakInfo(
                    new Date(year, month, parseInt(d)),
                  );
                  return (
                    <li key={d} className="calendar-event-item">
                      <span className="event-date">
                        {d} {MONTH_NAMES[month]}
                      </span>
                      <span className="event-name">{currentEvents[d]}</span>
                      <span className="event-batak-info">
                        {batak.hari} · {batak.bulan}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>

      {/* ---- Tooltip ---- */}
      {tooltip.visible && tooltip.data && (
        <div
          ref={tooltipRef}
          className="calendar-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="tooltip-bulan">{tooltip.data.batak.bulan}</div>
          <div className="tooltip-line">
            Tanggal Batak: {tooltip.data.batak.tanggal}
          </div>
          <div className="tooltip-line">{tooltip.data.batak.hari}</div>
          {tooltip.data.parmalim && (
            <div className="tooltip-parmalim">● {tooltip.data.parmalim}</div>
          )}
          {tooltip.data.national && (
            <div className="tooltip-national">● {tooltip.data.national}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
