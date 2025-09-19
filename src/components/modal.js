export function openModal(popup) {
  popup.classList.add('popup_is-animated');
  setTimeout(() => {
    popup.classList.add('popup_is-opened');
  }, 10);

  popup._handleEsc = function (evt) {
    if (evt.key === 'Escape') {
      closeModal(popup);
    }
  };
  document.addEventListener('keydown', popup._handleEsc);
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');

  function onTransitionEnd(event) {
    if (event.propertyName === 'opacity' || event.propertyName === 'visibility') {
      popup.removeEventListener('transitionend', onTransitionEnd);

      popup.classList.remove('popup_is-animated');

      if (popup._handleEsc) {
        document.removeEventListener('keydown', popup._handleEsc);
        delete popup._handleEsc;
      }
    }
  }

  popup.addEventListener('transitionend', onTransitionEnd);
}