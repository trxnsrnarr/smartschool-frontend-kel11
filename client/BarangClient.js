import client, { download } from "./ApiClient";

export const getBarang = (params) => {
  return client("barang", { params });
};

export const getBarangDetail = (id) => {
  return client(`barang/${id}`);
};

export const postBarang = (payload) => {
  return client("barang", {
    method: "POST",
    body: payload,
  });
};

export const updateBarang = (id, payload) => {
  return client(`barang/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteBarang = (id) => {
  return client(`barang/${id}`, {
    method: "DELETE",
    withAuth: true,
  });
};

export const dowloadBarang = () => {
  return download("barang/download", {
    method: "POST",
  });
};

export const deleteJurusanBarang = (id) => {
  return client(`jurusan-barang/${id}`, {
    method: "DELETE",
    withAuth: true,
  });
};

export const postBarangSafe = (payload) => {
  const token = localStorage.getItem("ss-token")?.replaceAll('"', "");
  return client("barang", {
    method: "POST",
    body: payload,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
