// pages/smartschool/profil/peminjaman/[barangId].js

import LayoutDetail from "components/Layout/LayoutDetail";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import { useRouter } from "next/router";
import ModalPengembalian from "components/Profil/ModalPengembalian";
import { useEffect, useState } from "react";

const PeminjamanDetailPage = () => {
  const router = useRouter();
  const { barangId } = router.query;

  const [barang, setBarang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPengembalian, setShowPengembalian] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("ss-token")?.replaceAll('"', "");
      try {
        const res = await fetch(`http://127.0.0.1:3333/peminjaman/${barangId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Gagal fetch, status:", res.status);
          return;
        }

        const data = await res.json();
        setBarang(data);
      } catch (err) {
        console.error("Gagal fetch detail peminjaman:", err);
      } finally {
        setLoading(false);
      }
    };

    if (barangId) fetchData();
  }, [barangId]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!barang) return <p className="text-center mt-5">Barang tidak ditemukan</p>;

  return (
    <LayoutDetail title="Detail Peminjaman">
      <AnimatePage>
        <section className="banner-barang position-absolute" />
        <div className="row d-flex justify-content-center pt-4">
          <div className="col-md-8">
            <button
              onClick={() => router.back()}
              className="text-decoration-none fw-bolder position-relative text-white bg-transparent border-0 mb-3"
              style={{ cursor: "pointer" }}
            >
              ← <span className="ms-2">Kembali</span>
            </button>

            <div className="card card-ss p-4 pb-5 mt-2 mb-4" style={{ borderRadius: "12px" }}>
              <h4 className="fw-bold mb-4" style={{ color: "#3A4166" }}>
                Detail Peminjaman Barang
              </h4>

              <div className="rounded-ss p-4 mb-4" style={{ background: "#F4F4F7" }}>
                <div className="row text-center mb-5">
                  <div className="col-md-6 mb-3">
                    <p className="fw-bold mb-2">Foto Peminjaman</p>
                    {barang.foto_peminjaman ? (
                      <img
                        src={barang.foto_peminjaman}
                        alt="Foto Peminjaman"
                        className="rounded"
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                    ) : (
                      <p className="text-muted">Foto peminjaman tidak tersedia</p>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <p className="fw-bold mb-2">Foto Pengembalian</p>
                    {barang.foto_pengembalian ? (
                      <img
                        src={barang.foto_pengembalian}
                        alt="Foto Pengembalian"
                        className="rounded"
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                    ) : (
                      <p className="text-danger fw-bold">Barang ini belum dikembalikan</p>
                    )}
                  </div>
                </div>

                <table className="w-100 mt-5">
                  <tbody>
                    {[

                      ["Tanggal Peminjaman", barang.tanggal_peminjaman || "-"],
                      ["Tanggal Pengembalian", barang.tanggal_pengembalian || "-"],
                      // ["Waktu Peminjaman", barang.waktu_peminjaman || barang?.waktu || "-"],
                      ["Kode Barang", barang.kode_barang || "-"],
                      ["Nama Barang", barang.nama_barang || "-"],
                      ["Jenis Peminjaman", barang.nama_kategori || "-"],
                      ["Merk", barang.merk || "-"],
                      ["Spesifikasi", barang.deskripsi || barang?.spesifikasi || "-"],
                      ["Sanksi", barang.sanksi || "-"],
                      ["Status", barang.status === "dikembalikan" ? "Sudah Dikembalikan" : "Belum Dikembalikan"],

                    ].map(([label, value], i) => (
                      <tr key={i}>
                        <td className="text-secondary py-1">{label}</td>
                        <td className="text-secondary py-1 px-2">:</td>
                        <td className="fw-bold text-dark py-1">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-center mt-5">
                {barang.foto_pengembalian ? (
                  <button
                    className="btn btn-secondary rounded-pill me-5"
                    style={{ width: "250px", height: "50px" }}
                    disabled
                  >
                    Sudah Dikembalikan
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPengembalian(true)}
                    className="btn btn-primary rounded-pill me-5"
                    style={{ width: "250px", height: "50px" }}
                  >
                    Kembalikan
                  </button>
                )}
                <button
                  onClick={() => router.back()}
                  className="btn btn-outline-secondary rounded-pill shadow-outline-secondary-ss"
                  style={{ width: "250px", height: "50px", borderRadius: "12px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {showPengembalian && (
          <ModalPengembalian
            show={showPengembalian}
            barang={barang}
            onClose={() => setShowPengembalian(false)}
          />
        )}
      </AnimatePage>
    </LayoutDetail>
  );
};

export default PeminjamanDetailPage;