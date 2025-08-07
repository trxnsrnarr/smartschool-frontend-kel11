import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { FaEllipsisH, FaEdit, FaTrash } from "react-icons/fa";

const CardJurusanBarang = ({ jurusan, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="col-md-6">
      <div
        className="bg-white p-4 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-between"
        style={{
          borderRadius: "26px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          className="p-4 text-white d-flex flex-column justify-content-between"
          style={{
            backgroundImage: `url(${jurusan.image || "/img/bg-default.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "10px",
            height: "210px",
            position: "relative",
          }}
        >
          {/* Tombol titik tiga */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              cursor: "pointer",
              zIndex: 2,
              backgroundColor: "white",
              borderRadius: "40%",
              width: "30px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
            }}
            onClick={() => setOpen(!open)}
          >
            <FaEllipsisH size={18} color="#3A4166" />
          </div>

          {/* Dropdown */}
          {open && (
            <div
              ref={menuRef}
              className="position-absolute bg-white p-2 rounded shadow"
              style={{
                top: 52,
                right: 12,
                zIndex: 10,
                width: "140px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div
                className="d-flex align-items-center mb-2"
                style={{ cursor: "pointer", color: "#6c757d" }}
                onClick={() => {
                  onEdit && onEdit(jurusan);
                  setOpen(false);
                }}
              >
                <FaEdit className="me-2" /> Edit
              </div>
              <div
                className="d-flex align-items-center"
                style={{ cursor: "pointer", color: "red" }}
                onClick={() => {
                  onDelete && onDelete(jurusan);
                  setOpen(false);
                }}
              >
                <FaTrash className="me-2" /> Hapus
              </div>
            </div>
          )}

          {/* Info Jurusan */}
          <div>
            <h6 className="fw-bold p-1 mb-1">{jurusan.nama}</h6>
            <p className="opacity-75 p-1 mb-3">
              {jurusan.deskripsi || "-"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="d-flex align-items-center p-3 gap-2">
          <div
            style={{
              backgroundColor: "#007BFF",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              color: "white",
            }}
          >
            +
          </div>
          <Link href={`/smartschool/barang-jurusan/${jurusan.slug}`}>
            <span
              className="fw-bold text-primary"
              style={{ cursor: "pointer", fontSize: "14px" }}
            >
              Lihat Barang
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardJurusanBarang;