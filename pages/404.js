import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ssURL } from "../client/clientAxios";
import Layout from "../components/Layout/Layout";
import AnimatePage from "../components/Shared/AnimatePage/AnimatePage";
import useUser from "../hooks/useUser";

function index() {
  const { user } = useUser();
  const router = useRouter();
  return (
    <Layout isCenteredPage>
      <AnimatePage>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <img
              src="/img/404-illustration.png"
              alt="404"
              className="img-fluid mt-md-0 mt-5"
            />
          </div>
          <div className="col-md-12 text-center">
            <h1 className="color-dark fw-black mb-4 mt-md-4 mt-5">
              Oops {""}
              {user?.role == "siswa" ? "kamu" : "anda"} keluar dari sekolah
            </h1>
            <p className="fs-5 color-secondary fw-semibold mb-4">
              Yuk klik tombol dibawah untuk kembali ke sekolah
            </p>
            <div className="text-center d-flex justify-content-center">
              <Link href={`${ssURL}`}>
                <a
                  className="btn btn-ss p-0 btn-primary-ss shadow-primary-ss rounded-pill d-flex justify-content-center align-items-center fs-18-ss fw-bold"
                  style={{ width: "168px" }}
                >
                  Kembali
                </a>
              </Link>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
}

export default index;
