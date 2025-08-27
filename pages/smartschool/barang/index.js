import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import SideNavBarang from "../../../components/Barang/SideNavBarang";
import CardKategoriBarang from "../../../components/Barang/CardKategoriBarang";
import ModalTambahKategori from "../../../components/Barang/ModalTambahKategori";
import swal from "sweetalert";
import toast from "react-hot-toast";
import { axiosInstance as clientAxios } from "../../../client/clientAxios";

const Index = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("/");
  const [kategoriBarang, setKategoriBarang] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchKategoriBarang = async () => {
    const token = JSON.parse(localStorage.getItem("ss-token"));
    if (!token) return;

    try {
      // Dapatkan m_sekolah_id dari profil user terlebih dahulu
      const resProfil = await clientAxios.get("/profil", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const m_sekolah_id = resProfil.data?.user?.m_sekolah_id;
      if (!m_sekolah_id) {
        toast.error("ID sekolah tidak ditemukan");
        return;
      }

      // Kirim m_sekolah_id sebagai query parameter
      const res = await clientAxios.get(`/kategori-barang?m_sekolah_id=${m_sekolah_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Data kategori received:", res.data);
      setKategoriBarang(res.data || []);
    } catch (err) {
      console.log("ERR", err.response?.data || err);
      toast.error("Gagal mengambil data kategori");
    }
  };

  useEffect(() => {
    fetchKategoriBarang();
  }, []);

  const handleTambah = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    swal({
      title: "Yakin ingin menghapus?",
      text: `Kategori "${item.nama}" akan dihapus.`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const token = JSON.parse(localStorage.getItem("ss-token"));
          await clientAxios.delete(`/kategori-barang/${item.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Kategori berhasil dihapus.");
          fetchKategoriBarang(); // ✅ REFRESH SETELAH HAPUS
        } catch (error) {
          console.error("Gagal hapus:", error);
          toast.error("Gagal menghapus kategori.");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditData(null);
  };

  return (
    <Layout>
      <div className="p-0" style={{ backgroundColor: "#F7F8F9", minHeight: "100vh" }}>
        <AnimatePage>
          <div className="row gy-4">
            <div className="col-lg-3 positon-relative">
              <SideNavBarang />
            </div>

            <div className="col-lg-9">
              <Link href="/smartschool/barang">
                <p className="fw-bold text-primary px-5 py-4 mb-0" style={{ cursor: "pointer" }}>
                  Barang &gt;
                </p>
              </Link>

              <div
                className="d-flex justify-content-between align-items-center mb-3 px-5 py-4"
                style={{
                  backgroundColor: "white",
                  borderRadius: "26px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: "#3A4166" }}>
                    Daftar Kategori Barang
                  </h5>
                </div>
              </div>

              <div className="row gy-4">
                <CardKategoriBarang 
                  dataKategori={kategoriBarang} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </AnimatePage>
      </div>

      {showModal && (
        <ModalTambahKategori
          editData={editData}
          setEditData={setEditData}
          onCloseModal={handleCloseModal}
          refreshData={fetchKategoriBarang} // ✅ PASS refreshData FUNCTION
        />
      )}
    </Layout>
  );
};

export default Index;