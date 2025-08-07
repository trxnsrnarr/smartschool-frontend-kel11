import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import SideNavBarang from "../../../../components/Barang/SideNavBarang";
import CardJurusanPeminjaman from "../../../../components/Barang/CardJurusanPeminjaman";
import ModalTambahJurusan from "../../../../components/Barang/ModalTambahJurusan";
import swal from "sweetalert";
import toast from "react-hot-toast";
import { deleteJurusanBarang } from "../../../../client/BarangClient";
import { axiosInstance as clientAxios } from "../../../../client/clientAxios";

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
                <Link href="/smartschool/peminjaman">
                  <span style={{ cursor: "pointer" }}>Peminjaman &gt;</span>
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
              </div>

              {/* Grid Card Kategori */}
              <div className="row gy-4">
                {jurusanList.map((jurusan, index) => (
                  <CardJurusanPeminjaman
                    key={jurusan.id || index}
                    jurusan={jurusan}
                  />
                ))}
              </div>
            </div>
          </div>
        </AnimatePage>
      </div>
    </Layout>
  );
};

export default Index;