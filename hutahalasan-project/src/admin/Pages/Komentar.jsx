// src/pages/Komentar.jsx
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { InteraksiService } from "../services/index.js";
import { truncate } from "../utils/helpers.js";
import "../styles/konten.css";

export const Komentar = () => {
  const { toast } = useOutletContext();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await InteraksiService.getInsightAll({ limit: 50 });
      const rows = (res.data || []).filter((r) => r.total_komentar > 0);
      setList(rows);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Moderasi Komentar</h1>
          <p className="page-subtitle">Daftar konten yang memiliki komentar</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-ghost btn-sm" onClick={fetchList}>
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="konten-table-wrap">
        <table className="shared-table">
          <thead>
            <tr>
              <th>Konten / File</th>
              <th>Tipe</th>
              <th>Total Komentar</th>
              <th>Aktif</th>
              <th>Dihapus</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j}>
                      <div
                        className="dashboard-skeleton"
                        style={{ height: 14, width: "80%" }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">
                    <div className="empty-state-icon">💬</div>
                    <p>Belum ada komentar untuk dimoderasi.</p>
                  </div>
                </td>
              </tr>
            ) : (
              list.map((row) => (
                <tr key={row.target_id}>
                  <td style={{ maxWidth: 280, fontWeight: 600, fontSize: 13 }}>
                    {truncate(row.judul_atau_nama, 60)}
                  </td>
                  <td>
                    <span
                      className={`badge badge-${row.tipe === "konten" ? "berita" : "edukasi"}`}
                      style={{ textTransform: "capitalize" }}
                    >
                      {row.tipe}
                    </span>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {row.total_komentar}
                  </td>
                  <td
                    style={{
                      color: "var(--c-success)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                    }}
                  >
                    {row.komentar_aktif}
                  </td>
                  <td
                    style={{
                      color: "var(--c-danger)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                    }}
                  >
                    {row.komentar_dihapus}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: 20,
          padding: "16px 20px",
          background: "var(--c-surface)",
          border: "1px solid var(--c-border)",
          borderRadius: "var(--r-md)",
          fontSize: 13,
          color: "var(--c-text-muted)",
        }}
      >
        💡 Untuk hapus komentar spesifik, buka halaman <strong>Konten</strong>{" "}
        atau <strong>File Pengetahuan</strong> → klik ikon 👁 → hapus dari
        drawer detail.
      </div>
    </div>
  );
};
