import Layout from "../../../../components/Layout/Layout";
import SideNavBarang from "../../../../components/Barang/SideNavBarang";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { axiosInstance as clientAxios } from "../../../../client/clientAxios";
import { useRouter } from "next/router";
import moment from "moment";

const BarangUmum = () => {
  const router = useRouter();
  const [peminjaman, setPeminjaman] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedNama, setSelectedNama] = useState("Semua");
  const [filteredData, setFilteredData] = useState([]);
  const [namaOptions, setNamaOptions] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("ss-token")?.replaceAll('"', "");
      const m_sekolah_id = localStorage.getItem("m_sekolah_id");

      // Langsung ambil data peminjaman tanpa cari kategori terlebih dahulu
      const res = await clientAxios.get("/peminjaman/kategori/barang-umum", {
        params: { m_sekolah_id },
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Data dari API:", res.data); // Debugging
      
      if (res.data && Array.isArray(res.data)) {
        setPeminjaman(res.data);
        const uniqueNames = [...new Set(res.data.map((item) => item.nama_barang))];
        setNamaOptions(["Semua", ...uniqueNames]);
        filterData(res.data, search, selectedNama);
      } else {
        console.error("Format data tidak valid:", res.data);
      }
    } catch (err) {
      console.error("Gagal ambil data peminjaman:", err);
      console.error("Detail error:", err.response?.data); // Debugging
    }
  };

  fetchData();
}, []);

          useEffect(() => {
            filterData(peminjaman, search, selectedNama);
          }, [search, selectedNama]);

          const filterData = (data, keyword, nama) => {
            const lowerKeyword = keyword.toLowerCase();

            const hasil = data.filter((item) => {
              const matchSearch =
                item.nama_barang?.toLowerCase().includes(lowerKeyword) ||
                item.kode_barang?.toLowerCase().includes(lowerKeyword);
              const matchNama = nama === "Semua" || item.nama_barang === nama;
              return matchSearch && matchNama;
            });

            setFilteredData(hasil);
          };

          // Ganti fungsi handleLihatDetail menjadi:
          const handleLihatDetail = (id) => {
            router.push(`/smartschool/peminjaman/barang-umum/${id}`);
          };

          const kategori = {
            nama: "Umum",
            slug: "barang-umum",
          };

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
                <span className="fw-bold text-primary"> {kategori.nama}</span>
              </div>

              {/* Filter Card */}
              <div
                className="card-ss mb-5 mt-3 px-4"
                style={{ backgroundColor: "white", borderRadius: "26px" }}
              >
                <div className="card-header p-4">
                  <div
                    className="d-flex justify-content-between align-items-md-center flex-md-row flex-column pb-3"
                    style={{ borderBottom: "2px solid #80849C" }}
                  >
                    <h5 className="fw-bold m-0 color-dark me-2">
                      Daftar Peminjaman Barang {kategori.nama}
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
              <div
                className="card card-ss px-4 mb-5"
                style={{
                  backgroundColor: "white",
                  borderRadius: "26px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
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
                        <th style={{ width: "200px" }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>
                            {item.tanggal_peminjaman
                              ? moment(item.tanggal_peminjaman).format("DD MMMM YYYY, HH:mm")
                              : "-"}
                          </td>
                          <td>
                            {item.tanggal_pengembalian
                              ? moment(item.tanggal_pengembalian).format("DD MMMM YYYY, HH:mm")
                              : "-"}
                          </td>
                          <td>{item.kode_barang}</td>
                          <td>{item.nama_barang}</td>
                          <td>{item.nama_peminjam || "-"}</td>
                          <td>
                            <span
                                className="badge rounded-pill px-3 py-2 fw-semibold"
                                style={{
                                  backgroundColor: item.status === "dipinjam" ? "#C2140B" : "#4EB701",
                                  color: "white",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {item.status === "dipinjam" ? "Belum Dikembalikan" : "Sudah Dikembalikan"}
                            </span>
                          </td>
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
                      ))}
                      {filteredData.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center py-4 text-muted">
                            Tidak ada data peminjaman ditemukan.
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

export default BarangUmum;