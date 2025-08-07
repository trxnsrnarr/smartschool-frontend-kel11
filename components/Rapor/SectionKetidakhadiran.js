import { FaPen } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import ModalEditBio from "../Profil/ModalEditBio";
import { postProfilUser } from "../../client/AuthClient";
import useUser from "../../hooks/useUser";
import { useState } from "react";
import toast from "react-hot-toast";
import { hideModal } from "../../utilities/ModalUtils";

const SectionKetidakhadiran = ({
  isReadOnly = false,
  totalAlpa,
  totalIzin,
  totalSakit,
  siswa,
  tingkat,
  sekolah,
}) => {
  return (
    <>
      <div className="card card-ss p-0 pb-4">
        <div className="p-4">
          <h4 className="fw-extrabold color-dark mb-0">
            {sekolah?.id == 578 && tingkat == "XI" ? "E" : "D"}. Ketidakhadiran
          </h4>
          {/* <h4 className="fw-extrabold color-dark mb-0">E. Ketidakhadiran</h4> */}
        </div>
        <div className="table-responsive">
          <table className="table-ss">
            <tbody>
              <tr>
                <td style={{ width: "5%", opacity: "0" }} className="fs-18-ss">
                  No
                </td>
                <td className="table-ketidakhadiran-rapor">
                  <span className="fw-semibold">Sakit</span>
                </td>
                <td>
                  <p className="fw-semibold mb-0 color-dark">
                    {siswa?.sakit} hari
                  </p>
                </td>
              </tr>
              <tr>
                <td style={{ width: "5%", opacity: "0" }} className="fs-18-ss">
                  No
                </td>
                <td className="table-ketidakhadiran-rapor">
                  <span className="fw-semibold">Izin</span>
                </td>
                <td>
                  <p className="fw-semibold mb-0 color-dark">
                    {siswa?.izin} hari
                  </p>
                </td>
              </tr>
              <tr>
                <td style={{ width: "5%", opacity: "0" }} className="fs-18-ss">
                  No
                </td>
                <td className="table-ketidakhadiran-rapor">
                  <span className="fw-semibold">Tanpa Keterangan</span>
                </td>
                <td>
                  <p className="fw-semibold mb-0 color-dark">
                    {siswa?.alpa} hari
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SectionKetidakhadiran;
