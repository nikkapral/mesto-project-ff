export function handleLike(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

export function handleDelete(cardNode) {
  cardNode.remove();
}

export function createCard(cardData, handleDelete, handleLike, handleOpen) {
  const cardTemplate = document.querySelector("#card-template");
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener("click", () => {
    handleDelete(cardElement);
  });

  likeButton.addEventListener("click", () => {
    handleLike(likeButton);
  });

  cardImage.addEventListener("click", () => {
    if (typeof handleOpen === "function") {
      handleOpen(cardData.link, cardData.name);
    }
  });

  return cardElement;
}
