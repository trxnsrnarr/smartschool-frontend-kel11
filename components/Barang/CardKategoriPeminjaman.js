// components/Peminjaman/CardKategoriPeminjaman.jsx

import Link from "next/link";
import React from "react";

const CardKategoriPeminjaman = ({ dataKategori }) => {
  return (
    <>
      {dataKategori.map((kategori, index) => (
        <div className="col-md-6" key={index}>
          <div
            className="bg-white p-4 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-between"
            style={{
              borderRadius: "26px",
              overflow: "hidden",
            }}
          >
            <div
              className="p-4 text-white d-flex flex-column justify-content-between"
              style={{
                backgroundImage: `url(${kategori.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "10px",
                height: "210px",
              }}
            >
              <div>
                <h6 className="fw-bold p-1 mb-1">{kategori.nama}</h6>
                <p className="opacity-75 p-1 mb-3">{kategori.deskripsi}</p>
              </div>
            </div>

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
              <Link href={`/smartschool/peminjaman/${kategori.slug}`}>
                <span
                  className="fw-bold text-primary"
                  style={{ cursor: "pointer", fontSize: "14px" }}
                >
                  Lihat Peminjaman
                </span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardKategoriPeminjaman;
