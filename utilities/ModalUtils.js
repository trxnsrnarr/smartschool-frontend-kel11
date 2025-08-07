export const showModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add("show");
  modal.style.display = "block";
  modal.removeAttribute("aria-hidden");

  // Tambahkan backdrop jika perlu
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop fade show";
  backdrop.setAttribute("data-modal-backdrop", modalId); // biar bisa dihapus spesifik
  document.body.appendChild(backdrop);

  document.body.classList.add("modal-open");
};

export const hideModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove("show");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");

  // Hapus backdrop yang sesuai modal ini
  const backdrops = document.querySelectorAll(
    `[data-modal-backdrop="${modalId}"]`
  );
  backdrops.forEach((bd) => bd.remove());

  document.body.classList.remove("modal-open");
};
