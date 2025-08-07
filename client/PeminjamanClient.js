import peminjamanBarang from "./data"; // Pastikan path-nya sesuai

export const getPeminjamanDetail = (id) => {
  return peminjamanBarang.find((item) => item.id === id);
};
