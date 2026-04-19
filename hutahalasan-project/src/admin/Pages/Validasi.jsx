// src/pages/Validasi.jsx
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { KontenService, PengetahuanService } from "../services/index.js";
import { formatDate, truncate } from "../utils/helpers.js";
import "../styles/konten.css";

export const Validasi = () => {
  const { toast } = useOutletContext();
  const [tab, setTab] = useState("konten");
  const [listKonten, setListKonten] = useState([]);
  const [listPenget, setListPenget] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [k, p] = await Promise.all([
        KontenService.getAll({ status_validasi: "belum", limit: 50 }),
        PengetahuanService.getAll({ status_validasi: "belum", limit: 50 }),
      ]);
      setListKonten(k.data || []);
      setListPenget(p.data || []);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleValidasiKonten = async (id, current) => {
    const next = current === "sudah" ? "belum" : "sudah";
    try {
      await KontenService.updateValidasi(id, next);
      toast.success("Status validasi diperbarui.");
      fetchAll();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleValidasiPenget = async (id, current) => {
    const next = current === "sudah" ? "belum" : "sudah";
    try {
      await PengetahuanService.updateValidasi(id, next);
      toast.success("Status validasi diperbarui.");
      fetchAll();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const currentList = tab === "konten" ? listKonten : listPenget;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Antrian Validasi</h1>
          <p className="page-subtitle">
            {listKonten.length + listPenget.length} item menunggu validasi
          </p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-ghost btn-sm" onClick={fetchAll}>
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="dashboard-filter-tabs" style={{ marginBottom: 20 }}>
        <button
          className={`dashboard-filter-tab${tab === "konten" ? " active" : ""}`}
          onClick={() => setTab("konten")}
        >
          Konten ({listKonten.length})
        </button>
        <button
          className={`dashboard-filter-tab${tab === "pengetahuan" ? " active" : ""}`}
          onClick={() => setTab("pengetahuan")}
        >
          File Pengetahuan ({listPenget.length})
        </button>
      </div>

      <div className="konten-table-wrap">
        <table className="shared-table">
          <thead>
            <tr>
              <th>{tab === "konten" ? "Judul" : "Nama File"}</th>
              {tab === "konten" && <th>Jenis</th>}
              <th>Penulis / Uploader</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
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
            ) : currentList.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">
                    <div className="empty-state-icon">✓</div>
                    <p>
                      Semua {tab === "konten" ? "konten" : "file"} sudah
                      tervalidasi.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentList.map((item) => (
                <tr key={item.id_konten || item.id_file}>
                  <td style={{ fontWeight: 600, fontSize: 13, maxWidth: 280 }}>
                    {truncate(item.judul || item.nama_file, 60)}
                  </td>
                  {tab === "konten" && (
                    <td>
                      <span
                        className={`badge badge-${item.jenis_konten?.toLowerCase()}`}
                      >
                        {item.jenis_konten}
                      </span>
                    </td>
                  )}
                  <td style={{ fontSize: 13, color: "var(--c-text-muted)" }}>
                    {item.penulis || item.nama_uploader || "—"}
                  </td>
                  <td
                    style={{
                      fontSize: 12,
                      color: "var(--c-text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(item.tanggal_dibuat || item.tanggal_upload)}
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        tab === "konten"
                          ? handleValidasiKonten(
                              item.id_konten,
                              item.status_validasi,
                            )
                          : handleValidasiPenget(
                              item.id_file,
                              item.status_validasi,
                            )
                      }
                    >
                      ✓ Validasi
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


