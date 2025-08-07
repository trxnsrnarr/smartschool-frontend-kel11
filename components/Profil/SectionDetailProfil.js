import { useEffect, useState } from "react";
import { FaPaperclip, FaPen } from "react-icons/fa";
import toast from "react-hot-toast";
import { postProfilUser } from "../../client/AuthClient";
import {
  getDistrict,
  getProvince,
  getRegency,
  getVillage,
} from "../../client/LokasiClient";
import useUser from "../../hooks/useUser";
import { momentPackage } from "../../utilities/HelperUtils";
import { hideModal } from "../../utilities/ModalUtils";
import ModalEditDetailProfil from "./ModalEditDetailProfil";

const SectionDetailProfil = ({ isReadOnly = false, data }) => {
  const { user, setUser } = data || useUser();

  const [buttonState, setButtonState] = useState("idle");

  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);
  const [district, setDistrict] = useState([]);
  const [village, setVillage] = useState([]);

  const [formData, setFormData] = useState({
    nrk: user?.profil?.nrk,
    nip: user?.profil?.nip,
    nuptk: user?.profil?.nuptk,
    nisn: user?.profil?.nisn,
    nis: user?.profil?.nis,
    whatsapp: user?.whatsapp,
    nama: user?.nama,
    gender: user?.gender,
    agama: user?.agama,
    email: user?.email,
    tempatLahir: user?.tempatLahir,
    tanggalLahir: momentPackage(user?.tanggalLahir),
    asalSekolah: user?.profil?.asalSekolah,
    kodepos: user?.profil?.kodepos,
    provinceId: user?.profil?.provinceId,
    regencyId: user?.profil?.regencyId,
    districtId: user?.profil?.districtId,
    villageId: user?.profil?.villageId,
    alamat: user?.profil?.alamat,
    alamatAsalSekolah: user?.profil?.alamatAsalSekolah,
    kelasDiterima: user?.profil?.kelasDiterima,
    tanggalMasuk: user?.profil?.tanggalMasuk,
    alamatAsalSekolah: user?.profil?.alamatAsalSekolah,
    tahunIjazah: user?.profil?.tahunIjazah,
    noIjazah: user?.profil?.noIjazah,
    file_ijazah: user?.profil?.fileIjazah,
  });

  const _postProfilUser = async () => {
    setButtonState("loading");
    const { data, error } = await postProfilUser({
      ...formData,
      tanggalLahir: formData.tanggalLahir
        ? momentPackage(formData.tanggalLahir).format("YYYY-MM-DD")
        : momentPackage().format("YYYY-MM-DD"),
      tanggalMasuk: formData.tanggalMasuk
        ? momentPackage(formData.tanggalMasuk).format("YYYY-MM-DD")
        : "",
    });

    if (data) {
      setButtonState("success");
      hideModal("modalEditDetailProfil");
      toast.success(data?.message);
      setUser({
        ...user,
        whatsapp: formData.whatsapp,
        nama: formData.nama,
        gender: formData.gender,
        tempatLahir: formData.tempatLahir,
        tanggalLahir: formData.tanggalLahir,
        agama: formData.agama,
        profil: {
          ...user?.profil,
          nrk: formData.nrk,
          nip: formData.nip,
          nuptk: formData.nuptk,
          nisn: formData.nisn,
          nis: formData.nis,
          asalSekolah: formData.asalSekolah,
          alamatAsalSekolah: formData.alamatAsalSekolah,
          kodepos: formData.kodepos,
          provinceId: formData.provinceId,
          regencyId: formData.regencyId,
          districtId: formData.districtId,
          villageId: formData.villageId,
          alamat: formData?.alamat,
          noIjazah: formData?.noIjazah,
          tahunIjazah: formData?.tahunIjazah,
          fileIjazah: formData?.fileIjazah,
        },
      });
    } else {
      setButtonState("error");
      toast.error(error?.message);
    }
  };

  const handleChangeDate = (e, name) => {
    setFormData({
      ...formData,
      [name]: e,
    });
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeSelect = (e, name) => {
    if (name == "provinceId") {
      _getRegency({
        provinceId: e?.value,
      });
    }

    if (name == "regencyId") {
      _getDistrict({
        regencyId: e?.value,
      });
    }

    if (name == "districtId") {
      _getVillage({
        districtId: e?.value,
      });
    }

    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  const _getProvince = async () => {
    const { data } = await getProvince();

    if (data) {
      setProvince(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const _getRegency = async (params) => {
    const { data } = await getRegency(params);

    if (data) {
      setRegency(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const _getDistrict = async (params) => {
    const { data } = await getDistrict(params);

    if (data) {
      setDistrict(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const _getVillage = async (params) => {
    const { data } = await getVillage(params);

    if (data) {
      setVillage(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  useEffect(() => {
    _getProvince();
    formData.provinceId && _getRegency({ provinceId: formData.provinceId });
    formData.regencyId && _getDistrict({ regencyId: formData.regencyId });
    formData.districtId && _getVillage({ districtId: formData.districtId });
  }, []);

  return (
    <>
      <div className="card card-ss">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-extrabold color-dark mb-0">Detail Profil</h4>
            {!isReadOnly && (
              <button
                type="button"
                className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center p-1"
                style={{
                  width: "40px",
                  height: "40px",
                }}
                data-bs-toggle="modal"
                data-bs-target="#modalEditDetailProfil"
                // onClick={() => onClickEdit(slider)}
                // data-joyride="edit-slider"
              >
                <FaPen className="color-secondary fs-5" />
              </button>
            )}
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Nama Lengkap</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.nama || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Jenis Kelamin</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.genderText || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Agama</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.agama || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Nomor Whatsapp</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {user?.whatsapp || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Alamat Email</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0">
                {user?.email || "-"}
              </p>
            </li>
            {user?.role == "guru" && !isReadOnly && (
              <>
                <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                  <h6 className="color-dark fw-bold mb-2">NIP</h6>
                  <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                    {user?.profil?.nip || "-"}
                  </p>
                </li>
                <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                  <h6 className="color-dark fw-bold mb-2">NRK</h6>
                  <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                    {user?.profil?.nrk || "-"}
                  </p>
                </li>
                <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                  <h6 className="color-dark fw-bold mb-2">NUPTK</h6>
                  <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                    {user?.profil?.nuptk || "-"}
                  </p>
                </li>
              </>
            )}
            {user?.role == "siswa" && !isReadOnly && (
              <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                <h6 className="color-dark fw-bold mb-2">NISN</h6>
                <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                  {user?.profil?.nisn || "-"}
                </p>
              </li>
            )}
            {!isReadOnly && (
              <>
                <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                  <h6 className="color-dark fw-bold mb-2">
                    Tempat & Tanggal Lahir
                  </h6>
                  <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                    {`${user?.tempatLahir}, ${momentPackage(
                      user?.tanggalLahir
                    ).format("YYYY-MM-DD")}`}
                  </p>
                </li>
                <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                  <h6 className="color-dark fw-bold mb-2">Alamat</h6>
                  <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                    {user?.profil?.alamat || "-"}
                  </p>
                </li>
              </>
            )}
            {user?.role == "siswa" && !isReadOnly && (
              <>
                <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                  <h6 className="color-dark fw-bold mb-2">Asal Sekolah</h6>
                  <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                    {user?.profil?.asalSekolah || "-"}
                  </p>
                </li>
                <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                  <h6 className="color-dark fw-bold mb-2">
                    Alamat Asal Sekolah
                  </h6>
                  <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                    {user?.profil?.alamatAsalSekolah || "-"}
                    {/* Jl. jomblo sejahtera */}
                  </p>
                </li>
                <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                  <h6 className="color-dark fw-bold mb-2">
                    Diterima di Sekolah ini di Kelas
                  </h6>
                  <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                    {user?.profil?.kelasDiterima || "-"}
                  </p>
                </li>
                <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                  <h6 className="color-dark fw-bold mb-2">
                    Diterima di Sekolah ini pada Tanggal
                  </h6>
                  <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                    {momentPackage(user?.profil?.tanggalMasuk).format(
                      "YYYY-MM-DD"
                    ) || "-"}
                  </p>
                </li>
                <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                  <h6 className="color-dark fw-bold mb-2">Ijazah Terakhir</h6>
                  <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                    {user?.profil?.noIjazah || "-"} -{" "}
                    {user?.profil?.tahunIjazah || "-"}
                  </p>
                  <div className="d-flex align-items-center">
                    <FaPaperclip color="#2680EB" />
                    <p className="fs-14-ss fw-bold color-primary m-0 ms-2">
                      Lihat File
                    </p>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <ModalEditDetailProfil
        handleChangeForm={handleChangeForm}
        formData={formData}
        _postProfilUser={_postProfilUser}
        handleChangeSelect={handleChangeSelect}
        province={province}
        regency={regency}
        district={district}
        village={village}
        handleChangeDate={handleChangeDate}
        buttonState={buttonState}
      />
    </>
  );
};

export default SectionDetailProfil;
