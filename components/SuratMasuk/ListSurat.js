import React from "react";
import { FaPaperclip, FaPen, FaTrashAlt } from "react-icons/fa";
import { getPreviewURL } from "utilities/FileViewer";
import useUser from "../../hooks/useUser";
import { momentPackage } from "../../utilities/HelperUtils";
import Link from "next/link";
import { ssURL } from "client/clientAxios";

const ListSurat = ({
  dataSurat,
  setFormData,
  formData,
  deleteSurat,
  isMasuk,
  teruskanSurat,
}) => {
  const { user } = useUser();
  return (
    <>
      {dataSurat?.length == 0 && (
        <div className="card-body p-4">
          <div className="row justify-content-center">
            <div className="col-md-6 col-sm-8 col-10 text-center">
              <img
                src="/img/empty-state-data.svg"
                alt=""
                className="img-fluid"
              />
            </div>
            <div className="col-md-12 text-center">
              <h4 className="color-dark fw-black mt-4 mb-2">Tidak Ada Data</h4>
            </div>
          </div>
        </div>
      )}
      {dataSurat?.map((d, idx) => {
        const file = JSON.parse(d.file);
        return (
          <div className="row">
            {/* <Link href={linkRedirect + `${d?.id}`}> */}
            <div className={`card card-ss rounded-ss mb-4`}>
              <div className="card-body card-body-ss p-3">
                <div className="d-flex justify-content-between mb-3">
                  <p className="fs-14-ss fw-semibold m-0">
                    {d?.kode} -{" "}
                    {momentPackage(d?.createdAt).format("DD MMMM YYYY")}
                  </p>
                  {/* Dropdown Option Start */}

                  {user?.role == "admin" && (
                    <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                      <div
                        role="button"
                        id="dropdownOption"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img
                          src={`/img/icon-dropdown-option.svg`}
                          alt="icon-option"
                        />
                      </div>
                      <ul
                        className="dropdown-menu dropdown-menu-ss my-1"
                        aria-labelledby="dropdownOption"
                      >
                        <li
                          onClick={() =>
                            setFormData({
                              ...formData,
                              ...d,
                              file: file,
                              tanggal: momentPackage(d.tanggal),
                            })
                          }
                          data-bs-toggle="modal"
                          data-bs-target="#modalTambahSuratMasuk"
                        >
                          <a className="dropdown-item">
                            <FaPen className="me-2" />
                            <span>Edit</span>
                          </a>
                        </li>
                        <li onClick={() => deleteSurat(d?.id)}>
                          <a className="dropdown-item color-danger">
                            <FaTrashAlt className="me-2" />
                            <span>Hapus</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                  {user?.role == "kepsek" && isMasuk && <></>}
                  {/* Dropdown Option End */}
                </div>
                <div
                  className="p-4 mb-3"
                  style={{
                    background: "#F4F4F7",
                  }}
                >
                  <div className="row">
                    <div className="col-md-8 order-md-1 order-2">
                      <table>
                        <tr>
                          <td
                            className="align-text-top"
                            style={{ width: "35%" }}
                          >
                            <p className="mb-1 fs-14-ss color-dark fw-bold">
                              Dari
                            </p>
                          </td>
                          <td
                            className="align-text-top"
                            style={{ width: "5%" }}
                          >
                            <p className="mb-1 fs-14-ss fw-bold color-dark">
                              :
                            </p>
                          </td>
                          <td className="align-text-top">
                            <p className="mb-1 fs-14-ss fw-bold color-dark">
                              {d?.asal || "-"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="align-text-top"
                            style={{ width: "35%" }}
                          >
                            <p className="mb-1 fs-14-ss color-dark fw-bold">
                              Nomor
                            </p>
                          </td>
                          <td
                            className="align-text-top"
                            style={{ width: "5%" }}
                          >
                            <p className="mb-1 fs-14-ss fw-bold color-dark">
                              :
                            </p>
                          </td>
                          <td className="align-text-top">
                            <p className="mb-1 fs-14-ss fw-bold color-dark">
                              {d?.nomor || "-"}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="align-text-top"
                            style={{ width: "35%" }}
                          >
                            <p className="mb-1 fs-14-ss color-dark fw-bold">
                              Tanggal Surat
                            </p>
                          </td>
                          <td
                            className="align-text-top"
                            style={{ width: "5%" }}
                          >
                            <p className="mb-1 fs-14-ss fw-bold color-dark">
                              :
                            </p>
                          </td>
                          <td className="align-text-top">
                            <p className="mb-1 fs-14-ss fw-bold color-dark">
                              {!0 == 0
                                ? `-`
                                : `${momentPackage(d?.tanggal).format(
                                    "DD MMMM YYYY"
                                  )}`}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div className="col-md-4 d-flex justify-content-end align-items-start mb-md-0 mb-3 order-md-2 order-1">
                      <span className="bg-soft-secondary rounded-pill color-secondary fs-12-ss fw-semibold py-1 px-3">
                        {d?.keamanan || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="my-3">
                    <h5 className="fs-18-ss fw-bold color-dark">
                      {d?.perihal || "-"}
                    </h5>
                    <h6
                      className="color-dark text-truncate"
                      dangerouslySetInnerHTML={{ __html: d?.isi }}
                    ></h6>
                  </div>
                  {user?.role == "admin" && (
                    <div
                      className="d-flex align-items-center"
                      onClick={() => window.open(getPreviewURL(file[0]))}
                    >
                      <FaPaperclip color="#2680EB" />
                      <p className="fs-14-ss fw-bold color-primary m-0 ms-2">
                        Lihat File Surat
                      </p>
                    </div>
                  )}
                </div>
                {/* tampilan kepsek */}
                {d?.tipe != "keluar" && (
                  <div className="d-flex justify-content-end">
                    {user?.role == "kepsek" && (
                      <>
                        {d?.disposisi ? (
                          <Link
                            href={`${ssURL}/disposisi/${d?.disposisi?.id}`}
                            as={`${ssURL}/disposisi/${d?.disposisi?.id}`}
                          >
                            <span className="bg-white btn btn-outline-primary-ss rounded-pill color-primary fs-14-ss fw-semibold py-2 px-4 me-2">
                              Lihat Disposisi
                            </span>
                          </Link>
                        ) : (
                          <span
                            className="bg-white btn btn-outline-primary-ss rounded-pill color-primary fs-14-ss fw-semibold py-2 px-4 me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#modalDisposisi"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                mSuratId: d?.id,
                              })
                            }
                          >
                            Disposisi
                          </span>
                        )}
                        <span
                          className="btn btn-ss shadow-primary-ss bg-primary rounded-pill text-white fs-14-ss fw-semibold py-2 px-4 pointer"
                          onClick={() => window.open(getPreviewURL(file[0]))}
                        >
                          Lihat Surat
                        </span>
                      </>
                    )}
                    {user?.role == "admin" && (
                      <>
                        {d?.teruskan ? (
                          <span className="btn btn-ss bg-soft-success rounded-pill color-success fs-14-ss fw-semibold py-2 px-4">
                            Sudah Diteruskan
                          </span>
                        ) : (
                          <span
                            className="btn btn-ss shadow-primary-ss bg-primary rounded-pill text-white fs-14-ss fw-semibold py-2 px-4 pointer"
                            onClick={() => teruskanSurat(d?.id)}
                          >
                            Teruskan Ke Kepsek
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )}
                {/* <div className="d-flex justify-content-end">
                    <span className="btn btn-ss shadow-primary-ss bg-primary rounded-pill text-white fs-14-ss fw-semibold py-2 px-4 pointer">
                      Teruskan ke Kepsek
                    </span>
                  </div> */}
                {/* ketika sudah diteruskan */}
                {/* <div className="d-flex justify-content-end">
                    <span className="bg-soft-success rounded-pill color-success fs-14-ss fw-semibold py-2 px-4">
                      Sudah Diteruskan
                    </span>
                  </div> */}
              </div>
            </div>
            {/* </Link> */}
          </div>
        );
      })}
    </>
  );
};

export default ListSurat;
