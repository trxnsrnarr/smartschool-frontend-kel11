import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { axiosInstance as clientAxios } from "../../../client/clientAxios";
import moment from "moment";

const CardPeminjamanBelumKembali = () => {
  const router = useRouter();
  const [peminjaman, setPeminjaman] = useState([]);
  const [now, setNow] = useState(moment());

  // Ambil data saat mount
  useEffect(() => {
    const fetchPeminjaman = async () => {
      try {
        const token = localStorage.getItem("ss-token")?.replace(/"/g, "");
        const res = await clientAxios.get("/peminjaman", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const semua = res.data;
        const belum = semua.filter(
          (item) =>
            item.status?.toLowerCase() !== "dikembalikan" &&
            item.tanggal_pengembalian
        );
        setPeminjaman(belum);
      } catch (err) {
        console.error("❌ Gagal fetch peminjaman:", err);
      }
    };

    fetchPeminjaman();
  }, []);

  // Perbarui waktu setiap detik (untuk countdown)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format durasi ke bentuk HH:mm:ss
  const formatSisaWaktu = (tanggalKembali) => {
    const durasi = moment.duration(moment(tanggalKembali).diff(now));
    if (durasi.asMilliseconds() <= 0) return "Sudah lewat waktu!";
    const jam = Math.floor(durasi.asHours()).toString().padStart(2, "0");
    const menit = durasi.minutes().toString().padStart(2, "0");
    const detik = durasi.seconds().toString().padStart(2, "0");
    return `${jam}:${menit}:${detik}`;
  };

  return (
    <div className="card card-ss card-absen-kelas pb-3 mb-4">
      <div className="card-header-ss px-3 d-flex align-items-center text-white">
        <h5 className="fw-extrabold mb-0">Peminjaman alat</h5>
      </div>

      <div className="card-body p-3">
        {peminjaman.length === 0 ? (
          <div className="text-center">
            <img
              src="/img/empty-state-jadwal.png"
              alt="empty set"
              className="img-fluid"
              style={{ maxWidth: "200px" }}
            />
            <p className="mt-3 mb-0 fw-bold">
              Tidak ada alat yang sedang dipinjam
            </p>
          </div>
        ) : (
          peminjaman.map((item) => (
            <div
              key={item.id}
              className="rounded shadow-sm mb-3"
              style={{
                backgroundColor: "#F9F9F9",
                border: "1px solid #E4E4E4",
                padding: "10px",
                transition: "0.3s",
              }}
            >
              {/* Notifikasi countdown */}
              <div
                className="px-3 py-2 text-white mb-3"
                style={{
                  backgroundColor: "#C2140B",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  width: "100%",
                  height: "40px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                }}
              >
                Segera Kembalikan dalam {formatSisaWaktu(item.tanggal_pengembalian)}
              </div>

              {/* Detail barang */}
              <div className="px-1">
                {[
                  { label: "Kode Barang", value: item.kode_barang },
                  { label: "Nama Barang", value: item.nama_barang },
                  { label: "Merk", value: item.merk || "-" },
                ].map((data, idx) => (
                  <div
                    className="d-flex mb-1 align-items-start"
                    key={idx}
                    style={{ gap: "8px" }}
                  >
                    <div
                      style={{ width: "110px" }}
                      className="fw-bold text-danger"
                    >
                      {data.label}
                    </div>
                    <div
                      style={{ width: "10px" }}
                      className="fw-bold text-danger"
                    >
                      :
                    </div>
                    <div className="fw-bold text-danger">{data.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tombol navigasi jika ada data */}
      {peminjaman.length > 0 && (
        <div className="text-center px-3 pb-3">
          <button
            className="btn btn-primary rounded-pill fw-bold"
            style={{
              background: "linear-gradient(to right, #267FEA, #12268B)",
              border: "none",
              padding: "6px 20px",
              width: "100%",
              height: "40px",
              fontSize: "0.9rem",
            }}
            onClick={() => router.push(`/smartschool/profil?nav=peminjaman`)}
          >
            Lihat Lainnya
          </button>
        </div>
      )}
    </div>
  );
};

export default CardPeminjamanBelumKembali;