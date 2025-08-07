import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { axiosInstance as axios } from "../../client/clientAxios";
import ModalTambahPeminjaman from "./ModalTambahPeminjaman";

const SectionPeminjamanAlat = () => {
  const [dataPeminjaman, setDataPeminjaman] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

useEffect(() => {
  const fetchPeminjaman = async () => {
    try {
      const token = localStorage.getItem("ss-token")?.replaceAll('"', "");

      const res = await axios.get("http://localhost:3333/peminjaman", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const peminjamanDariAPI = res.data || [];

      const peminjamanDenganNomor = peminjamanDariAPI.map((item, index) => ({
        id: item.id,
        no: index + 1,
        tanggalPeminjaman: item.tanggal_peminjaman,
        tanggalPengembalian: item.tanggal_pengembalian || "-",
        waktuPeminjaman: item.waktu_peminjaman || "3 Hari",
        kodeBarang: item.kode_barang,
        namaBarang: item.nama_barang,
        sanksi: item.sanksi || "-",
        status:
          item.status === "dikembalikan"
            ? "Sudah Dikembalikan"
            : "Belum Dikembalikan",
      }));

      setDataPeminjaman(peminjamanDenganNomor);
    } catch (err) {
      console.error("Gagal mengambil data peminjaman:", err);
    }
  };

  fetchPeminjaman();
}, []);

  const getStatusBadge = (status) => {
    if (status === "Sudah Dikembalikan") {
      return (
        <span
          className="badge px-3 py-2 rounded-pill"
          style={{ backgroundColor: "#4EB701", color: "white" }}
        >
          {status}
        </span>
      );
    } else if (status === "Belum Dikembalikan") {
      return (
        <span
          className="badge px-3 py-2 rounded-pill"
          style={{ backgroundColor: "#C2140B", color: "white" }}
        >
          {status}
        </span>
      );
    } else {
      return <span>{status}</span>;
    }
  };

  const handleLihatDetail = (id) => {
    router.push(`/smartschool/profil/peminjaman/${id}`);
  };

  return (
    <>
      <div className="d-flex flex-column gap-4">
        {/* Header + Button Tambah */}
        <div className="mt-4 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-dark">Peminjaman</h5>
            <button
              className="btn rounded-pill"
              style={{
                padding: "10px 20px",
                background: "linear-gradient(to right, #267FEA, #12268B)",
                color: "white",
                fontWeight: "bold",
                border: "none",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => setShowModal(true)}
            >
              + Tambah Peminjaman
            </button>
          </div>
        </div>

        {/* Tabel Data */}
        {dataPeminjaman.length > 0 ? (
          <div className="mt-3 mb-5">
            <div className="table-responsive">
              <table className="table text-center align-middle mb-0">
                <thead>
                  <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                    <th>No</th>
                    <th>Tanggal Peminjaman</th>
                    <th>Tanggal Pengembalian</th>
                    <th>Waktu Peminjaman</th>
                    <th>Kode Barang</th>
                    <th>Nama Barang</th>
                    <th>Sanksi</th>
                    <th>Status</th>
                    <th style={{ width: "130px" }}>Lihat Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPeminjaman.length > 0 ? (
                    dataPeminjaman.map((item) => (
                      <tr key={item.id}>
                        <td>{item.no}</td>
                        <td className="fw-bold">{item.tanggalPeminjaman}</td>
                        <td>{item.tanggalPengembalian}</td>
                        <td>{item.waktuPeminjaman}</td>
                        <td>{item.kodeBarang}</td>
                        <td>{item.namaBarang}</td>
                        <td>{item.sanksi}</td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td>
                          <button
                            className="btn rounded-pill btn-sm"
                            style={{
                              padding: "6px 16px",
                              background: "linear-gradient(to right, #267FEA, #12268B)",
                              color: "white",
                              fontWeight: "bold",
                              border: "none",
                              fontSize: "0.85rem",
                            }}
                            onClick={() => handleLihatDetail(item.id)}
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-muted text-center py-4">
                        Belum ada data peminjaman
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted">Belum ada data peminjaman.</p>
        )}
      </div>

      {/* Modal Tambah Peminjaman */}
      {showModal && (
        <ModalTambahPeminjaman
          show={showModal}
          onClose={() => setShowModal(false)}
          onRefresh={() => {
            // Refresh data setelah tambah
            setShowModal(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
};

export default SectionPeminjamanAlat;
