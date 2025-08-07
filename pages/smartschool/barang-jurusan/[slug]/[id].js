import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import { FaChevronLeft, FaTrash, FaEdit } from "react-icons/fa";
import { formatAngkaUang } from "../../../../utilities/HelperUtils";
import moment from "moment";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import swal from "sweetalert";
import toast from "react-hot-toast";
import ModalTambahBarangJurusan from "../../../../components/Barang/ModalTambahBarangJurusan";
import { deleteBarang } from "client/BarangClient";
import { axiosInstance as clientAxios } from "client/clientAxios";

const DetailBarangJurusanPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [editData, setEditData] = useState(null);
  const [currentBarang, setCurrentBarang] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const _getDetailBarang = async () => {
    try {
      const token = localStorage.getItem("ss-token")?.replaceAll('"', "");
      const sekolahId = localStorage.getItem("m_sekolah_id");

      const res = await clientAxios.get(`/barang/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { m_sekolah_id: sekolahId },
      });

      if (res.data) {
        setCurrentBarang(res.data.barang);
      }
    } catch (err) {
      toast.error("Gagal mengambil detail barang.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && id) {
      _getDetailBarang();
    }
  }, [router.isReady, id]);

  const handleClickEdit = (data) => {
    setEditData(data);
  };

  const handleClickDelete = () => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: {
        cancel: { text: "Cancel", visible: true, closeModal: true },
        confirm: { text: "OK", className: "btn-danger rounded-pill px-4" },
      },
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const res = await deleteBarang(currentBarang.id);
        toast.success("Barang berhasil dihapus!");
        router.back();
      }
    });
  };

  if (isLoading || !currentBarang) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <p>Memuat detail barang...</p>
        </div>
      </Layout>
    );
  }

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
                Detail Informasi Barang
              </h4>

              <div className="rounded-ss p-4 mb-4" style={{ background: "#F4F4F7" }}>
                <div className="text-center mb-3">
                  <img
                    src={currentBarang.foto || "/img/default.png"}
                    alt={currentBarang.nama}
                    className="rounded"
                    style={{ height: "150px" }}
                  />
                </div>

                <table className="w-100 mt-5">
                  <tbody>
                    <tr><td>Kode Barang</td><td>:</td><td className="fw-bold">{currentBarang.kode_barang}</td></tr>
                    <tr><td>Nama Barang</td><td>:</td><td className="fw-bold">{currentBarang.nama}</td></tr>
                    <tr><td>Merk</td><td>:</td><td className="fw-bold">{currentBarang.merk}</td></tr>
                    <tr><td>Spesifikasi</td><td>:</td><td className="fw-bold">{currentBarang.spesifikasi}</td></tr>
                    <tr><td>Tanggal Dibeli</td><td>:</td><td className="fw-bold">{moment(currentBarang.tanggal_dibeli).format("DD MMMM YYYY")}</td></tr>
                    <tr><td>Deskripsi</td><td>:</td><td className="fw-bold">{currentBarang.deskripsi}</td></tr>
                    <tr><td>Kategori Barang</td><td>:</td><td className="fw-bold">{currentBarang.kategori_barang}</td></tr>
                    <tr><td>ID Kategori</td><td>:</td><td className="fw-bold">{currentBarang.m_kategori_barang_id}</td></tr>
                    <tr><td>Harga</td><td>:</td><td className="fw-bold">Rp. {formatAngkaUang(currentBarang.harga)}</td></tr>
                    <tr><td>Status</td><td>:</td><td className="fw-bold">{currentBarang.status}</td></tr>
                    <tr><td>Waktu Peminjaman</td><td>:</td><td className="fw-bold">
                      {currentBarang.waktu_peminjaman ? moment(currentBarang.waktu_peminjaman).format("DD MMMM YYYY HH:mm") : "-"}
                    </td></tr>
                    <tr><td>Sanksi</td><td>:</td><td className="fw-bold">{currentBarang.sanksi}</td></tr>
                    <tr><td>ID Lokasi</td><td>:</td><td className="fw-bold">{currentBarang.m_lokasi_id}</td></tr>
                    <tr><td>ID Sekolah</td><td>:</td><td className="fw-bold">{currentBarang.m_sekolah_id}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between flex-wrap gap-2 p-4">
                <button
                  className="btn btn-danger bg-gradient-danger rounded-pill"
                  style={{ width: "180px", height: "50px" }}
                  onClick={handleClickDelete}
                >
                  <FaTrash className="me-2" /> Hapus
                </button>
                <button
                  className="btn btn-primary bg-gradient-primary rounded-pill"
                  style={{ width: "180px", height: "50px" }}
                  data-bs-toggle="modal"
                  data-bs-target="#ModalTambahBarangJurusan"
                  onClick={() => handleClickEdit(currentBarang)}
                >
                  <FaEdit className="me-2" /> Edit
                </button>
                <button 
                  onClick={() => router.back()}
                  className="btn btn-outline-secondary rounded-pill" 
                  style={{ width: "180px", height: "50px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <ModalTambahBarangJurusan
          show={!!editData}
          editData={editData}
          setEditData={setEditData}
          _getBarang={_getDetailBarang}
          onCloseModal={() => setEditData(null)}
        />
      </AnimatePage>
    </Layout>
  );
};

export default DetailBarangJurusanPage;