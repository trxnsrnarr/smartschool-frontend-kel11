import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import SideNavBarang from "../../../components/Barang/SideNavBarang";
import CardKategoriBarang from "../../../components/Barang/CardKategoriBarang";
import ModalTambahTambah from "../../../components/Barang/ModalTambahTambah";
import { axiosInstance as clientAxios } from "../../../client/clientAxios";

const Index = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("/");
  const [kategoriBarang, setKategoriBarang] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchKategoriBarang = async () => {
    const token = JSON.parse(localStorage.getItem("ss-token"));
    if (!token) return;

    try {
      const res = await clientAxios.get("/kategori-barang", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKategoriBarang(res.data || []);
    } catch (err) {
      console.log("ERR", err);
    }
  };

  useEffect(() => {
    fetchKategoriBarang();
  }, []);

  const handleTambah = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
                    Daftar Barang
                  </h5>
                </div>
              </div>

              <div className="row gy-4">
                <CardKategoriBarang dataKategori={kategoriBarang} />
              </div>
            </div>
          </div>
        </AnimatePage>
      </div>
    </Layout>
  );
};

export default Index;