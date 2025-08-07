import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { FaEllipsisH, FaEdit, FaTrash } from "react-icons/fa";

const CardJurusanPeminjaman = ({ 
  jurusan = {  // Nilai default jika jurusan undefined
    image: "/img/bg-default.jpg",
    nama: "Jurusan",
    deskripsi: "-",
    slug: "#"
  }, 
  onEdit, 
  onDelete 
}) => {
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
            backgroundImage: `url(${jurusan.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "10px",
            height: "210px",
            position: "relative",
          }}
        >
          {/* Info Jurusan */}
          <div>
            <h6 className="fw-bold p-1 mb-1">{jurusan.nama}</h6>
            <p className="opacity-75 p-1 mb-3">
              {jurusan.deskripsi}
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
          <Link href={`/smartschool/peminjaman/barang-jurusan/${jurusan.slug}`}>
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

export default CardJurusanPeminjaman;