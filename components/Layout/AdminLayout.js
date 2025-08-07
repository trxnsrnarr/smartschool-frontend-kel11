import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../Shared/Header/Header";
import { axiosInstance } from "../../client/clientAxios";
import AdminHeader from "../Shared/Header/AdminHeader";

const AdminLayout = ({ children }) => {
  const router = useRouter();

  const [userProfil, setUserProfil] = useState([]);

  const getProfil = async () => {
    const token = JSON.parse(localStorage.getItem("ss-token"));

    const res = await axiosInstance.get(`/profil`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUserProfil(res.data);

    if (res.data.role != "superadmin") {
    }
  };

  useEffect(() => {
    getProfil();
  }, []);

  return (
    <>
      <AdminHeader />
      <main className="bg-light">
        <div className="container py-3">{children}</div>
      </main>
      <footer className="bg-light">
        <div className="container py-3 text-center">
          <small>
            &copy;Smarteschool {new Date().getFullYear()}. Hak Cipta Dilindungi
            oleh Undang-undang.
            <br />
            <a
              href="https://smarteschool.id"
              target="_blank"
              rel="noreferrer noopener"
              className="text-decoration-none"
            >
              Powered by Smarteschool.
            </a>
          </small>
        </div>
      </footer>
    </>
  );
};

export default AdminLayout;
