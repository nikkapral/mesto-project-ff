function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;

  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;

  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
}

function checkInputValidity(formElement, inputElement, config, isFormSubmitted = false) {
  const value = inputElement.value.trim();
  const touched = inputElement.dataset.touched === 'true';
  const shouldShowError = touched || isFormSubmitted;

  inputElement.setCustomValidity('');

  if (inputElement.validity.tooShort) {
    const minLength = inputElement.getAttribute('minlength');
    const lengthNow = value.length;
    inputElement.setCustomValidity(`Минимальное количество символов: ${minLength}. Длина текста сейчас: ${lengthNow} символ.`);
  } else if (inputElement.name === 'avatar-link') {
    if (value === '') {
      inputElement.setCustomValidity('Вы пропустили это поле.');
    } else if (inputElement.validity.typeMismatch) {
      inputElement.setCustomValidity('Введите адрес сайта.');
    }
  } else if (inputElement.name === 'link') {
    if (value === '') {
      inputElement.setCustomValidity('Вы пропустили это поле.');
    } else if (inputElement.validity.typeMismatch) {
      inputElement.setCustomValidity('Введите адрес сайта.');
    }
  } else if (inputElement.hasAttribute('data-error')) {
    if (['name', 'description'].includes(inputElement.name)) {
      const pattern = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;
      if (value !== '' && !pattern.test(value)) {
        inputElement.setCustomValidity(inputElement.dataset.error || 'Некорректный формат');
      }
    }
    if (inputElement.hasAttribute('required') && value === '') {
      inputElement.setCustomValidity('Вы пропустили это поле.');
    }
  } else {
    if (inputElement.hasAttribute('required') && value === '') {
      inputElement.setCustomValidity('Вы пропустили это поле.');
    }
  }

  if (!inputElement.validity.valid) {
    if (shouldShowError) {
      showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
      hideInputError(formElement, inputElement, config);
    }
    return false;
  }

  hideInputError(formElement, inputElement, config);
  return true;
}

function hasInvalidInput(inputList, config, isFormSubmitted = false) {
  return inputList.some(inputElement => !checkInputValidity(
    inputElement.closest(config.formSelector),
    inputElement,
    config,
    isFormSubmitted
  ));
}

function toggleButtonState(inputList, buttonElement, config, isFormSubmitted = false) {
  if (hasInvalidInput(inputList, config, isFormSubmitted)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

function setEventListeners(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.dataset.touched = 'false';

    inputElement.addEventListener('input', () => {
      inputElement.dataset.touched = 'true';
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });

    inputElement.addEventListener('blur', () => {
      inputElement.dataset.touched = 'true';
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach(formElement => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();

      const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
      const buttonElement = formElement.querySelector(config.submitButtonSelector);

      inputList.forEach(input => {
        input.dataset.touched = 'true';
        checkInputValidity(formElement, input, config, true);
      });

      toggleButtonState(inputList, buttonElement, config, true);

      if (!hasInvalidInput(inputList, config, true)) {
        formElement.dispatchEvent(new Event('formValid'));
      }
    });
    setEventListeners(formElement, config);
  });
}

function clearValidation(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach(inputElement => {
    inputElement.dataset.touched = 'false';
    hideInputError(formElement, inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
}

export {
  enableValidation,
  clearValidation,
  toggleButtonState,
  checkInputValidity
};