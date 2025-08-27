import Layout from "../../../components/Layout/Layout";
import SideNavBarang from "../../../components/Barang/SideNavBarang";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import { FaSearch, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { axiosInstance as clientAxios } from "../../../client/clientAxios";
import ModalTambahBarang from "../../../components/Barang/ModalTambahBarang";

const BarangUmum = () => {
  const [kategoriBarang, setKategoriBarang] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);
  const [showModalBarang, setShowModalBarang] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("ss-token")?.replaceAll('"', "");
        const sekolahId = localStorage.getItem("m_sekolah_id");

        const [barangRes, kategoriRes] = await Promise.all([
          clientAxios.get("/barang", {
            params: { m_sekolah_id: sekolahId },
            headers: { Authorization: `Bearer ${token}` },
          }),
          clientAxios.get("/kategori-barang", {
            params: { m_sekolah_id: sekolahId },
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // ✅ GUNAKAN CARA YANG SUDAH TERBUKTI BEKERJA
        const barangList = barangRes.data.barang?.data || barangRes.data.data || [];
        
        // ✅ FILTER BERDASARKAN KATEGORI BARANG YANG KOSONG (UMUM)
        const barangUmumOnly = barangList.filter(
          (item) =>
            (!item.kategori_barang || item.kategori_barang === "" || 
             item.m_kategori_barang_id === null) && // Tambahkan kondisi null
            item.status?.toLowerCase() === "tersedia"
        );

        const hasilFilter = search.trim()
          ? barangUmumOnly.filter((item) =>
              item.nama.toLowerCase().includes(search.toLowerCase())
            )
          : barangUmumOnly;

        setFilteredBarang(hasilFilter);
        setKategoriBarang(kategoriRes.data.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Gagal fetch data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [search]);

  const totalPages = Math.ceil(filteredBarang.length / itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const currentItems = filteredBarang.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelect = (e) => {
    setSearch(e.target.value);
  };

  // Default loading view
  if (isLoading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <p>Loading data barang...</p>
        </div>
      </Layout>
    );
  }

  const kategori =
    Array.isArray(kategoriBarang) && kategoriBarang.length > 0
      ? kategoriBarang.find((item) => item.slug === "barang-umum") || {
          nama: "Umum",
          slug: "barang-umum",
        }
      : {
          nama: "Umum",
          slug: "barang-umum",
        };

  return (
    <Layout>
      <div className="p-0" style={{ backgroundColor: "#F7F8F9", minHeight: "100vh" }}>
        <AnimatePage>
          <div className="row gy-4">
            <div className="col-lg-3 position-relative">
              <SideNavBarang />
            </div>
            <div className="col-lg-9">
              {/* Breadcrumb */}
              <div className="px-5 pt-4">
                <Link href="/smartschool/barang">
                  <span className="fw-bold text-primary" style={{ cursor: "pointer" }}>
                    Barang &gt;
                  </span>
                </Link>
                <span className="fw-bold text-primary"> {kategori.nama}</span>
              </div>

              {/* Header + Filter */}
              <div className="card-ss align-items-center mb-5 mt-3 px-4" style={{ backgroundColor: "white", borderRadius: "26px" }}>
                <div className="card-header p-4 card-header-ss">
                  <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column pb-3" style={{ borderBottom: "2px solid #80849C" }}>
                    <div className="d-flex align-items-center">
                      <h5 className="fw-bold m-0 color-dark me-2">Daftar Barang {kategori.nama}</h5>
                    </div>
                    <div
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                      onClick={() => {
                        setEditData(null);
                        setShowModalBarang(true);
                      }}
                    >
                      <FaPlus className="me-2" />
                      Tambah Barang
                    </div>
                  </div>

                  {/* Search & Select */}
                  <div className="d-flex mt-4 gap-2 flex-wrap">
                    <div className="flex-grow-1 position-relative">
                      <input
                        type="text"
                        className="form-control rounded-pill pe-5"
                        placeholder="Cari Barang"
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

                    <div style={{ minWidth: "150px" }}>
                      <select className="form-select rounded-pill" value={search} onChange={handleSelect}>
                        <option value="">Pilih</option>
                        {filteredBarang.map((item) => (
                          <option key={item.id} value={item.nama}>
                            {item.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel Data */}
              <div className="card card-ss px-4 mb-5" style={{ backgroundColor: "white", borderRadius: "26px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div className="table-responsive px-4">
                  <table className="table table-borderless align-middle text-center">
                    <thead style={{ borderBottom: "2px solid #DADADA" }}>
                      <tr>
                        <th style={{ width: "120px" }} className="text-center">Kode Barang</th>
                        <th style={{ width: "120px" }} className="text-center">Foto Barang</th>
                        <th style={{ width: "120px" }} className="text-center">Nama Barang</th>
                        <th style={{ width: "80px" }} className="text-center">Merk</th>
                        <th style={{ width: "170px" }} className="text-center">Lihat Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((card) => (
                        <tr key={card.id}>
                          <td>{card.kode_barang}</td>
                          <td>
                          <img
                            src={card.foto || "/img/default.png"}
                            alt={card.nama}
                            style={{ height: "60px", objectFit: "cover" }}
                            className="rounded"
                          />
                          </td>
                          <td>{card.nama}</td>
                          <td>{card.merk}</td>
                          <td>
                            <Link href={`/smartschool/barang-umum/${card.id}`}>
                              <a className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold">
                                Lihat Detail
                              </a>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="card card-ss px-4 mb-5" style={{ backgroundColor: "white", borderRadius: "26px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div className="d-flex justify-content-center my-4">
                    <nav>
                      <ul className="pagination mb-0 gap-2">
                        <li className={`page-item card ${currentPage === 1 && "disabled"}`}>
                          <button className="page-link rounded-3 border" style={{ width: "40px", height: "40px" }} onClick={() => goToPage(currentPage - 1)}>
                            &lt;
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <li key={i} className={`page-item card ${currentPage === i + 1 ? "active" : ""}`}>
                            <button className="page-link rounded-3 border" style={{ width: "40px", height: "40px" }} onClick={() => goToPage(i + 1)}>
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item card ${currentPage === totalPages && "disabled"}`}>
                          <button className="page-link rounded-3 border" style={{ width: "40px", height: "40px" }} onClick={() => goToPage(currentPage + 1)}>
                            &gt;
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AnimatePage>

        {/* Modal Tambah */}
        <ModalTambahBarang
          show={showModalBarang}
          editData={editData}
          setEditData={setEditData}
          onCloseModal={() => {
            setShowModalBarang(false);
            setEditData(null);
          }}
          _getBarang={() => window.location.reload()} // Refresh halaman
          jenisKategori="Umum" // ✅ INI YANG PERLU DITAMBAHKAN
        />
      </div>
    </Layout>
  );
};

export default BarangUmum;