// client/KategoriClient.js
import clientAxios from "./clientAxios";

export const getKategoriBarang = async (m_sekolah_id) => {
  try {
    const token = JSON.parse(localStorage.getItem("ss-token"));
    console.log("Token:", token);
    console.log("Sekolah ID:", m_sekolah_id);

    const res = await clientAxios.get("/kategori-barang", {
      params: { m_sekolah_id },
      headers: {
        Authorization: `Bearer ${token}`, // <-- perbaikan di sini
      },
    });

    console.log("Res kategori:", res.data);
    return res.data || [];
  } catch (error) {
    console.error("Gagal ambil kategori:", error.response?.data || error.message);
    return [];
  }
};