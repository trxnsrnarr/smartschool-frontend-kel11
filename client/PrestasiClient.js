import client from "./ApiClient";

export const getPrestasi = (params) => {
  return client("prestasi1", { params });
};

export const getDetailPrestasi = (id, params) => {
  return client(`prestasi1/${id}`, { params });
};

export const postPrestasi = (body) => {
  return client("prestasi", {
    body,
    method: "POST",
  });
};

export const updatePrestasi = (body, id) => {
  return client(`prestasi/${id}`, {
    method: "PUT",
    body,
  });
};

export const deletePrestasi = (id) => {
  return client(`prestasi/${id}`, {
    method: "DELETE",
  });
};
