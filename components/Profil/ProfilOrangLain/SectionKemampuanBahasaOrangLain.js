import { useState } from "react";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { postProfilUser } from "client/AuthClient";
import useUser from "hooks/useUser";
import { momentPackage } from "utilities/HelperUtils";
import ModalTambahBahasa from ".././ModalTambahBahasa";

const SectionKemampuanBahasaOrangLain = ({
  isReadOnly = false,
  isPPDB,
  data,
}) => {
  const { user } = data || useUser();
  const { setUser } = useUser();
  const [editIndex, setEditIndex] = useState(null);

  const onClickDelete = async (deleteIndex) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const bahasa = [...user.profil.bahasa];
        bahasa.splice(deleteIndex, 1);
        const { data, error } = await postProfilUser({ bahasa: bahasa });
        if (data) {
          toast.success(data?.message);
          setUser({ ...user, profil: { ...user.profil, bahasa: bahasa } });
        } else {
          setButtonState("error");
          toast.error(error?.message);
        }
      }
    });
  };

  return (
    <>
      <div className="card card-ss">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4
              className={`fw-extrabold color-dark mb-0 ${
                isPPDB ? "title-border" : null
              }`}
            >
              Kemampuan Bahasa
            </h4>
            {!isReadOnly && (
              <button
                className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary shadow-primary-ss rounded-pill fs-14-ss fw-bold"
                data-bs-toggle="modal"
                data-bs-target="#modalTambahBahasa"
              >
                <FaPlus className="me-2" />
                Tambah
              </button>
            )}
          </div>
          <ul className="list-group list-group-flush mb-2">
            {user?.profil?.bahasa?.length > 0
              ? user?.profil?.bahasa?.map((bahasa, index) => (
                  <li
                    className="list-group-item pt-0 pb-3 ps-0 pe-0 mb-3"
                    key={`${index}-${new Date().getTime()}`}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={bahasa.bahasa.img}
                        alt="icon-profil-bahasa"
                        height="68px"
                        width="68px"
                        className="rounded-circle"
                      />
                      <div className="d-flex align-items-center justify-content-between ms-3 flex-grow-1">
                        <div className="">
                          <h6 className="fw-extrabold color-dark mb-1">
                            {bahasa.bahasa.name}
                          </h6>
                          <p className="fs-14-ss color-dark fw-semibold mb-0">
                            {bahasa.tingkat}{" "}
                            {bahasa.skor ? `- ${bahasa.skor}` : ""}
                          </p>
                          {bahasa.sertifikat && (
                            <p className="fs-14-ss fw-semibold mb-0">
                              Diterbitkan{" "}
                              {momentPackage(bahasa.tanggalTerbit).format(
                                "MMM YYYY"
                              )}{" "}
                              -
                              {bahasa.tanggalKadaluarsa
                                ? " " +
                                  momentPackage(
                                    bahasa.tanggalKadaluarsa
                                  ).format("MMM YYYY")
                                : " Tidak ada tanggal kadaluarsa"}
                            </p>
                          )}
                          {bahasa.lampiran && (
                            <a
                              href={bahasa.lampiran}
                              target="__blank"
                              className="text-decoration-none color-primary fs-14-ss fw-bold mb-0"
                            >
                              Lihat Sertifikat
                            </a>
                          )}
                        </div>
                        <div className="d-flex align-items-center">
                          {!isReadOnly && (
                            <button
                              type="button"
                              className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center p-2 ms-sm-0 ms-2"
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#modalTambahBahasa"
                              onClick={() => setEditIndex(index)}
                            >
                              <FaPen className="color-secondary fs-5" />
                            </button>
                          )}
                          <button
                            className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer ms-3"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                            onClick={() => onClickDelete(index)}
                          >
                            <FaTrashAlt className="color-secondary" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              : "Belum ada data"}
          </ul>
        </div>
      </div>
      <ModalTambahBahasa editIndex={editIndex} setEditIndex={setEditIndex} />
    </>
  );
};

export default SectionKemampuanBahasaOrangLain;
