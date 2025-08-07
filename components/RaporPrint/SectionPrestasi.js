const SectionPrestasi = ({ isReadOnly = false, prestasi }) => {
  return (
    <>
      <h6 className="fs-14-ss fw-bold text-uppercase mb-4 ms-4">E. Prestasi</h6>
      <table className="w-100 table">
        <thead>
          <tr>
            <th
              className="text-center fw-bold fs-12-ss"
              style={{ width: "5%", paddingTop: "19px", paddingBottom: "19px" }}
            >
              No
            </th>
            <th
              className="fw-bold fs-12-ss"
              style={{
                width: "30%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Nama Prestasi
            </th>
            <th
              className="fw-bold fs-12-ss"
              style={{
                width: "65%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Tingkat Prestasi
            </th>
          </tr>
        </thead>
        <tbody>
          {!prestasi?.length && (
            <tr>
              <td className="align-text-top fs-12-ss text-center">-</td>
              <td className="align-text-top fs-12-ss">-</td>
              <td className="align-text-top fs-12-ss">-</td>
            </tr>
          )}
          {prestasi?.map((d, idx) => {
            return (
              <tr key={`${idx}-${new Date().getTime()}`}>
                <td className="align-text-top fs-12-ss text-center">
                  {idx + 1}
                </td>
                <td className="align-text-top fs-12-ss">
                  {!d?.nama ? `-` : `${d?.nama}`}
                </td>
                <td className="align-text-top fs-12-ss">
                  {" "}
                  {!d?.tingkatPrestasi?.tingkat
                    ? `-`
                    : `${d?.tingkatPrestasi?.tingkat}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default SectionPrestasi;
