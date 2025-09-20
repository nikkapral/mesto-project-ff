import "../pages/index.css";
import { createCard, handleLike, removeCard } from "./card.js";
import { openModal, closeModal, initModals } from "./modal.js";
import {
  enableValidation,
  clearValidation,
  toggleButtonState,
} from "./validation.js";
import * as api from "./api.js";

import logoImage from "../images/logo.svg";
import avatarImage from "../images/avatar.jpg";

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const logoElement = document.querySelector(".header__logo");
logoElement.src = logoImage;

const profileImageElement = document.querySelector(".profile__image");
profileImageElement.style.backgroundImage = `url(${avatarImage})`;

const avatarEditButton = document.querySelector(".profile__avatar-edit-button");
if (avatarEditButton) {
  avatarEditButton.remove();
}

const cardsContainer = document.querySelector(".places__list");

const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaptionImage = imagePopup.querySelector(".popup__caption");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const popupEdit = document.querySelector(".popup_type_edit");
const formEdit = popupEdit.querySelector(".popup__form");
const inputName = formEdit.querySelector("#popup__profile-name");
const inputDescription = formEdit.querySelector("#popup__profile-job");

const popupNewCard = document.querySelector(".popup_type_new-card");
const formNewPlace = popupNewCard.querySelector(".popup__form");
const inputPlaceName = formNewPlace.querySelector("#popup__card-name");
const inputPlaceLink = formNewPlace.querySelector("#popup__card-url");

const popupAvatar = document.querySelector(".popup_type_edit-avatar");
const formEditAvatar = popupAvatar.querySelector(".popup__form");
const inputAvatarUrl = formEditAvatar.querySelector("#popup__avatar-url");

const popupConfirmDelete = document.querySelector(".popup_type_confirm-delete");
const formConfirmDelete = popupConfirmDelete.querySelector(".popup__form");
const confirmDeleteButton = formConfirmDelete.querySelector(".popup__button");

const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

const profileAvatarButton = document.getElementById("profileAvatar");

let cardIdToDelete = null;
let currentUserId = null;
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

  confirmDeleteButton.textContent = "Да";
  confirmDeleteButton.disabled = false;

  openModal(popupConfirmDelete);
}

formConfirmDelete.addEventListener("submit", (evt) => {
  evt.preventDefault();

  if (!cardIdToDelete || !cardElementToDelete) {
    closeModal(popupConfirmDelete);
    return;
  }

  confirmDeleteButton.textContent = "Удаление...";
  confirmDeleteButton.disabled = true;

  api
    .deleteCard(cardIdToDelete)
    .then(() => {
      removeCard(cardElementToDelete);
      closeModal(popupConfirmDelete);
      cardIdToDelete = null;
      cardElementToDelete = null;
      confirmDeleteButton.disabled = false;
    })
    .catch((err) => {
      console.error(`Ошибка удаления карточки: ${err}`);
      confirmDeleteButton.disabled = false;
    })
    .finally(() => {
      confirmDeleteButton.textContent = "Да";
    });
});

function setButtonText(button, text) {
  if (button) button.textContent = text;
}

function handleFormEditSubmit(evt) {
  evt.preventDefault();
  const submitButton =
    evt.submitter || formEdit.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  submitButton.disabled = true;
  setButtonText(submitButton, "Сохранение...");

  api
    .updateUserInfo({
      name: inputName.value.trim(),
      about: inputDescription.value.trim(),
    })
    .then((updatedUser) => {
      profileTitle.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closeModal(popupEdit);
      submitButton.disabled = false;
    })
    .catch((err) => {
      console.error(`Ошибка обновления профиля: ${err}`);
      submitButton.disabled = false;
    })
    .finally(() => {
      setButtonText(submitButton, originalText);
    });
}

function renderLoading(
  buttonElement,
  isLoading,
  loadingText = "Сохранение...",
  originalText = "",
) {
  if (isLoading) {
    buttonElement.textContent = loadingText;
    buttonElement.disabled = true;
  } else {
    buttonElement.textContent = originalText;
    buttonElement.disabled = false;
  }
}

function handleFormNewPlaceSubmit(evt) {
  evt.preventDefault();
  const submitButton =
    evt.submitter || formNewPlace.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  submitButton.disabled = true;
  setButtonText(submitButton, "Сохранение...");

  const name = inputPlaceName.value.trim();
  const link = inputPlaceLink.value.trim();

  api
    .addCard({ name, link })
    .then((newCard) => {
      const cardElement = createCard(
        newCard,
        currentUserId,
        openConfirmDeletePopup,
        handleLike,
        openImagePopup,
      );
      cardsContainer.prepend(cardElement);
      formNewPlace.reset();
      closeModal(popupNewCard);
      submitButton.disabled = false;
    })
    .catch((err) => {
      console.error(`Ошибка добавления карточки: ${err}`);
      submitButton.disabled = false;
    })
    .finally(() => {
      setButtonText(submitButton, originalText);
    });
}

function handleFormEditAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton =
    evt.submitter || formEditAvatar.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  submitButton.disabled = true;
  setButtonText(submitButton, "Сохранение...");

  const avatarLink = inputAvatarUrl.value.trim();

  api
    .updateUserAvatar(avatarLink)
    .then((updatedUser) => {
      profileImageElement.style.backgroundImage = `url(${updatedUser.avatar})`;
      closeModal(popupAvatar);
      formEditAvatar.reset();
      submitButton.disabled = false;
    })
    .catch((err) => {
      console.error(`Ошибка обновления аватара: ${err}`);
      submitButton.disabled = false;
    })
    .finally(() => {
      setButtonText(submitButton, originalText);
    });
}

initModals();

editButton.addEventListener("click", handleEditButtonClick);
addButton.addEventListener("click", handleAddButtonClick);

profileAvatarButton.addEventListener("click", handleAvatarEditOpen);
profileAvatarButton.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter" || evt.key === " ") {
    evt.preventDefault();
    handleAvatarEditOpen();
  }
});

formEdit.addEventListener("submit", handleFormEditSubmit);
formNewPlace.addEventListener("submit", handleFormNewPlaceSubmit);
formEditAvatar.addEventListener("submit", handleFormEditAvatarSubmit);

document.querySelectorAll(".popup").forEach((popup) => {
  const closeBtn = popup.querySelector(".popup__close");

  closeBtn.addEventListener("click", () => closeModal(popup));

  popup.addEventListener("click", (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImageElement.style.backgroundImage = `url(${userData.avatar})`;

    cardsContainer.innerHTML = "";
    cards.forEach((card) => {
      const cardElement = createCard(
        card,
        currentUserId,
        openConfirmDeletePopup,
        handleLike,
        openImagePopup,
      );
      cardsContainer.appendChild(cardElement);
    });
  })
  .catch((err) => console.error(`Ошибка загрузки данных: ${err}`));

enableValidation(validationConfig);
