import { DatePicker, InputNumber } from "antd";
import useSekolah from "hooks/useSekolah";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { postBarang, updateBarang } from "../../client/BarangClient";
import { getSarana } from "../../client/SaranaPrasaranaClient";
import { hideModal } from "../../utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";
import SelectShared from "../Shared/SelectShared/SelectShared";
import UploadPhoto from "../Shared/UploadPhoto.js/UploadPhoto";
import moment from "moment";

const initialFormData = {
  nama: "",
  kodeBarang: "",
  merk: "",
  tahunBeli: null,
  harga: "",
  spesifikasi: "",
  deskripsi: "",
  status: "",
  waktu_peminjaman: null,
  sanksi: "",
  mLokasiId: null,
  foto: "",
  mSekolahId: null,
};

const ModalTambahBarang = ({ show, editData = null, setEditData, _getBarang, onCloseModal }) => {
  const { sekolah } = useSekolah();
  const isEdit = editData !== null;
  const [buttonState, setButtonState] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);
  const [listLokasi, setListLokasi] = useState([]);
  const [kategoriBarangId, setKategoriBarangId] = useState(null);
  const [listKategoriBarang, setListKategoriBarang] = useState([]);

  const handleChangeInput = (e, uploadedFile) => {
    const name = e.target.name;
    const value = uploadedFile || e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeSelect = (e, name) => {
    setFormData({ ...formData, [name]: e.value });
  };

  const handleChangeDatePicker = (date) => {
    setFormData({ ...formData, tahunBeli: date });
  };

  const handleChangeDatePeminjaman = (date) => {
    setFormData({ ...formData, waktu_peminjaman: date });
  };

  const getLokasiData = async (page = 1) => {
    const { data } = await getSarana({ page });
    const tempData = data?.lokasi?.data || [];
    if (data?.lokasi?.lastPage > page) {
      const nextData = await getLokasiData(page + 1);
      return tempData.concat(nextData);
    }
    return tempData;
  };

  const handleSubmit = async () => {
    // Validasi wajib di frontend
    const requiredFields = [
      { field: 'nama', message: 'Nama barang harus diisi' },
      { field: 'kodeBarang', message: 'Kode barang harus diisi' },
      { field: 'merk', message: 'Merk harus diisi' },
      { field: 'tahunBeli', message: 'Tahun pembelian harus diisi' },
      { field: 'harga', message: 'Harga harus diisi' },
      { field: 'spesifikasi', message: 'Spesifikasi harus diisi' },
      { field: 'deskripsi', message: 'Deskripsi harus diisi' },
      { field: 'foto', message: 'Foto barang harus diunggah' },
      { field: 'mLokasiId', message: 'Lokasi harus dipilih' },
    ];

    for (const { field, message } of requiredFields) {
      if (!formData[field]) {
        toast.error(message);
        return;
      }
    }

    if (!kategoriBarangId) {
      toast.error('Kategori barang harus dipilih');
      return;
    }

    try {
      setButtonState('loading');
      
      const payload = {
        kode_barang: formData.kodeBarang,
        nama: formData.nama,
        merk: formData.merk,
        spesifikasi: formData.spesifikasi,
        deskripsi: formData.deskripsi,
        harga: parseInt(formData.harga),
        status: formData.status || 'tersedia',
        waktu_peminjaman: formData.waktu_peminjaman ? parseInt(formData.waktu_peminjaman) : null,
        sanksi: formData.sanksi || '',
        m_lokasi_id: parseInt(formData.mLokasiId),
        m_kategori_barang_id: parseInt(kategoriBarangId),
        foto: formData.foto,
        tanggal_dibeli: formData.tahunBeli.format('YYYY-MM-DD')
      };

      const { data, error } = isEdit 
        ? await updateBarang(editData.id, payload)
        : await postBarang(payload);

      if (error) throw new Error(error.message);

      toast.success(data.message);
      setButtonState('success');
      window.location.reload(); 
      
      // Reset form dan refresh data
      setFormData(initialFormData);
      setKategoriBarangId(null);
      onCloseModal();
      _getBarang();

    } catch (error) {
      setButtonState('error');
      toast.error(error.message || 'Gagal menyimpan data barang');
      console.error('Submit error:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const lokasi = await getLokasiData();
      if (lokasi?.length > 0) {
        const newLokasi = lokasi.map((lo) => ({ value: lo.id, label: lo.nama }));
        setListLokasi(newLokasi);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchKategoriList = async () => {
      try {
        const res = await fetch("http://localhost:3333/kategori-barang");
        const data = await res.json();

        if (Array.isArray(data)) {
          const options = data.map((kategori) => ({
            value: kategori.id,
            label: kategori.nama,
          }));
          setListKategoriBarang(options);
        } else {
          toast.error("Gagal ambil daftar kategori");
        }
      } catch (err) {
        console.error("Error ambil kategori:", err);
        toast.error("Gagal fetch kategori barang");
      }
    };

    fetchKategoriList();
  }, []);

  useEffect(() => {
    if (editData !== null) {
      setFormData({
        nama: editData.nama,
        kodeBarang: editData.kode_barang,
        merk: editData.merk,
        tahunBeli: editData.tanggal_dibeli ? moment(editData.tanggal_dibeli) : null,
        harga: editData.harga,
        spesifikasi: editData.spesifikasi || "",
        deskripsi: editData.deskripsi || "",
        status: editData.status || "",
        waktu_peminjaman: editData.waktu_peminjaman || null, 
        sanksi: editData.sanksi || "",
        mLokasiId: editData.m_lokasi_id,
        foto: editData.foto || "",
        mSekolahId: editData.m_sekolah_id || sekolah?.id || null,
      });
      setKategoriBarangId(editData.m_kategori_barang_id || null);
    } else {
      setFormData({ ...initialFormData, mSekolahId: sekolah?.id || null });
    }
  }, [editData]);

  return (
    <NewModal
      show={show}
      onCloseModal={onCloseModal}
      modalId="ModalTambahBarang"
      modalSize="xl"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">{isEdit ? "Ubah" : "Tambah"} Barang</h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {isEdit ? "mengubah" : "menambahkan"} Barang
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <UploadPhoto
              name="foto"
              id="uploadFotoBarang"
              label="Foto Barang"
              col="col-md-3"
              titleUnggahan="Foto"
              titleRasio="1:1"
              isSarpras
              listPhoto={formData.foto ? [formData.foto] : []}
              onChange={(e, uploadedFile) => handleChangeInput(e, uploadedFile)}
            />
          </div>

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
              <DatePicker className="w-100" value={formData.tahunBeli} onChange={handleChangeDatePicker} getPopupContainer={(trigger) => trigger.parentNode} />
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
              <label className="form-label">Harga Barang</label>
              <InputNumber className="form-control w-100" name="harga" value={formData.harga} formatter={(val) => `Rp ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} parser={(val) => val.replace(/Rp\s?|\./g, "")} onChange={(value) => handleChangeInput({ target: { name: "harga", value } })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Id Sekolah</label>
              <input className="form-control" value={sekolah?.id || ""} disabled />
            </div>
          </div>

          <div className="row gy-4 mb-4">
            <div className="col-md-6">
              <label className="form-label"> Id Kategori Barang</label>
              <SelectShared
                placeholder="Pilih Kategori"
                handleChangeSelect={(e) => setKategoriBarangId(e.value)}
                value={kategoriBarangId}
                options={listKategoriBarang}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Lokasi</label>
              <SelectShared placeholder="Pilih Lokasi" handleChangeSelect={(e) => handleChangeSelect(e, "mLokasiId")} value={formData.mLokasiId} options={listLokasi} />
            </div>
          </div>

          <div className="row gy-4 mb-4">
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChangeInput}>
                <option value="">Pilih Status</option>
                <option value="tersedia">Tersedia</option>
                <option value="dipinjam">Dipinjam</option>
                <option value="rusak">Rusak</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Sanksi</label>
              <input className="form-control" name="sanksi" value={formData.sanksi} onChange={handleChangeInput} />
            </div>
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
          type="button"
          className="btn btn-primary"
        />
      }
    />
  );
};

export default ModalTambahBarang;