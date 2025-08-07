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
  link: "",
  image: "/img/kategori-jurusan.jpg",
};

const ModalTambahJurusan = ({ onCloseModal, refreshData, editData, setEditData }) => {
  const [formData, setFormData] = useState(initialForm);
  const [buttonState, setButtonState] = useState("idle");

  useEffect(() => {
    if (editData) {
      setFormData({
        nama: editData.nama || "",
        slug: editData.slug || "",
        deskripsi: editData.deskripsi || "",
        link: editData.link || "",
        image: editData.image || "/img/kategori-jurusan.jpg",
      });
    } else {
      setFormData(initialForm);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nama || !formData.slug || !formData.deskripsi || !formData.link) {
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
        link: formData.link,
        image: "/img/kategori-jurusan.jpg",
        m_sekolah_id,
      };

      if (editData) {
        await clientAxios.put(`/jurusan-barang/${editData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Kategori berhasil diperbarui");
      } else {
        await clientAxios.post("/jurusan-barang", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Kategori berhasil ditambahkan");
      }

      setButtonState("success");
      setFormData(initialForm);
      setEditData(null);
      hideModal("ModalTambahJurusan");
      onCloseModal?.();
      refreshData?.();
    } catch (err) {
      console.error("Error simpan jurusan:", err);
      toast.error("Gagal menyimpan data.");
      setButtonState("error");
    }
  };

  return (
    <NewModal
      modalId="ModalTambahJurusan"
      modalSize="lg"
      show={true}
      title={
        <>
          <h4 className="mb-1 fw-bold">
            {editData ? "Edit Kategori Jurusan" : "Tambah Kategori Jurusan"}
          </h4>
          <span className="fs-6 fw-normal">
            {editData
              ? "Ubah data kategori jurusan yang sudah ada"
              : "Isi data untuk menambahkan kategori jurusan baru"}
          </span>
        </>
      }
      onCloseModal={onCloseModal}
      content={
        <>
          <div className="row gy-4 mb-4">
            <div className="col-md-6">
              <label className="form-label">Nama Jurusan</label>
              <input
                className="form-control"
                placeholder="Contoh: SIJA"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Slug</label>
              <input
                className="form-control"
                placeholder="Contoh: sija"
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
            <label className="form-label">Link</label>
            <input
              className="form-control"
              placeholder="Contoh: /smartschool/barang-jurusan/sija"
              name="link"
              value={formData.link}
              onChange={handleChange}
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

export default ModalTambahJurusan;