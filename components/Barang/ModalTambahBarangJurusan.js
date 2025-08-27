import { DatePicker, InputNumber } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import UploadPhoto from "../Shared/UploadPhoto.js/UploadPhoto";
import SelectShared from "../Shared/SelectShared/SelectShared";
import NewModal from "../Shared/NewModal/NewModal";
import useSekolah from "hooks/useSekolah";
import { getSarana } from "../../client/SaranaPrasaranaClient";
import { postBarangSafe as postBarang, updateBarang } from "../../client/BarangClient";
import { axiosInstance as clientAxios } from "../../client/clientAxios";
import moment from "moment";
import Select from "react-select";
import { useRouter } from "next/router";

const initialFormData = {
  nama: "",
  kodeBarang: "",
  merk: "",
  tahunBeli: null,
  harga: "",
  spesifikasi: "",
  deskripsi: "",
  status: "",
  kategori_barang: "",
  m_kategori_barang_id: 2, // ⬅️ static ID kategori jurusan
  waktu_peminjaman: null,
  sanksi: "",
  mLokasiId: null,
  foto: "",
  namaPemilik: "",
  mSekolahId: null,
};

const ModalTambahBarangJurusan = ({ show, editData = null, setEditData, _getBarang, onCloseModal }) => {
  const { sekolah } = useSekolah();
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");
  const [listLokasi, setListLokasi] = useState([]);
  const [listKategori, setListKategori] = useState([]);
  const isEdit = !!editData;

  const handleChangeInput = (e, uploadedFile) => {
    const { name, value } = e?.target || {};
    setFormData((p) => ({ ...p, [name]: uploadedFile || value || "" }));
  };

  const handleChangeSelect = (e, name) => setFormData((p) => ({ ...p, [name]: e.value }));

  const handleChangeDate = (date, name) => setFormData((p) => ({ ...p, [name]: date }));

  const setupPayload = () => ({
    nama: formData.nama,
    kode_barang: formData.kodeBarang,
    merk: formData.merk,
    tanggal_dibeli: formData.tahunBeli ? moment(formData.tahunBeli).format("YYYY-MM-DD") : null,
    harga: parseInt(formData.harga),
    spesifikasi: formData.spesifikasi,
    deskripsi: formData.deskripsi,
    status: formData.status,
    m_kategori_barang_id: parseInt(formData.m_kategori_barang_id),
    waktu_peminjaman: formData.waktu_peminjaman || null,
    sanksi: formData.sanksi,
    m_lokasi_id: parseInt(formData.mLokasiId),
    foto: formData.foto,
    m_sekolah_id: sekolah?.id || formData.mSekolahId || null,
    kategori_barang: formData.kategori_barang,
  });

  const handleSubmit = async () => {
    const { nama, merk, kodeBarang, tahunBeli, deskripsi, harga, foto, mLokasiId, kategori_barang, m_kategori_barang_id } = formData;

    if (!nama || !merk || !kodeBarang || !tahunBeli || !deskripsi || !harga || !foto || !mLokasiId || !kategori_barang || !m_kategori_barang_id) {
      toast.error("Harap lengkapi data");
      return;
    }

    const payload = setupPayload();

    try {
      setButtonState("loading");

      const result = isEdit
        ? await updateBarang(editData.id, payload)
        : await postBarang(payload);

      const data = result?.data?.data;
      const message = result?.data?.message;
      const error = result?.error;

      if (error || !data?.id) {
        toast.error(error?.message || "Gagal menyimpan");
        setButtonState("error");
        return;
      }

      toast.success(message || (isEdit ? "Barang berhasil diubah" : "Barang berhasil ditambahkan"));
      setButtonState("success");
      router.reload();

      if (!isEdit) {
        setFormData({ ...initialFormData, mSekolahId: sekolah?.id || null });
      }

      setEditData(null);
      onCloseModal?.();
      setTimeout(() => _getBarang?.(), 500);

    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Terjadi kesalahan");
      setButtonState("error");
    }
  };

  const getData = async () => {
    const lokasi = await getSarana().then((res) => res?.data?.lokasi?.data || []);
    setListLokasi(lokasi.map((l) => ({ value: l.id, label: l.nama })));

    const token = localStorage.getItem("ss-token")?.replaceAll('"', "");
    const jurusan = await clientAxios.get("/jurusan-barang", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setListKategori(jurusan?.data?.data || []);
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        nama: editData.nama,
        kodeBarang: editData.kode_barang,
        merk: editData.merk,
        tahunBeli: editData.tanggal_dibeli,
        harga: editData.harga,
        spesifikasi: editData.spesifikasi || "",
        deskripsi: editData.deskripsi,
        status: editData.status || "",
        kategori_barang: editData.kategori_barang || "",
        m_kategori_barang_id: editData.m_kategori_barang_id || 2,
        waktu_peminjaman: editData.waktu_peminjaman || null,
        sanksi: editData.sanksi || "",
        mLokasiId: editData.m_lokasi_id,
        foto: editData.foto || "",
        mSekolahId: editData.m_sekolah_id || sekolah?.id || null,
      });
    } else {
      setFormData({ ...initialFormData, mSekolahId: sekolah?.id || null });
    }
  }, [editData]);

  useEffect(() => {
    getData();
  }, []);

  const mappedKategori = listKategori.map((item) => ({
    value: item.id,
    label: item.nama,
  }));

  return (
    <NewModal
      show={show}
      onCloseModal={onCloseModal}
      modalId="ModalTambahBarangJurusan"
      modalSize="xl"
      title={
        <>
          <h4 className="mb-1 fw-bold">{isEdit ? "Ubah" : "Tambah"} Barang</h4>
          <span className="fs-6 fw-normal">Isi informasi untuk {isEdit ? "mengubah" : "menambahkan"} Barang</span>
        </>
      }
      content={
        <>
          <UploadPhoto
            name="foto"
            id="uploadFotoBarang"
            label="Foto Barang"
            col="col-md-3"
            isSarpras
            titleUnggahan="Foto"
            titleRasio="1:1"
            listPhoto={formData.foto ? [formData.foto] : []}
            onChange={(e, file) => handleChangeInput(e, file)}
          />

          <div className="row gy-4 mb-4">
            <div className="col-md-6">
              <label className="form-label">Nama Barang</label>
              <input className="form-control" name="nama" value={formData.nama} onChange={handleChangeInput} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Kode Barang</label>
              <input className="form-control" name="kodeBarang" value={formData.kodeBarang} onChange={handleChangeInput} />
            </div>
          </div>

          <div className="row gy-4 mb-4">
            <div className="col-md-6">
              <label className="form-label">Merk</label>
              <input className="form-control" name="merk" value={formData.merk} onChange={handleChangeInput} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Spesifikasi</label>
              <TextareaAutosize className="form-control" name="spesifikasi" value={formData.spesifikasi} onChange={handleChangeInput} />
            </div>
          </div>

          <div className="row gy-4 mb-4">
            <div className="col-md-6">
              <label className="form-label">Tanggal Dibeli</label>
                <DatePicker
                  className="w-100"
                  value={formData.tahunBeli ? moment(formData.tahunBeli) : null}
                  onChange={(date) => handleChangeDate(date, "tahunBeli")}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                />
            </div>
            <div className="col-md-6">
              <label className="form-label">Waktu Peminjaman</label>
              <InputNumber
                className="form-control w-100"
                min={1}
                name="waktu_peminjaman"
                value={formData.waktu_peminjaman}
                addonAfter="jam"
                onChange={(value) =>
                  setFormData({ ...formData, waktu_peminjaman: value })
                }
              />
            </div>
          </div>

          <div className="row gy-4 mb-4">
            <div className="col-md-6">
              <label className="form-label">Harga</label>
              <InputNumber
                className="form-control w-100"
                value={formData.harga}
                formatter={(v) => `Rp ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                parser={(v) => v.replace(/Rp\s?|\./g, "")}
                onChange={(v) => handleChangeInput({ target: { name: "harga", value: v } })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">ID Sekolah</label>
              <input className="form-control" value={sekolah?.id || ""} disabled />
            </div>
          </div>

          <div className="row gy-4 mb-4">
            <div className="col-md-6">
              <label className="form-label">Pilih Jurusan</label>
              <Select
                placeholder="Pilih Jurusan"
                value={mappedKategori.find((item) => item.value === formData.kategori_barang) || null}
                options={mappedKategori}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    kategori_barang: e.value,
                  }))
                }
                isSearchable
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Kategori Barang</label>
              <input className="form-control" value="Jurusan" disabled />
              <input type="hidden" name="m_kategori_barang_id" value={formData.m_kategori_barang_id || 2} />
            </div>
          </div>

          <div className="row gy-4 mb-4">
            <div className="col-md-6">
              <label className="form-label">Lokasi</label>
              <SelectShared
                placeholder="Pilih Lokasi"
                value={formData.mLokasiId}
                options={listLokasi}
                handleChangeSelect={(e) => handleChangeSelect(e, "mLokasiId")}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChangeInput}>
                <option value="">Pilih Status</option>
                <option value="tersedia">Tersedia</option>
                <option value="dipinjam">Dipinjam</option>
                <option value="rusak">Rusak</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Sanksi</label>
            <input className="form-control" name="sanksi" value={formData.sanksi} onChange={handleChangeInput} />
          </div>

          <div className="mb-4">
            <label className="form-label">Deskripsi</label>
            <TextareaAutosize className="form-control" name="deskripsi" minRows={4} value={formData.deskripsi} onChange={handleChangeInput} />
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={handleSubmit}
          color="primary"
          idleText={isEdit ? "Ubah" : "Tambah"}
          loadingText="Diproses"
          successText="Berhasil"
          errorText="Gagal"
          className="btn btn-primary"
        />
      }
    />
  );
};

export default ModalTambahBarangJurusan;
