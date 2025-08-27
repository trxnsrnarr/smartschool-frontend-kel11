import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { axiosInstance as clientAxios } from "../../../client/clientAxios";
import moment from "moment";

const CardPeminjamanBelumKembali = () => {
  const router = useRouter();
  const [peminjaman, setPeminjaman] = useState([]);
  const [now, setNow] = useState(moment());

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
            item.tanggal_pengembalian &&
            item.tanggal_peminjaman
        );
        setPeminjaman(belum);
      } catch (err) {
        console.error("❌ Gagal fetch peminjaman:", err);
      }
    };

    fetchPeminjaman();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSisaWaktu = (tanggalPinjam, tanggalKembali) => {
    const mulai = moment(tanggalPinjam);
    const kembali = moment(tanggalKembali);

    const totalDurasi = moment.duration(kembali.diff(mulai));
    const durasiBerjalan = moment.duration(now.diff(mulai));

    const sisa = moment.duration(totalDurasi - durasiBerjalan);
    if (sisa.asMilliseconds() <= 0) return "⏰ Waktu telah habis!";

    const jam = Math.floor(sisa.asHours()).toString().padStart(2, "0");
    const menit = sisa.minutes().toString().padStart(2, "0");
    const detik = sisa.seconds().toString().padStart(2, "0");
    return `⏳ Tersisa ${jam} jam ${menit} menit ${detik} detik`;
  };

  const isWaktuKritis = (tanggalKembali) => {
    const sekarang = moment();
    const kembali = moment(tanggalKembali);
    const sisa = moment.duration(kembali.diff(sekarang));
    return sisa.asHours() <= 2;
  };

  return (
    <div className="card card-ss card-absen-kelas pb-3 mb-4">
      <div className="card-header-ss px-3 d-flex align-items-center text-white">
        <h5 className="fw-extrabold mb-0">Peminjaman Alat</h5>
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
              }}
            >
              {/* Countdown */}
              <div
                className="px-3 py-2 mb-3"
                style={{
                  backgroundColor: isWaktuKritis(item.tanggal_pengembalian)
                    ? "#C2140B"
                    : "#dee2e6",
                  color: isWaktuKritis(item.tanggal_pengembalian)
                    ? "#fff"
                    : "#6c757d",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  minHeight: "40px",
                  transition: "all 0.3s ease",
                }}
              >
                {formatSisaWaktu(item.tanggal_peminjaman, item.tanggal_pengembalian)}
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
                      className={`fw-bold ${isWaktuKritis(item.tanggal_pengembalian) ? "text-danger" : "text-secondary"}`}
                    >
                      {data.label}
                    </div>
                    <div
                      style={{ width: "10px" }}
                      className={`fw-bold ${isWaktuKritis(item.tanggal_pengembalian) ? "text-danger" : "text-secondary"}`}
                    >
                      :
                    </div>
                    <div className={`fw-bold ${isWaktuKritis(item.tanggal_pengembalian) ? "text-danger" : "text-secondary"}`}>
                      {data.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tombol navigasi: SELALU tampil */}
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
          Lihat Detail Peminjaman
        </button>
      </div>
    </div>
  );
};

export default CardPeminjamanBelumKembali;
