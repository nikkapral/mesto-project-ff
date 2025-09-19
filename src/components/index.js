import "../pages/index.css";
import { createCard, handleLike } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation, toggleButtonState } from './validation.js';
import * as api from './api.js';

import logoImage from '../images/logo.svg';
import avatarImage from '../images/avatar.jpg';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const logoElement = document.querySelector('.header__logo');
logoElement.src = logoImage;

const profileImageElement = document.querySelector('.profile__image');
profileImageElement.style.backgroundImage = `url(${avatarImage})`;

const avatarEditButton = document.querySelector('.profile__avatar-edit-button');
if (avatarEditButton) {
  avatarEditButton.remove();
}

const cardsContainer = document.querySelector('.places__list');

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaptionImage = imagePopup.querySelector('.popup__caption');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const popupEdit = document.querySelector('.popup_type_edit');
const formEdit = popupEdit.querySelector('.popup__form');
const inputName = formEdit.querySelector('#popup__profile-name');
const inputDescription = formEdit.querySelector('#popup__profile-job');

const popupNewCard = document.querySelector('.popup_type_new-card');
const formNewPlace = popupNewCard.querySelector('.popup__form');
const inputPlaceName = formNewPlace.querySelector('#popup__card-name');
const inputPlaceLink = formNewPlace.querySelector('#popup__card-url');

const popupAvatar = document.querySelector('.popup_type_edit-avatar');
const formEditAvatar = popupAvatar.querySelector('.popup__form');
const inputAvatarUrl = formEditAvatar.querySelector('#popup__avatar-url');

const popupConfirmDelete = document.querySelector('.popup_type_confirm-delete');
const formConfirmDelete = popupConfirmDelete.querySelector('.popup__form');
const confirmDeleteButton = formConfirmDelete.querySelector('.popup__button');

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

const profileAvatarButton = document.getElementById('profileAvatar');

let cardIdToDelete = null;
let cardElementToDelete = null;

function openImagePopup(src, alt) {
  popupImage.src = src;
  popupImage.alt = alt;
  popupCaptionImage.textContent = alt;
  openModal(imagePopup);
}

function handleEditButtonClick() {
  inputName.value = profileTitle.textContent;
  inputDescription.value = profileDescription.textContent;

  clearValidation(formEdit, validationConfig);

  openModal(popupEdit);
}

function handleAddButtonClick() {
  formNewPlace.reset();

  clearValidation(formNewPlace, validationConfig);
  openModal(popupNewCard);
}

function handleAvatarEditOpen() {
  formEditAvatar.reset();

  clearValidation(formEditAvatar, validationConfig);

  openModal(popupAvatar);
}

function openConfirmDeletePopup(cardId, cardElement) {
  cardIdToDelete = cardId;
  cardElementToDelete = cardElement;

  confirmDeleteButton.textContent = 'Да';
  confirmDeleteButton.disabled = false;

  openModal(popupConfirmDelete);
}

formConfirmDelete.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (!cardIdToDelete || !cardElementToDelete) {
    closeModal(popupConfirmDelete);
    return;
  }

  confirmDeleteButton.textContent = 'Удаление...';
  confirmDeleteButton.disabled = true;

  api.deleteCard(cardIdToDelete)
    .then(() => {
      cardElementToDelete.remove();
      closeModal(popupConfirmDelete);
    })
    .catch(err => console.error(`Ошибка удаления карточки: ${err}`))
    .finally(() => {
      confirmDeleteButton.textContent = 'Да';
      confirmDeleteButton.disabled = false;
      cardIdToDelete = null;
      cardElementToDelete = null;
    });
});

function renderLoading(buttonElement, isLoading, loadingText = 'Сохранение...', originalText = '') {
  if (isLoading) {
    buttonElement.textContent = loadingText;
    buttonElement.disabled = true;
  } else {
    buttonElement.textContent = originalText;
    buttonElement.disabled = false;
  }
}

function handleFormEditSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter || formEdit.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  renderLoading(submitButton, true);

  api.updateUserInfo({
    name: inputName.value.trim(),
    about: inputDescription.value.trim()
  })
    .then((updatedUser) => {
      profileTitle.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closeModal(popupEdit);
    })
    .catch(err => console.error(`Ошибка обновления профиля: ${err}`))
    .finally(() => {
      renderLoading(submitButton, false, '', originalText);
      const inputList = Array.from(formEdit.querySelectorAll(validationConfig.inputSelector));
      toggleButtonState(inputList, submitButton, validationConfig);
    });
}

function handleFormNewPlaceSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter || formNewPlace.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  const name = inputPlaceName.value.trim();
  const link = inputPlaceLink.value.trim();

  renderLoading(submitButton, true);

  api.addCard({ name, link })
    .then(newCard => {
      const cardElement = createCard(newCard, openConfirmDeletePopup, handleLike, openImagePopup);
      cardsContainer.prepend(cardElement);
      formNewPlace.reset();
      clearValidation(formNewPlace, validationConfig);
      closeModal(popupNewCard);
    })
    .catch(err => console.error(`Ошибка добавления карточки: ${err}`))
    .finally(() => {
      renderLoading(submitButton, false, '', originalText);
      const inputList = Array.from(formNewPlace.querySelectorAll(validationConfig.inputSelector));
      toggleButtonState(inputList, submitButton, validationConfig);
    });
}

function handleFormEditAvatarSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter || formEditAvatar.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  const avatarLink = inputAvatarUrl.value.trim();

  renderLoading(submitButton, true);

  api.updateUserAvatar(avatarLink)
    .then((updatedUser) => {
      profileImageElement.style.backgroundImage = `url(${updatedUser.avatar})`;
      closeModal(popupAvatar);
      formEditAvatar.reset();
      clearValidation(formEditAvatar, validationConfig);
    })
    .catch(err => console.error(`Ошибка обновления аватара: ${err}`))
    .finally(() => {
      renderLoading(submitButton, false, '', originalText);
      const inputList = Array.from(formEditAvatar.querySelectorAll(validationConfig.inputSelector));
      toggleButtonState(inputList, submitButton, validationConfig);
    });
}

editButton.addEventListener('click', handleEditButtonClick);
addButton.addEventListener('click', handleAddButtonClick);

profileAvatarButton.addEventListener('click', handleAvatarEditOpen);
profileAvatarButton.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter' || evt.key === ' ') {
    evt.preventDefault();
    handleAvatarEditOpen();
  }
});

formEdit.addEventListener('submit', handleFormEditSubmit);
formNewPlace.addEventListener('submit', handleFormNewPlaceSubmit);
formEditAvatar.addEventListener('submit', handleFormEditAvatarSubmit);

document.querySelectorAll('.popup').forEach((popup) => {
  const closeBtn = popup.querySelector('.popup__close');

  closeBtn.addEventListener('click', () => closeModal(popup));

  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

window.currentUserId = null;

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    window.currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImageElement.style.backgroundImage = `url(${userData.avatar})`;

    cardsContainer.innerHTML = '';
    cards.forEach(card => {
      const cardElement = createCard(card, openConfirmDeletePopup, handleLike, openImagePopup);
      cardsContainer.appendChild(cardElement);
    });
  })
  .catch(err => console.error(`Ошибка загрузки данных: ${err}`));

enableValidation(validationConfig);