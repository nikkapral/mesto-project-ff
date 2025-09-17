import "../pages/index.css";
import { createCard, handleDelete, handleLike } from "./card.js";
import { openModal, closeModal } from "./modal.js";
import { initialCards } from "./cards.js";

const logoImage = require("../images/logo.svg");
const avatarImage = require("../images/avatar.jpg");

const logoElement = document.querySelector(".header__logo");
logoElement.src = logoImage;

const profileImageElement = document.querySelector(".profile__image");
profileImageElement.style.backgroundImage = `url(${avatarImage})`;

const cardsContainer = document.querySelector(".places__list");

const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const popupEdit = document.querySelector(".popup_type_edit");
const formEdit = popupEdit.querySelector(".popup__form");
const inputName = formEdit.querySelector(".popup__input_type_name");
const inputDescription = formEdit.querySelector(
  ".popup__input_type_description",
);

const popupNewCard = document.querySelector(".popup_type_new-card");
const formNewPlace = document.querySelector('.popup__form[name="new-place"]');

const inputPlaceName = formNewPlace.querySelector(
  ".popup__input_type_card-name",
);
const inputPlaceLink = formNewPlace.querySelector(".popup__input_type_url");

const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

function openImagePopup(src, alt) {
  popupImage.src = src;
  popupImage.alt = alt;
  popupCaption.textContent = alt;
  openModal(imagePopup);
}

function handleEditButtonClick() {
  inputName.value = profileTitle.textContent;
  inputDescription.value = profileDescription.textContent;
  openModal(popupEdit);
}

function handleAddButtonClick() {
  formNewPlace.reset();
  openModal(popupNewCard);
}

function handleFormEditSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closeModal(popupEdit);
}

function handleFormNewPlaceSubmit(evt) {
  evt.preventDefault();

  const placeName = inputPlaceName.value;
  const link = inputPlaceLink.value;

  const newCardData = { name: placeName, link: link };

  const newCardElement = createCard(
    newCardData,
    handleDelete,
    handleLike,
    openImagePopup,
  );

  cardsContainer.prepend(newCardElement);

  formNewPlace.reset();

  closeModal(popupNewCard);
}

editButton.addEventListener("click", handleEditButtonClick);
addButton.addEventListener("click", handleAddButtonClick);

formEdit.addEventListener("submit", handleFormEditSubmit);
formNewPlace.addEventListener("submit", handleFormNewPlaceSubmit);

document.querySelectorAll(".popup").forEach((popup) => {
  const closeBtn = popup.querySelector(".popup__close");

  closeBtn.addEventListener("click", () => closeModal(popup));

  popup.addEventListener("click", (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

initialCards.forEach((card) => {
  const cardElement = createCard(
    card,
    handleDelete,
    handleLike,
    openImagePopup,
  );
  cardsContainer.appendChild(cardElement);
});
