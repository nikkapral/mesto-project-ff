import * as api from './api.js';

const cardTemplate = document.querySelector('#card-template');

function updateLikeCount(likesArray, likeCountElement) {
  likeCountElement.textContent = likesArray.length;
}

export function handleLike(cardData, likeButton, likeCountElement) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  if (isLiked) {
    api.unlikeCard(cardData._id)
      .then((updatedCard) => {
        likeButton.classList.remove('card__like-button_is-active');
        updateLikeCount(updatedCard.likes, likeCountElement);
        cardData.likes = updatedCard.likes;
      })
      .catch(err => console.error('Ошибка снятия лайка:', err));
  } else {
    api.likeCard(cardData._id)
      .then((updatedCard) => {
        likeButton.classList.add('card__like-button_is-active');
        updateLikeCount(updatedCard.likes, likeCountElement);
        cardData.likes = updatedCard.likes;
      })
      .catch(err => console.error('Ошибка постановки лайка:', err));
  }
}

export function createCard(cardData, openDeletePopupFn, handleLikeFn, handleOpen) {
  const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCountElement = cardElement.querySelector('.card__like-count');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  likeCountElement.textContent = cardData.likes ? cardData.likes.length : 0;

  const userId = window.currentUserId || null;

  if (!cardData.owner || cardData.owner._id !== userId) {
    deleteButton.style.display = 'none';
  }

  if (cardData.likes && cardData.likes.some(user => user._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  deleteButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    if (typeof openDeletePopupFn === 'function') {
      openDeletePopupFn(cardData._id, cardElement);
    }
  });

  likeButton.addEventListener('click', () => {
    handleLikeFn(cardData, likeButton, likeCountElement);
  });

  cardImage.addEventListener('click', () => {
    if (typeof handleOpen === 'function') {
      handleOpen(cardData.link, cardData.name);
    }
  });

  return cardElement;
}