// components/Peminjaman/FormPengembalian.js
import { useState } from "react";
import styles from "./ModalTambahPeminjaman.module.css";
import UploadPhoto from "../Shared/UploadPhoto.js/UploadPhoto";

const FormPengembalian = ({ barang, onClose }) => {
  const [fotoUrl, setFotoUrl] = useState("");
  const [preview, setPreview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fotoUrl) return;

    const token = localStorage.getItem("ss-token")?.replaceAll('"', "");
    const payload = {
      foto_pengembalian: fotoUrl,
      tanggal_pengembalian: new Date().toISOString(),
    };

    try {
      const res = await fetch(`http://127.0.0.1:3333/peminjaman/${barang.id}/kembalikan`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Barang berhasil dikembalikan!");
        onClose();
        window.location.reload();
      } else {
        alert(`Gagal: ${data.message}`);
      }
    } catch (err) {
      console.error("Error saat mengembalikan:", err);
      alert("Terjadi kesalahan saat mengembalikan barang.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div>
          <label className={styles.label}>Foto Peminjaman</label>
          <img
            src={barang.foto_peminjaman}
            alt="Foto Peminjaman"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>

        <UploadPhoto
          name="fotoPengembalian"
          id="uploadFotoPengembalian"
          label="Foto Pengembalian"
          col="col-md-6"
          titleUnggahan="Foto"
          titleRasio="1:1"
          isSarpras
          listPhoto={preview ? [preview] : []}
          onChange={(e, uploadedFile) => {
            setFotoUrl(uploadedFile);
            setPreview(uploadedFile);
          }}
        />

        {/* Informasi Barang */}
        <div>
          <label className={styles.label}>Nama Barang</label>
          <input className={styles.input} value={barang.nama_barang} disabled />
        </div>
        <div>
          <label className={styles.label}>Kode Barang</label>
          <input className={styles.input} value={barang.kode_barang} disabled />
        </div>
        <div>
          <label className={styles.label}>Merk</label>
          <input className={styles.input} value={barang.merk || "-"} disabled />
        </div>
        <div>
          <label className={styles.label}>Spesifikasi</label>
          <input className={styles.input} value={barang.deskripsi || barang.spesifikasi || "-"} disabled />
        </div>
        <div>
          <label className={styles.label}>Tanggal Peminjaman</label>
          <input className={styles.input} value={barang.tanggal_peminjaman || "-"} disabled />
        </div>
        <div>
          <label className={styles.label}>Tanggal Pengembalian</label>
          <input className={styles.input} value={new Date().toLocaleDateString("id-ID")} disabled />
        </div>
        <div>
          <label className={styles.label}>Jenis Peminjaman</label>
          <input className={styles.input} value={barang.nama_kategori || "-"} disabled />
        </div>
        <div>
          <label className={styles.label}>Sanksi</label>
          <input className={styles.input} value={barang.sanksi || "Tidak ada"} disabled />
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnCancel}`}
          onClick={onClose}
        >
          Batal
        </button>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={!fotoUrl}
        >
          Kembalikan
        </button>
      </div>
    </form>
  );
};

export default FormPengembalian;