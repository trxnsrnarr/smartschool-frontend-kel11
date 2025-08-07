import { Fragment } from "react";

const SoalInfo = ({
  ujianData,
  activeSoalUjian,
  idxSoal,
  tipeSoal,
  withRightLabel,
  konteksMateri,
  kontenMateri,
  prosesKognitif,
}) => {
  return (
    <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column mb-4">
      <div className="d-flex align-items-center justify-content-md-start justify-content-between">
        <h6 className="fs-18-ss fw-bold color-dark me-4 mb-0">
          Soal {idxSoal + 1} / {ujianData?.length}
        </h6>
      </div>
      <hr className="d-md-none hr-ss" />
      {["pg", "esai", "uraian"].includes(tipeSoal) && withRightLabel ? (
        <Fragment>
          <div className="d-flex justify-content-center align-items-center justify-content-md-start justify-content-between flex-wrap">
            {activeSoalUjian?.soal?.kd && (
              <span
                className="outline-primary-ss rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center me-3 px-2 mb-2"
                style={{
                  minWidth: "75px",
                  minHeight: "25px",
                }}
              >
                KD / CP {activeSoalUjian?.soal?.kd}
              </span>
            )}
            {activeSoalUjian?.soal?.levelKognitif && (
              <span
                className="outline-primary-ss rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center me-md-3 me-auto mb-2"
                style={{
                  minWidth: "75px",
                  minHeight: "25px",
                  textTransform: "uppercase",
                }}
              >
                {activeSoalUjian?.soal?.levelKognitif}
              </span>
            )}

            {activeSoalUjian?.soal?.nilaiSoal && (
              <span
                className="bg-primary text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center mb-2"
                style={{
                  minWidth: "75px",
                  minHeight: "25px",
                }}
              >
                {activeSoalUjian?.soal?.nilaiSoal} Poin
              </span>
            )}
          </div>
        </Fragment>
      ) : (
        withRightLabel && (
          <div className="d-flex justify-content-center align-items-center justify-content-lg-start justify-content-between flex-sm-row flex-column">
            <span
              className="outline-primary-ss rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center me-sm-3 me-0 mb-sm-0 mb-3 px-4"
              style={{
                height: "25px",
              }}
            >
              {
                prosesKognitif?.find(
                  (d) => d?.value == activeSoalUjian?.soal?.akmProsesKognitif
                )?.label
              }
            </span>

            <span
              className="bg-primary text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center px-4"
              style={{
                height: "25px",
              }}
            >
              {
                kontenMateri?.find(
                  (d) => d?.value == activeSoalUjian?.soal?.akmKontenMateri
                )?.label
              }{" "}
              -{" "}
              {
                konteksMateri?.find(
                  (d) => d?.value == activeSoalUjian?.soal?.akmKonteksMateri
                )?.label
              }
            </span>
          </div>
        )
      )}
    </div>
  );
};

export default SoalInfo;
