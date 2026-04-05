import React, { useState, useRef } from "react";
import "./Calendar.css";
import {
  BATAK_HARI,
  BATAK_MONTH_TRANSITIONS,
  MONTH_NAMES,
  PARMALIM_SHORT_LABEL,
  getBatakInfo,
  getBatakMonthsInView,
  getParmalimEvent,
} from "./batakCalendarCore";

// ============================================================
// DATA HARI PENTING NASIONAL 2026
// (per index bulan Masehi, 0=Jan)
// ============================================================

const importantDates = {
  0: { 1: "Tahun Baru Masehi" },
  1: {},
  2: {},
  3: {},
  4: { 1: "Hari Buruh" },
  5: { 1: "Hari Lahir Pancasila" },
  6: {},
  7: { 17: "Hari Kemerdekaan RI" },
  8: {},
  9: {},
  10: {},
  11: { 25: "Natal" },
};

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

  // ── Build grid cells ────────────────────────────────────────────────────
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
        {/* Dots: Parmalim (hijau) kiri, Nasional (merah) kanan */}
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
      {/* ── Header navigasi ── */}
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

      {/* ── Header nama hari ── */}
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

      {/* ── Grid kalender ── */}
      <div className="calendar-grid">{calendarCells}</div>

      {/* ── Legenda ── */}
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
          <span className="legend-text">Kotak Parmalim</span>
        </div>
      </div>

      {/* ── Footer hari penting ── */}
      <div className="calendar-footer">
        <h3 className="calendar-footer-title">Hari Penting Bulan Ini</h3>

        {!hasAny && (
          <p className="calendar-no-events">Tidak ada hari penting bulan ini</p>
        )}

        {/* Parmalim — prioritas pertama */}
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

        {/* Nasional */}
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

      {/* ── Tooltip ── */}
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
