import Layout from "../../../../../components/Layout/Layout";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { axiosInstance as clientAxios } from "../../../../../client/clientAxios";
import moment from "moment";
import toast from "react-hot-toast";

const DetailPeminjamanPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [dataDetail, setDataDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("ss-token")?.replace(/"/g, "");
        const res = await clientAxios.get(`/peminjaman/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // LOGIKA YANG SAMA PERSIS DENGAN LIST PAGE
        const now = new Date();
        let statusDisplay = "Belum Dikembalikan";
        let statusColor = "#C2140B"; // Merah default
        
        if (res.data.status === "dikembalikan") {
          statusDisplay = "Sudah Dikembalikan";
          statusColor = "#4EB701"; // Hijau
        } else if (res.data.status === "telat") {
          statusDisplay = "Telat Dikembalikan !";
          statusColor = "#C2140B"; // Oranye
        } else if (res.data.batas_pengembalian) {
          // CEK JIKA SUDAH MELEWATI BATAS PENGEMBALIAN
          const batasPengembalian = new Date(res.data.batas_pengembalian);
          if (batasPengembalian < now) {
            statusDisplay = "Telat Dikembalikan !";
            statusColor = "#C2140B"; // Oranye
          }
        }

        // Format data
        const formattedData = {
          ...res.data,
          tanggalPeminjaman: moment(res.data.tanggal_peminjaman).format('DD/MM/YYYY'),
          tanggalPengembalian: res.data.tanggal_pengembalian 
            ? moment(res.data.tanggal_pengembalian).format('DD/MM/YYYY') 
            : "-",
          batasPengembalian: res.data.batas_pengembalian
            ? moment(res.data.batas_pengembalian).format('DD/MM/YYYY HH:mm')
            : "-",
          nama: res.data.nama_barang,
          nama_peminjam: res.data.nama_siswa || res.data.nama_user || "-",
          statusDisplay,
          statusColor
        };

        console.log("DEBUG DATA:", formattedData); // UNTUK LIHAT DATA YANG DITERIMA

        setDataDetail(formattedData);
      } catch (err) {
        console.error("Gagal ambil detail:", err);
        toast.error("Gagal memuat detail peminjaman");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!dataDetail) return <p>Data tidak ditemukan</p>;

  return (
    <Layout isIndex>
      <AnimatePage>
        <section className="banner-barang position-absolute"></section>

        <div className="row d-flex justify-content-center pt-4">
          <div className="col-md-8">
            <button
              onClick={() => router.back()}
              className="text-decoration-none fw-bolder position-relative text-white bg-transparent border-0 mb-3"
              style={{ cursor: "pointer" }}
            >
              <FaChevronLeft /> <span className="ms-2">Kembali</span>
            </button>

            <div className="card card-ss p-4 pb-5 mt-2 mb-4" style={{ borderRadius: "12px" }}>
              <h4 className="fw-bold mb-4" style={{ color: "#3A4166" }}>
                Detail Informasi Peminjaman Barang
              </h4>

              <div className="rounded-ss p-4 mb-4" style={{ background: "#F4F4F7" }}>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <div className="text-center">
                    <p className="fw-bold">Foto Peminjaman</p>
                    <img
                      src={dataDetail.foto_peminjaman || "/img/default.png"}
                      alt="Foto Peminjaman"
                      className="rounded"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="fw-bold">Foto Pengembalian</p>
                    {dataDetail.foto_pengembalian ? (
                      <img
                        src={dataDetail.foto_pengembalian}
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
                    <tr><td>Kategori Barang</td><td>:</td><td className="fw-bold">{dataDetail.kategori || "-"}</td></tr>
                    <tr><td>Jurusan</td><td>:</td><td className="fw-bold">{dataDetail.jurusan || "-"}</td></tr>
                    <tr><td>Tanggal Peminjaman</td><td>:</td><td className="fw-bold">{dataDetail.tanggalPeminjaman}</td></tr>
                    <tr><td>Tanggal Pengembalian</td><td>:</td><td className="fw-bold">{dataDetail.tanggalPengembalian}</td></tr>
                    <tr><td>Batas Pengembalian</td><td>:</td><td className="fw-bold">{dataDetail.batasPengembalian}</td></tr>
                    <tr><td>Nama Peminjam</td><td>:</td><td className="fw-bold">{dataDetail.nama_peminjam}</td></tr>
                    <tr><td>Nama Barang</td><td>:</td><td className="fw-bold">{dataDetail.nama}</td></tr>
                    <tr><td>Merk</td><td>:</td><td className="fw-bold">{dataDetail.merk || "-"}</td></tr>
                    <tr><td>Spesifikasi</td><td>:</td><td className="fw-bold">{dataDetail.spesifikasi || "-"}</td></tr>
                    <tr><td>Status</td><td>:</td>
                      <td className="fw-bold" style={{ color: dataDetail.statusColor }}>
                        {dataDetail.statusDisplay}
                      </td>
                    </tr>
                    <tr><td>Sanksi</td><td>:</td><td className="fw-bold">{dataDetail.sanksi || "-"}</td></tr>
                    <tr><td>Kode Barang</td><td>:</td><td className="fw-bold">{dataDetail.kode_barang}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="text-end">
                <button
                  onClick={() => router.back()}
                  className="btn btn-primary bg-gradient-primary px-4 py-2 fw-bold"
                  style={{ borderRadius: "18px", width: "150px", height: "50px" }}
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default DetailPeminjamanPage;