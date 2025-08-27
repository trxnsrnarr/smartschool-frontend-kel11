import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import NewModal from "../Shared/NewModal/NewModal";
import ReactiveButton from "reactive-button";
import TextareaAutosize from "react-textarea-autosize";
import { hideModal } from "../../utilities/ModalUtils";
import { axiosInstance as clientAxios } from "../../client/clientAxios";

const initialForm = {
  nama: "",
  slug: "",
  deskripsi: "",
  jenis_kolom: "",
  link: "",
  image: "/img/kategori-jurusan.jpg",
};

const ModalTambahKategori = ({ onCloseModal, refreshData, editData, setEditData }) => {
  const [formData, setFormData] = useState(initialForm);
  const [buttonState, setButtonState] = useState("idle");

  useEffect(() => {
    if (editData) {
      setFormData({
        nama: editData.nama || "",
        slug: editData.slug || "",
        deskripsi: editData.deskripsi || "",
        jenis_kolom: editData.jenis_kolom || "",
        link: editData.link || "",
        image: editData.image || "/img/kategori-jurusan.jpg",
      });
    } else {
      setFormData(initialForm);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "jenis_kolom") {
      // Otomatis set slug berdasarkan jenis kolom
      const slugMap = {
        "barang-umum": "barang-umum",
        "barang-jurusan": "barang-jurusan"
      };
      
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: slugMap[value] || ""
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.nama || !formData.slug || !formData.deskripsi || !formData.jenis_kolom || !formData.link) {
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
        nama: formData.nama,
        slug: formData.slug,
        deskripsi: formData.deskripsi,
        jenis_kolom: formData.jenis_kolom,
        link: formData.link,
        image: "/img/kategori-jurusan.jpg",
        m_sekolah_id,
      };

      console.log("Payload yang dikirim:", payload);

      if (editData) {
        await clientAxios.put(`/kategori-barang/${editData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Kategori berhasil diperbarui");
      } else {
        await clientAxios.post("/kategori-barang", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Kategori berhasil ditambahkan");
      }

      setButtonState("success");
      setFormData(initialForm);
      setEditData && setEditData(null);
      hideModal("ModalTambahKategori");
      
      if (refreshData) {
        refreshData();
      }
      
      onCloseModal?.();
      
    } catch (err) {
      console.error("Error simpan kategori:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Gagal menyimpan data.");
      setButtonState("error");
    }
  };

  const handleClose = () => {
    setEditData && setEditData(null);
    onCloseModal?.();
  };

  return (
    <NewModal
      modalId="ModalTambahKategori"
      modalSize="lg"
      show={true}
      title={
        <>
          <h4 className="mb-1 fw-bold">
            {editData ? "Edit Kategori Barang" : "Tambah Kategori Barang"}
          </h4>
          <span className="fs-6 fw-normal">
            {editData
              ? "Ubah data kategori barang yang sudah ada"
              : "Isi data untuk menambahkan kategori barang baru"}
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
                placeholder="Contoh: Barang Umum"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Jenis Kolom</label>
              <select
                name="jenis_kolom"
                className="form-select"
                value={formData.jenis_kolom}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jenis Kolom</option>
                <option value="barang-umum">Barang Umum</option>
                <option value="barang-jurusan">Barang Jurusan</option>
              </select>
            </div>
          </div>

          <div className="row gy-4 mb-4">
            <div className="col-md-6">
              <label className="form-label">Slug</label>
              <input
                className="form-control"
                placeholder="Slug otomatis terisi"
                name="slug"
                value={formData.slug}
                readOnly
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Link</label>
              <input
                className="form-control"
                placeholder="Contoh: /smartschool/barang-umum"
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Deskripsi</label>
            <TextareaAutosize
              minRows={3}
              className="form-control"
              placeholder="Tuliskan deskripsi kategori barang"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
            />
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={handleSubmit}
          color="primary"
          idleText={editData ? "Simpan Perubahan" : "Tambah"}
          loadingText="Diproses"
          successText="Berhasil"
          errorText="Gagal"
          type="button"
          className="btn btn-primary"
        />
      }
    />
  );
};

export default ModalTambahKategori;