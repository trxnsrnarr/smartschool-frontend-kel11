import { useEffect, useState } from "react";
import styles from "./ModalTambahPeminjaman.module.css";
import { axiosInstance as clientAxios } from "../../client/clientAxios";
import toast from "react-hot-toast";
import moment from "moment";
import UploadPhoto from "../Shared/UploadPhoto.js/UploadPhoto";

const FormTambahPeminjaman = ({ onCancel }) => {
  const [selectedKategoriId, setSelectedKategoriId] = useState("");
  const [semuaBarang, setSemuaBarang] = useState([]);
  const [semuaKategori, setSemuaKategori] = useState([]);
  const [semuaJurusan, setSemuaJurusan] = useState([]);
  const [selectedJurusanId, setSelectedJurusanId] = useState(null);
  const [userJurusanId, setUserJurusanId] = useState(null);

  const [namaBarang, setNamaBarang] = useState("");
  const [kodeOptions, setKodeOptions] = useState([]);
  const [kodeBarang, setKodeBarang] = useState("");
  const [merk, setMerk] = useState("");
  const [spesifikasi, setSpesifikasi] = useState("");
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [sanksi, setSanksi] = useState("");
  const [fotoPinjamUrl, setFotoPinjamUrl] = useState("");
  const [fotoKembaliUrl, setFotoKembaliUrl] = useState("");
  const [durasiJam, setDurasiJam] = useState(0);
  const [loading, setLoading] = useState(false);

  const isKategoriJurusan = () => {
    const selectedKategori = semuaKategori.find(k => k.id === Number(selectedKategoriId));
    return selectedKategori?.nama?.toLowerCase() === "jurusan";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("ss-token")?.replace(/"/g, "");
        const [resBarang, resKategori, resJurusan] = await Promise.all([
          clientAxios.get("/barang", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          clientAxios.get("/kategori-barang", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          clientAxios.get("/jurusan-barang", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSemuaBarang(resBarang.data?.barang?.data || []);
        setSemuaKategori(resKategori.data?.data || resKategori.data || []);
        setSemuaJurusan(resJurusan.data?.data || resJurusan.data || []);
      } catch (err) {
        console.error("❌ Gagal fetch data:", err);
        toast.error("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("ss-token")?.replace(/"/g, "");
        const res = await clientAxios.get("/profil", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const jurusanId = res.data?.user?.m_jurusan_barang_id;
        if (jurusanId) {
          setUserJurusanId(jurusanId);
          setSelectedJurusanId(jurusanId);
        }
      } catch (err) {
        console.error("❌ Gagal ambil profil:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const getBarangFiltered = () => {
    const filtered = semuaBarang.filter((b) => {
      const kategoriCocok = Number(b.m_kategori_barang_id) === Number(selectedKategoriId);
      const jurusanCocok =
        selectedJurusanId === null || Number(b.kategori_barang) === Number(selectedJurusanId);
      const statusCocok = b.status?.toLowerCase() === "tersedia";
      return kategoriCocok && jurusanCocok && statusCocok;
    });

    console.log("🟢 DEBUG - selectedKategoriId:", selectedKategoriId);
    console.log("🟢 DEBUG - selectedJurusanId:", selectedJurusanId);
    console.log("🟢 DEBUG - semuaBarang:", semuaBarang);
    console.log("🟢 DEBUG - filteredBarang:", filtered);

    return filtered;
  };

  const namaOptions = [...new Set(getBarangFiltered().map((b) => b.nama))];

  useEffect(() => {
    setNamaBarang("");
    setKodeBarang("");
    setKodeOptions([]);
  }, [selectedKategoriId, selectedJurusanId]);

  const handleNamaBarangChange = (e) => {
    const nama = e.target.value;
    setNamaBarang(nama);
    const filtered = getBarangFiltered().filter((b) => b.nama === nama);
    setKodeOptions(filtered.map((b) => b.kode_barang));
    if (filtered.length > 0) {
      const item = filtered[0];
      setKodeBarang(item.kode_barang || "");
      setMerk(item.merk || "");
      setSpesifikasi(item.spesifikasi || "");
      setSanksi(item.sanksi || "");
      setDurasiJam(item.waktu_peminjaman || 72);
    } else {
      setKodeBarang("");
      setMerk("");
      setSpesifikasi("");
      setSanksi("");
      setDurasiJam(72);
    }
  };

  const handleTanggalPinjamChange = (e) => {
    const value = e.target.value;
    setTanggalPinjam(value);
    if (value && durasiJam) {
      const kembali = moment(value)
        .add(durasiJam, "hours")
        .format("YYYY-MM-DDTHH:mm");
      setTanggalKembali(kembali);
    } else {
      setTanggalKembali("");
    }
  };

  const handleKategoriChange = (e) => {
    const val = e.target.value;
    setSelectedKategoriId(val);

    const kategoriTerpilih = semuaKategori.find(k => k.id === Number(val));
    if (kategoriTerpilih?.nama?.toLowerCase() === "jurusan") {
      if (userJurusanId) {
        setSelectedJurusanId(userJurusanId);
      }
    } else {
      setSelectedJurusanId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedKategoriId || !namaBarang || !kodeBarang || !tanggalPinjam || !fotoPinjamUrl) {
      return toast.error("Harap lengkapi semua data wajib.");
    }
    try {
      toast.loading("Menyimpan data...");
      const token = localStorage.getItem("ss-token")?.replace(/"/g, "");
      const payload = {
        m_kategori_barang_id: selectedKategoriId,
        m_jurusan_barang_id: selectedJurusanId,
        nama_barang: namaBarang,
        kode_barang: kodeBarang,
        merk,
        spesifikasi,
        tanggal_peminjaman: tanggalPinjam,
        waktu_peminjaman: durasiJam, // <- tambahkan ini
        sanksi,
        foto_peminjaman: fotoPinjamUrl,
        foto_pengembalian: fotoKembaliUrl,
      };
      const res = await clientAxios.post("/peminjaman", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.dismiss();
      toast.success(res.data?.message || "Peminjaman berhasil ditambahkan");
      setTimeout(() => {
        window.location.reload();
      }, 1000); // kasih delay 1 detik biar toasnya kebaca dulu

    } catch (err) {
      toast.dismiss();
      toast.error(err?.response?.data?.message || "Terjadi kesalahan saat mengirim data.");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Memuat data...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <UploadPhoto
          name="fotoPinjam"
          id="uploadFotoPinjam"
          label="Foto Peminjaman"
          col="col-md-6"
          titleUnggahan="Foto"
          titleRasio="1:1"
          isSarpras
          listPhoto={fotoPinjamUrl ? [fotoPinjamUrl] : []}
          onChange={(e, uploadedFile) => setFotoPinjamUrl(uploadedFile)}
        />

        <table
        />

        <div>
          <label className={styles.label}>Jenis Peminjaman</label>
          <select
            className={styles.select}
            onChange={handleKategoriChange}
            value={selectedKategoriId}
            required
          >
            <option value="">Pilih Jenis Peminjaman</option>
            {semuaKategori.map((kategori) => (
              <option key={kategori.id} value={kategori.id}>
                {kategori.nama}
              </option>
            ))}
          </select>
        </div>

        {isKategoriJurusan() && (
          <div>
            <label className={styles.label}>Jurusan</label>
            <select
              className={styles.select}
              value={selectedJurusanId ?? ""}
              onChange={(e) => setSelectedJurusanId(e.target.value)}
              required
            >
              <option value="">Pilih Jurusan</option>
              {semuaJurusan
                .filter((jrs) => jrs.id === Number(userJurusanId))
                .map((jrs) => (
                  <option key={jrs.id} value={jrs.id}>
                    {jrs.nama}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div>
          <label className={styles.label}>Nama Barang</label>
          <select
            className={styles.select}
            disabled={!selectedKategoriId}
            value={namaBarang}
            onChange={handleNamaBarangChange}
            required
          >
            <option value="">Pilih Nama Barang</option>
            {namaOptions.map((nama, i) => (
              <option key={i} value={nama}>
                {nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.label}>Kode Barang</label>
          <select
            className={styles.select}
            disabled={!namaBarang}
            value={kodeBarang}
            onChange={(e) => setKodeBarang(e.target.value)}
            required
          >
            <option value="">Pilih Kode Barang</option>
            {kodeOptions.map((kode, i) => (
              <option key={i} value={kode}>
                {kode}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={styles.label}>Merk</label>
          <input type="text" className={styles.input} value={merk} disabled />
        </div>

        <div>
          <label className={styles.label}>Spesifikasi</label>
          <input
            type="text"
            className={styles.input}
            placeholder="isi sesuai keadaan alat saat dipinjam"
            onChange={(e) => setSpesifikasi(e.target.value)}
          />
        </div>

        <div>
          <label className={styles.label}>Tanggal Peminjaman</label>
          <input
            type="datetime-local"
            className={styles.input}
            value={tanggalPinjam}
            onChange={handleTanggalPinjamChange}
            disabled={!selectedKategoriId}
            required
          />
        </div>

        <div>
          <label className={styles.label}>Tanggal Pengembalian</label>
          <input 
            type="datetime-local" 
            className={styles.input} 
            value={tanggalKembali} 
            disabled 
          />
        </div>

        <div>
          <label className={styles.label}>Sanksi</label>
          <input type="text" className={styles.input} value={sanksi} disabled />
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnCancel}`}
          onClick={onCancel}
        >
          Batal
        </button>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={!selectedKategoriId || !fotoPinjamUrl}
        >
          + Tambah Peminjaman
        </button>
      </div>
    </form>
  );
};

export default FormTambahPeminjaman;