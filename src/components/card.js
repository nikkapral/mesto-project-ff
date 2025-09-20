import * as api from "./api.js";

const cardTemplate = document.querySelector("#card-template");

function updateLikeCount(likesArray, likeCountElement) {
  likeCountElement.textContent = Array.isArray(likesArray)
    ? likesArray.length
    : 0;
}

export function handleLike(cardData, likeButton, likeCountElement) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  const req = isLiked
    ? api.unlikeCard(cardData._id)
    : api.likeCard(cardData._id);

  req
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_is-active", !isLiked);
      updateLikeCount(updatedCard.likes, likeCountElement);
      cardData.likes = updatedCard.likes;
    })
    .catch((err) =>
      console.error(
        isLiked ? "Ошибка снятия лайка:" : "Ошибка постановки лайка:",
        err,
      ),
    );
}

export function removeCard(cardElement) {
  if (cardElement && cardElement.remove) cardElement.remove();
}

/**
 * @param {Object}
 * @param {string}
 * @param {Function}
 * @param {Function}
 * @param {Function}
 */
export function createCard(
  cardData,
  currentUserId,
  openDeletePopupFn,
  handleLikeFn,
  handleOpen,
) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector(".card__like-count");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  updateLikeCount(cardData.likes, likeCountElement);

  if (!(cardData.owner && cardData.owner._id === currentUserId)) {
    deleteButton.style.display = "none";
  }

  if (
    Array.isArray(cardData.likes) &&
    cardData.likes.some((u) => u._id === currentUserId)
  ) {
    likeButton.classList.add("card__like-button_is-active");
  }

  deleteButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (typeof openDeletePopupFn === "function") {
      openDeletePopupFn(cardData._id, cardElement);
    }
  });

  likeButton.addEventListener("click", () => {
    handleLikeFn(cardData, likeButton, likeCountElement);
  });

  cardImage.addEventListener("click", () => {
    if (typeof handleOpen === "function") {
      handleOpen(cardData.link, cardData.name);
    }
  });

  return cardElement;
}
