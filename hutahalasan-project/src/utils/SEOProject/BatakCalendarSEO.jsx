/**
 * BatakCalendarSEO.jsx
 *
 * Komponen SEO untuk Kalender Batak Parmalim.
 * Cara pakai — letakkan di dalam <section className="calendar-section">:
 *
 *   <section className="calendar-section">
 *     <BatakCalendarSEO year={2026} month={4} />   ← taruh SEBELUM <Calendar />
 *     <h2 className="calendar-title">Calendar</h2>
 *     <Calendar />
 *   </section>
 *
 * Props:
 *   year  — tahun Masehi yang sedang ditampilkan (number)
 *   month — bulan Masehi 1–12 (number)
 */

import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  BATAK_HARI,
  MONTH_NAMES,
  getBatakInfo,
  getParmalimEvent,
  getBulanTerakhir,
  getPanjangBulanTerakhir,
  getManganNapaetTanggal,
  isTahunLamadu,
} from "../batakCalendarCore";

// ============================================================
// KOMPONEN UTAMA
// ============================================================

export default function BatakCalendarSEO({ year, month }) {
  // month: 1–12
  const monthIdx = month - 1;
  const monthLabel = MONTH_NAMES[monthIdx];

  // ── Hitung semua hari dalam bulan ──────────────────────────────────────
  const days = useMemo(() => {
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, monthIdx, i + 1);
      const batak = getBatakInfo(d);
      const parmalim = getParmalimEvent(d);
      return {
        day: i + 1,
        date: d,
        hari: batak.hari,
        tanggal: batak.tanggal,
        bulan: batak.bulan,
        parmalim,
      };
    });
  }, [year, monthIdx]);

  const parmalimDays = days.filter((d) => d.parmalim);
  const bulanBatakList = [...new Set(days.map((d) => d.bulan))].join(" · ");

  // ── Metadata tahun Lamadu & Mangan Napaet ─────────────────────────────
  const bulanTerakhir = getBulanTerakhir(year);
  const panjangBulanTerakhir = getPanjangBulanTerakhir(year);
  const [mn1, mn2] = getManganNapaetTanggal(year);
  const isTahunLamaduFlag = isTahunLamadu(year);

  // ── JSON-LD: EventSeries (hari penting Parmalim) ───────────────────────
  const jsonLdEvents = parmalimDays.map((d) => ({
    "@type": "Event",
    name: d.parmalim,
    description: `${d.parmalim} — hari ${d.hari}, tanggal ${d.tanggal} bulan ${d.bulan} dalam Kalender Batak Parmalim`,
    startDate: d.date.toISOString().split("T")[0],
    endDate: d.date.toISOString().split("T")[0],
    organizer: {
      "@type": "Organization",
      name: "Parmalim Bale Pasogit Huta Halasan",
      url: "https://hutahalasan.com",
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  }));

  // ── JSON-LD: Dataset ───────────────────────────────────────────────────
  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Kalender Batak Parmalim — ${monthLabel} ${year}`,
    description: [
      `Data konversi tanggal Masehi ke Kalender Batak Parmalim untuk bulan ${monthLabel} ${year}.`,
      `Mencakup bulan Batak: ${bulanBatakList}.`,
      `Tahun ${year} ${isTahunLamaduFlag ? "adalah tahun Lamadu (bulan ke-13 Lamadu hadir setelah Hurung)." : "bukan tahun Lamadu."}`,
      `Bulan terakhir tahun Batak ${year}: ${bulanTerakhir} (${panjangBulanTerakhir} hari).`,
      `Mangan Napaet ${year} jatuh pada tanggal ${mn1} & ${mn2} bulan ${bulanTerakhir}.`,
    ].join(" "),
    url: `https://hutahalasan.com/kalender/${year}/${month}`,
    creator: {
      "@type": "Organization",
      name: "Parmalim Bale Pasogit Huta Halasan",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    inLanguage: ["id", "bbc"],
    keywords: [
      "Kalender Batak",
      "Batak calendar",
      "Parmalim",
      "Hari Batak",
      "Sipaha Sada",
      "Hurung",
      "Lamadu",
      "Sipaha Lima",
      "konversi kalender",
      "Mangan Napaet",
      "Robu",
      "Ari Pameleon Bolon",
      "Ari Hatutubu ni Tuhan Simarimbulubosi",
      ...BATAK_HARI.slice(0, 7),
    ],
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "Kalender Batak Parmalim 2025–2030",
    },
  };

  // ── JSON-LD: Halaman utama ─────────────────────────────────────────────
  const jsonLdPage = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `Kalender Batak ${monthLabel} ${year} | Parmalim Huta Halasan`,
        description: `Kalender Batak bulan ${monthLabel} ${year} lengkap: nama hari Batak, tanggal Batak, bulan Batak, dan hari penting Parmalim.`,
        url: `https://hutahalasan.com/kalender/${year}/${month}`,
        inLanguage: "id",
        about: {
          "@type": "Thing",
          name: "Kalender Batak",
          description:
            "Sistem penanggalan tradisional suku Batak yang digunakan dalam kepercayaan Parmalim. Terdiri dari 12 bulan (atau 13 bulan di tahun Lamadu: 2025, 2028, 2031, …).",
        },
        publisher: {
          "@type": "Organization",
          name: "Parmalim Bale Pasogit Huta Halasan",
          url: "https://hutahalasan.com",
        },
      },
      jsonLdDataset,
      ...(jsonLdEvents.length
        ? [
            {
              "@context": "https://schema.org",
              "@type": "EventSeries",
              name: `Hari Penting Parmalim — ${monthLabel} ${year}`,
              subEvent: jsonLdEvents,
            },
          ]
        : []),
    ],
  };

  // ── Meta tags ──────────────────────────────────────────────────────────
  const metaDesc = `Kalender Batak ${monthLabel} ${year} — mencakup bulan ${bulanBatakList}. Lihat nama hari Batak, tanggal Batak, dan hari penting Parmalim setiap harinya.`;
  const metaKeywords = [
    `Kalender Batak ${year}`,
    `Hari Batak ${monthLabel} ${year}`,
    bulanBatakList,
    ...BATAK_HARI,
    "Parmalim",
    "Sipaha Sada",
    "konversi tanggal Batak",
    "Batak calendar converter",
    "Mangan Napaet",
    "Robu",
    "Ari Pameleon Bolon",
    "Ari Hatutubu ni Tuhan Simarimbulubosi",
  ].join(", ");

  return (
    <>
      {/* ── Helmet: <head> tags ──────────────────────────────────────────── */}
      <Helmet>
        <title>{`Kalender Batak ${monthLabel} ${year} | Parmalim Huta Halasan`}</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={metaKeywords} />
        <link
          rel="canonical"
          href={`https://hutahalasan.com/kalender/${year}/${month}`}
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Kalender Batak ${monthLabel} ${year}`}
        />
        <meta property="og:description" content={metaDesc} />
        <meta
          property="og:url"
          content={`https://hutahalasan.com/kalender/${year}/${month}`}
        />
        <meta
          property="og:site_name"
          content="Parmalim Bale Pasogit Huta Halasan"
        />

        <script type="application/ld+json">
          {JSON.stringify(jsonLdPage, null, 0)}
        </script>
      </Helmet>

      {/* ── Semantic HTML: tersembunyi visual, terbaca crawler & screen reader ── */}
      <div
        aria-label={`Data Kalender Batak ${monthLabel} ${year}`}
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
        }}
      >
        <h1>
          Kalender Batak {monthLabel} {year}
        </h1>
        <p>
          Bulan Masehi {monthLabel} {year} bertepatan dengan bulan Batak:{" "}
          {bulanBatakList}. Kalender ini digunakan dalam kepercayaan Parmalim
          Bale Pasogit Huta Halasan.
        </p>
        <p>
          Tahun {year}{" "}
          {isTahunLamaduFlag
            ? `adalah tahun Lamadu — bulan Lamadu hadir sebagai bulan ke-13 setelah bulan Hurung.`
            : `bukan tahun Lamadu — kalender Batak terdiri dari 12 bulan.`}{" "}
          Bulan terakhir tahun ini ({bulanTerakhir}) memiliki{" "}
          {panjangBulanTerakhir} hari. Mangan Napaet jatuh pada tanggal {mn1}{" "}
          dan {mn2} bulan {bulanTerakhir}.
        </p>

        {/* Tabel konversi lengkap */}
        <table
          summary={`Konversi tanggal Masehi ke Kalender Batak — ${monthLabel} ${year}`}
        >
          <caption>
            Konversi Kalender Masehi ke Kalender Batak — {monthLabel} {year}
          </caption>
          <thead>
            <tr>
              <th scope="col">Tanggal Masehi</th>
              <th scope="col">Hari Batak</th>
              <th scope="col">Tanggal Batak</th>
              <th scope="col">Bulan Batak</th>
              <th scope="col">Hari Penting Parmalim</th>
            </tr>
          </thead>
          <tbody>
            {days.map(({ day, date, hari, tanggal, bulan, parmalim }) => (
              <tr key={day}>
                <td>
                  <time dateTime={date.toISOString().split("T")[0]}>
                    {day} {monthLabel} {year}
                  </time>
                </td>
                <td>{hari}</td>
                <td>{tanggal}</td>
                <td>{bulan}</td>
                <td>{parmalim || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 30 nama hari Batak */}
        <section aria-label="Daftar nama hari Kalender Batak">
          <h2>30 Nama Hari dalam Kalender Batak</h2>
          <ol>
            {BATAK_HARI.map((h, i) => (
              <li key={h}>
                <strong>Tanggal {i + 1}:</strong> {h}
              </li>
            ))}
          </ol>
        </section>

        {/* Penjelasan Mangan Napaet tahun ini */}
        <section aria-label="Aturan Mangan Napaet tahun ini">
          <h2>Mangan Napaet {year}</h2>
          <p>
            Pada tahun {year}, bulan terakhir kalender Batak adalah{" "}
            <strong>{bulanTerakhir}</strong> dengan panjang{" "}
            <strong>{panjangBulanTerakhir} hari</strong>. Oleh karena itu,
            Mangan Napaet jatuh pada tanggal <strong>{mn1}</strong> dan{" "}
            <strong>{mn2}</strong> bulan {bulanTerakhir}.
          </p>
        </section>

        {/* Hari penting Parmalim bulan ini */}
        {parmalimDays.length > 0 && (
          <section aria-label="Hari penting Parmalim bulan ini">
            <h2>
              Hari Penting Parmalim {monthLabel} {year}
            </h2>
            <ul>
              {parmalimDays.map(
                ({ day, date, hari, tanggal, bulan, parmalim }) => (
                  <li key={day}>
                    <time dateTime={date.toISOString().split("T")[0]}>
                      {day} {monthLabel} {year}
                    </time>
                    {" — "}
                    <strong>{parmalim}</strong>
                    {` (hari ${hari}, tanggal ${tanggal} ${bulan})`}
                  </li>
                ),
              )}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
