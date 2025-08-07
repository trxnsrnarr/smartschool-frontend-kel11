import { useRouter } from "next/router";
import Layout from "../../../components/Layout/Layout";
import SideNavBarang from "../../../components/Barang/SideNavBarang";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import { FaSearch, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import ModalTambahBarangJurusan from "../../../components/Barang/ModalTambahBarangJurusan";
import { axiosInstance as clientAxios } from "../../../client/clientAxios";
import toast from "react-hot-toast";

const BarangPerJurusan = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [search, setSearch] = useState("");
  const [barangList, setBarangList] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [jurusanNama, setJurusanNama] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchBarang = async () => {
    try {
      const token = localStorage.getItem("ss-token")?.replaceAll('"', "");
      const sekolahId = localStorage.getItem("m_sekolah_id");

      const resBarang = await clientAxios.get("/barang", {
        headers: { Authorization: `Bearer ${token}` },
        params: { m_sekolah_id: sekolahId },
      });

      const allBarang = resBarang.data?.barang?.data || [];

      const filtered = allBarang.filter(
        (item) =>
          item.jurusan?.nama?.toLowerCase() === slug?.toLowerCase() &&
          item.status?.toLowerCase() === "tersedia"
      );

      setBarangList(filtered);
      setFilteredBarang(filtered);
      setJurusanNama(slug.toUpperCase());
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal ambil data:", err.response?.data || err.message);
      toast.error("Gagal mengambil data barang");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchBarang();
  }, [slug]);

  useEffect(() => {
    const keyword = search.toLowerCase();
    const filtered = barangList.filter((item) =>
      item.nama.toLowerCase().includes(keyword)
    );
    setFilteredBarang(filtered);
  }, [search, barangList]);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredBarang.length / itemsPerPage);

  const currentItems = filteredBarang.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSelect = (e) => {
    const selected = e.target.value;
    setSearch(selected);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <p>Loading data barang jurusan...</p>
        </div>
      </Layout>
    );
  }

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
                <Link href={`/smartschool/barang`}>
                  <span className="fw-bold text-primary" style={{ cursor: "pointer" }}>
                    Barang &gt;
                  </span>
                </Link>
                <Link href={`/smartschool/barang-jurusan`}>
                  <span className="fw-bold text-primary px-1" style={{ cursor: "pointer" }}>
                    Jurusan &gt;
                  </span>
                </Link>
                <span className="fw-bold text-primary"> {jurusanNama}</span>
              </div>

              {/* Header + Filter */}
              <div className="card-ss align-items-center mb-5 mt-3 px-4" style={{ backgroundColor: "white", borderRadius: "26px" }}>
                <div className="card-header p-4 card-header-ss">
                  <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column pb-3" style={{ borderBottom: "2px solid #80849C" }}>
                    <div className="d-flex align-items-center">
                      <h5 className="fw-bold m-0 color-dark me-2">Daftar Barang {jurusanNama}</h5>
                    </div>
                    <div
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                      onClick={() => {
                        setEditData(null);
                        setShowModal(true);
                      }}
                    >
                      <FaPlus className="me-2" /> Tambah Barang
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
                        {barangList.map((item) => (
                          <option key={item.id} value={item.nama}>
                            {item.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="card card-ss px-4 mb-5" style={{ backgroundColor: "white", borderRadius: "26px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div className="table-responsive px-4">
                  <table className="table table-borderless align-middle text-center">
                    <thead style={{ borderBottom: "2px solid #DADADA" }}>
                      <tr>
                        <th>Kode Barang</th>
                        <th>Foto Barang</th>
                        <th>Nama Barang</th>
                        <th>Merk</th>
                        <th>Lihat Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.kode_barang}</td>
                          <td>
                            <img
                              src={
                                Array.isArray(item.foto)
                                  ? item.foto[0]
                                  : item.foto || "/img/default.png"
                              }
                              alt={item.nama}
                              style={{ height: "60px", maxWidth: "100%", objectFit: "contain" }}
                              className="rounded"
                            />
                          </td>
                          <td>{item.nama}</td>
                          <td>{item.merk}</td>
                          <td>
                            <Link href={`/smartschool/barang-jurusan/${slug}/${item.id}`}>
                              <a className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold">
                                Lihat Detail
                              </a>
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {currentItems.length === 0 && (
                        <tr>
                          <td colSpan="5">Tidak ada barang untuk jurusan ini.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </AnimatePage>

        {/* Modal Tambah Barang */}
        <ModalTambahBarangJurusan
          show={showModal}
          editData={editData}
          setEditData={setEditData}
          onCloseModal={() => setShowModal(false)}
          _getBarang={fetchBarang}
        />
      </div>
    </Layout>
  );
};

export default BarangPerJurusan;