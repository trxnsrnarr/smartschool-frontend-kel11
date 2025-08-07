import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const SideNavBarang = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  return (
    <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 py-4 flex-column">
      <li className="nav-item">
        <Link href={`/smartschool/barang`}>
          <a
            className={`nav-link ${
                ["/smartschool/barang", "/smartschool/barang-umum", "/smartschool/barang-jurusan", "/smartschool/barang-jurusan/${slug}"].includes(activeMenu) && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
            >
            <img src={`/img/icon-barang.svg`} alt="" className="me-2" />
            Barang
            </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`/smartschool/peminjaman`}>
          <a
            className={`nav-link ${
              ["/smartschool/peminjaman", "/smartschool/peminjaman/barang-umum", "/smartschool/peminjaman/barang-jurusan", "/smartschool/peminjaman/barang-jurusan/${jurusan.slug}"].includes(activeMenu) && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
          >
            <img src={`/img/icon-peminjaman.svg`} alt="" className="me-2" />
            Peminjaman
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default SideNavBarang;
