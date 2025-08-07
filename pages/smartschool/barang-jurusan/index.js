import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import SideNavBarang from "../../../components/Barang/SideNavBarang";
import CardJurusanBarang from "../../../components/Barang/CardJurusanBarang";
import ModalTambahJurusan from "../../../components/Barang/ModalTambahJurusan";
import swal from "sweetalert";
import toast from "react-hot-toast";
import { deleteJurusanBarang } from "../../../client/BarangClient";
import { axiosInstance as clientAxios } from "../../../client/clientAxios";

const Index = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [activeMenu, setActiveMenu] = useState("/");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [jurusanList, setJurusanList] = useState([]);

  const fetchJurusan = async () => {
    try {
      const token = localStorage.getItem("ss-token")?.replaceAll('"', "");
      if (!token) {
        toast.error("Token tidak ditemukan");
        return;
      }

      // Dapatkan m_sekolah_id dari profil
      const resProfil = await clientAxios.get("/profil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const sekolahId = resProfil.data?.user?.m_sekolah_id;
      if (!sekolahId) {
        toast.error("Sekolah ID tidak ditemukan dari profil");
        return;
      }

      const res = await clientAxios.get("/jurusan-barang", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          m_sekolah_id: sekolahId,
        },
      });

      setJurusanList(res.data?.data || []);
    } catch (error) {
      console.error("Gagal mengambil jurusan:", error);
      toast.error("Gagal mengambil data jurusan.");
    }
  };

  useEffect(() => {
    setActiveMenu(router.pathname);

    const token = localStorage.getItem("ss-token");
    if (token) {
      fetchJurusan();
    } else {
      console.warn("Token belum tersedia");
    }
  }, [router.pathname]);

  const handleTambah = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    swal({
      title: "Yakin ingin menghapus?",
      text: `Kategori jurusan "${item.nama}" akan dihapus.`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await deleteJurusanBarang(item.id);
          toast.success("Kategori berhasil dihapus.");
          fetchJurusan();
        } catch (error) {
          console.error("Gagal hapus:", error);
          toast.error("Gagal menghapus kategori.");
        }
      }
    });
  };

  const jurusan = jurusanList.find((item) => item.slug === slug);

  return (
    <Layout>
      <div className="p-0" style={{ backgroundColor: "#F7F8F9", minHeight: "100vh" }}>
        <AnimatePage>
          <div className="row gy-4">
            <div className="col-lg-3 positon-relative">
              <SideNavBarang />
            </div>

            <div className="col-lg-9">
              {/* Breadcrumb & Header */}
              <div className="fw-bold text-primary px-5 pt-4 pb-0" style={{ fontSize: "16px" }}>
                <Link href="/smartschool/barang">
                  <span style={{ cursor: "pointer" }}>Barang &gt;</span>
                </Link>
                <span> Jurusan </span>
              </div>

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
                    Daftar Barang {jurusan?.nama || ""}
                  </h5>
                </div>
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
                  onClick={handleTambah}
                >
                  + Tambah Jurusan
                </button>
              </div>

              {/* Grid Card Kategori */}
              <div className="row gy-4">
                {jurusanList.map((jurusan, index) => (
                  <CardJurusanBarang
                    key={jurusan.id || index}
                    jurusan={jurusan}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          </div>
        </AnimatePage>
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <ModalTambahJurusan
          editData={editData}
          setEditData={setEditData}
          onCloseModal={() => setShowModal(false)}
          refreshData={fetchJurusan}
        />
      )}
    </Layout>
  );
};

export default Index;
