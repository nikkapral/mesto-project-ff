const cardsContainer = document.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template");

function createCard(cardData, handleDelete) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardTitle = cardElement.querySelector(".card__title");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener("click", () => {
    handleDelete(cardElement);
  });

  return cardElement;
}

function handleDelete(cardNode) {
  cardNode.remove();
}

initialCards.forEach((card) => {
  const cardElement = createCard(card, handleDelete);
  cardsContainer.appendChild(cardElement);
});
