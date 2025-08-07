import React, { useEffect } from "react";
import styles from "./NewModal.module.css";
import { FaPlus } from "react-icons/fa";

const NewModal = ({
  title,
  content,
  submitButton,
  aksiButton,
  onCloseModal,
  show = false,
  modalSize = "lg",
  removeFooter = false,
  leftButton,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onCloseModal?.();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeaderBlue}>
          <div className={styles.modalTitle}>{title}</div>
          <button onClick={onCloseModal} className={styles.closeBtn}>
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>{content}</div>

        {!removeFooter && (
          <div className={styles.modalFooter}>
            <div className={styles.left}>{leftButton}</div>
            <div className={styles.right}>
              {aksiButton}
              <button className={styles.btnCancel} onClick={onCloseModal}>
                Batal
              </button>
              <button className={styles.btnSubmit} onClick={submitButton?.props?.onClick}>
                <FaPlus className={styles.iconPlus} />
                Tambah
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewModal;