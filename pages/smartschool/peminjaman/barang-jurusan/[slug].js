import Layout from "../../../../components/Layout/Layout";
import SideNavBarang from "../../../../components/Barang/SideNavBarang";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { axiosInstance as clientAxios } from "../../../../client/clientAxios";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import moment from "moment";

const BarangJurusan = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [dataPeminjaman, setDataPeminjaman] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedNama, setSelectedNama] = useState("Semua");
  const [filteredData, setFilteredData] = useState([]);
  const [namaOptions, setNamaOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jurusanInfo, setJurusanInfo] = useState({ nama: "Jurusan" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("ss-token")?.replaceAll('"', "");
        if (!token) return toast.error("Harap login terlebih dahulu");

        const res = await clientAxios.get(`/peminjaman/jurusan/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && Array.isArray(res.data.data)) {
          const now = new Date();

          const mappedData = res.data.data.map((item, index) => {
            let statusText = "Belum Dikembalikan";
            if (item.status === "dikembalikan") {
              statusText = "Sudah Dikembalikan";
            } else if (
              item.status === "telat" &&
              item.batas_pengembalian &&
              new Date(item.batas_pengembalian) < now
            ) {
              statusText = "Telat Dikembalikan !";
            }

            return {
              id: item.id,
              no: index + 1,
              tanggalPeminjaman: item.tanggal_peminjaman
                ? moment(item.tanggal_peminjaman).format("DD MMMM YYYY, HH:mm")
                : "-",
              tanggalPengembalian: item.tanggal_pengembalian
                ? moment(item.tanggal_pengembalian).format("DD MMMM YYYY, HH:mm")
                : "-",
              kodeBarang: item.kode_barang,
              namaBarang: item.nama_barang,
              peminjam: item.nama_peminjam || "-",
              status: statusText,
            };
          });

          setDataPeminjaman(mappedData);
          const uniqueNames = [...new Set(mappedData.map((item) => item.namaBarang))];
          setNamaOptions(["Semua", ...uniqueNames]);
          filterData(mappedData, search, selectedNama);
          setJurusanInfo({ nama: res.data.jurusan });
        } else {
          toast.error("Format data tidak valid");
        }
      } catch (err) {
        console.error("Gagal ambil data peminjaman:", err);
        toast.error(err.response?.data?.message || "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  useEffect(() => {
    filterData(dataPeminjaman, search, selectedNama);
  }, [search, selectedNama, dataPeminjaman]);

  const filterData = (data, keyword, nama) => {
    const hasil = data.filter((item) => {
      const cocokSearch =
        item.namaBarang?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.kodeBarang?.toLowerCase().includes(keyword.toLowerCase());
      const cocokNama = nama === "Semua" || item.namaBarang === nama;
      return cocokSearch && cocokNama;
    });
    setFilteredData(hasil);
  };

  const getStatusBadge = (status) => {
    if (status === "Sudah Dikembalikan") {
      return (
        <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ backgroundColor: "#4EB701", color: "white" }}>
          {status}
        </span>
      );
    } else {
      return (
        <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ backgroundColor: "#C2140B", color: "white" }}>
          {status}
        </span>
      );
    }
  };

  const handleLihatDetail = (id) => {
    router.push(`/smartschool/peminjaman/barang-jurusan/${slug}/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ backgroundColor: "#F7F8F9", minHeight: "100vh" }}>
        <AnimatePage>
          <div className="row gy-4">
            <div className="col-lg-3 position-relative">
              <SideNavBarang />
            </div>
            <div className="col-lg-9">
              {/* Breadcrumb */}
              <div className="px-5 pt-4">
                <Link href="/smartschool/peminjaman">
                  <span className="fw-bold text-primary" style={{ cursor: "pointer" }}>
                    Peminjaman &gt;
                  </span>
                </Link>
                <Link href="/smartschool/peminjaman/barang-jurusan">
                  <span className="fw-bold text-primary px-1" style={{ cursor: "pointer" }}>
                    Jurusan &gt;
                  </span>
                </Link>
                <span className="fw-bold text-primary"> {jurusanInfo.nama}</span>
              </div>

              {/* Filter Card */}
              <div className="card-ss mb-5 mt-3 px-4" style={{ backgroundColor: "white", borderRadius: "26px" }}>
                <div className="card-header p-4">
                  <div
                    className="d-flex justify-content-between align-items-md-center flex-md-row flex-column pb-3"
                    style={{ borderBottom: "2px solid #80849C" }}
                  >
                    <h5 className="fw-bold m-0 color-dark me-2">
                      Daftar Peminjaman Barang {jurusanInfo.nama}
                    </h5>
                  </div>

                  {/* Search + Dropdown */}
                  <div className="d-flex mt-4 gap-2 flex-wrap">
                    <div className="flex-grow-1 position-relative">
                      <input
                        type="text"
                        className="form-control rounded-pill pe-5"
                        placeholder="Cari Barang (Nama / Kode)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <FaSearch
                        style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#999",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                    <select
                      className="form-select rounded-pill"
                      style={{ maxWidth: "200px" }}
                      value={selectedNama}
                      onChange={(e) => setSelectedNama(e.target.value)}
                    >
                      {namaOptions.map((nama, i) => (
                        <option key={i} value={nama}>
                          {nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="card card-ss px-4 mb-5" style={{ backgroundColor: "white", borderRadius: "26px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div className="table-responsive px-4 py-4">
                  <table className="table table-borderless align-middle text-center">
                    <thead style={{ borderBottom: "2px solid #DADADA" }}>
                      <tr>
                        <th>No</th>
                        <th>Tanggal Peminjaman</th>
                        <th>Tanggal Pengembalian</th>
                        <th>Kode Barang</th>
                        <th>Nama Barang</th>
                        <th>Peminjam</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                          <tr key={item.id}>
                            <td>{item.no}</td>
                            <td>{item.tanggalPeminjaman}</td>
                            <td>{item.tanggalPengembalian}</td>
                            <td>{item.kodeBarang}</td>
                            <td>{item.namaBarang}</td>
                            <td>{item.peminjam}</td>
                            <td>{getStatusBadge(item.status)}</td>
                            <td>
                              <button
                                className="btn btn-sm rounded-pill"
                                style={{
                                  background: "linear-gradient(to right, #267FEA, #12268B)",
                                  color: "white",
                                  padding: "6px 16px",
                                  fontWeight: "bold",
                                  fontSize: "0.85rem",
                                  border: "none",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                }}
                                onClick={() => handleLihatDetail(item.id)}
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-muted text-center py-4">
                            {search || selectedNama !== "Semua"
                              ? "Tidak ada data yang sesuai dengan filter"
                              : "Tidak ada data peminjaman"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </AnimatePage>
      </div>
    </Layout>
  );
};

export default BarangJurusan;