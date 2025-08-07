// ModalTambahPeminjaman.js
import FormTambahPeminjaman from "./FormTambahPeminjaman";
import styles from "./ModalTambahPeminjaman.module.css";

const ModalTambahPeminjaman = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>x</button>
        <div className={styles.header}>
          <h4>Tambah Peminjaman</h4>
          <p>Isi informasi dibawah untuk menambahkan Peminjaman</p>
        </div>
        <div className={styles.body}>
          <FormTambahPeminjaman onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ModalTambahPeminjaman;
