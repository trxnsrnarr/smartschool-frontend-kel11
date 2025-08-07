import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import NewModal from "../Shared/NewModal/NewModal";
import ReactiveButton from "reactive-button";
import TextareaAutosize from "react-textarea-autosize";
import { axiosInstance as clientAxios } from "../../client/clientAxios";

const initialForm = {
  nama: "",
  slug: "",
  deskripsi: "",
  jenis_kolom: "",
  link: "",
  image: "/img/kategori-jurusan.jpg",
};

const ModalTambahTambah = ({ onCloseModal, refreshData }) => {
  const [formData, setFormData] = useState(initialForm);
  const [buttonState, setButtonState] = useState("idle");

  useEffect(() => {
    setFormData(initialForm);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { nama, slug, deskripsi, jenis_kolom, link } = formData;
    if (!nama || !slug || !deskripsi || !jenis_kolom || !link) {
      toast.error("Semua field harus diisi");
      return;
    }

    setButtonState("loading");
    const token = localStorage.getItem("ss-token")?.replaceAll('"', "");

    try {
      const resProfil = await clientAxios.get("/profil", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const m_sekolah_id = resProfil.data?.user?.m_sekolah_id;
      if (!m_sekolah_id) {
        toast.error("ID sekolah tidak ditemukan");
        setButtonState("error");
        return;
      }

      const payload = {
        nama,
        slug,
        deskripsi,
        jenis_kolom,
        link,
        image: "/img/kategori-jurusan.jpg",
        m_sekolah_id,
      };

      await clientAxios.post("/jurusan-barang", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Kategori berhasil ditambahkan");
      setButtonState("success");
      setFormData(initialForm);
      onCloseModal?.();
      refreshData?.();
    } catch (err) {
      console.error("Error simpan jurusan:", err);
      toast.error("Gagal menyimpan data.");
      setButtonState("error");
    }
  };

  const handleClose = () => {
    onCloseModal?.();
  };

  return (
    <NewModal
      modalId="ModalTambahJurusan"
      modalSize="lg"
      show={true}
      title={
        <>
          <h4 className="mb-1 fw-bold">Tambah Kategori Jurusan</h4>
          <span className="fs-6 fw-normal">
            Isi data untuk menambahkan kategori jurusan baru
          </span>
        </>
      }
      onCloseModal={handleClose}
      content={
        <>
          <div className="row gy-4 mb-4">
            <div className="col-md-6">
              <label className="form-label">Nama Kategori</label>
              <input
                className="form-control"
                placeholder="Contoh: Umum"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Slug</label>
              <input
                className="form-control"
                placeholder="Contoh: barang-umum"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Deskripsi</label>
            <TextareaAutosize
              minRows={3}
              className="form-control"
              placeholder="Tuliskan deskripsi kategori jurusan"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Jenis Kolom</label>
            <select
              name="jenis_kolom"
              className="form-select"
              value={formData.jenis_kolom}
              onChange={handleChange}
            >
              <option value="">Pilih Jenis Kolom</option>
              <option value="barang-umum">Barang Umum</option>
              <option value="barang-jurusan">Barang Jurusan</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Link</label>
            <input
              className="form-control"
              placeholder="Contoh: /smartschool/barang-umum"
              name="link"
              value={formData.link}
              onChange={handleChange}
            />
          </div>
        </>
      }
      submitButton={
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-secondary me-3"
            onClick={handleClose}
          >
            Batal
          </button>
          <ReactiveButton
            buttonState={buttonState}
            onClick={handleSubmit}
            color="primary"
            idleText="Tambah"
            loadingText="Diproses"
            successText="Berhasil"
            errorText="Gagal"
            type="button"
            className="btn btn-primary"
          />
        </div>
      }
    />
  );
};

export default ModalTambahTambah;
