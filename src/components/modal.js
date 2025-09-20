let isEscBound = false;

function closeByEsc(evt) {
  if (evt.key !== "Escape") return;
  const opened = document.querySelector(".popup_is-opened");
  if (opened) closeModal(opened);
}

export function initModals() {
  document
    .querySelectorAll(".popup")
    .forEach((p) => p.classList.add("popup_is-animated"));
}

export function openModal(popup) {
  popup.classList.add("popup_is-opened");
  if (!isEscBound) {
    document.addEventListener("keydown", closeByEsc);
    isEscBound = true;
  }
}

export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");

  if (!document.querySelector(".popup_is-opened") && isEscBound) {
    document.removeEventListener("keydown", closeByEsc);
    isEscBound = false;
  }
}
