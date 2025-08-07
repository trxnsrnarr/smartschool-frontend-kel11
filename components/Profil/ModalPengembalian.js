// ModalPengembalian.js
import FormPengembalian from "./FormPengembalian";
import styles from "./ModalTambahPeminjaman.module.css";

const ModalPengembalian = ({ show, barang, onClose }) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>x</button>
        <div className={styles.header}>
          <h4>Tambah Pengembalian</h4>
          <p>Isi informasi dibawah untuk mengembalikan Peminjaman</p>
        </div>
        <div className={styles.body}>
          <FormPengembalian barang={barang} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ModalPengembalian;
