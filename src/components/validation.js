function showInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = inputElement.validationMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);
}

function checkInputValidity(formElement, inputElement, config) {
  inputElement.setCustomValidity("");

  if (
    inputElement.validity.patternMismatch &&
    inputElement.hasAttribute("pattern")
  ) {
    const msg =
      inputElement.dataset.patternMessage || inputElement.validationMessage;
    inputElement.setCustomValidity(msg);
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, config);
    return false;
  }
  hideInputError(formElement, inputElement, config);
  return true;
}

function hasInvalidInput(inputList) {
  return inputList.some((input) => !input.validity.valid);
}

function toggleButtonState(inputList, buttonElement, config) {
  if (!buttonElement) return;
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

function setEventListeners(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector),
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((input) => {
    const validate = () => {
      checkInputValidity(formElement, input, config);
      toggleButtonState(inputList, buttonElement, config);
    };
    input.addEventListener("input", validate);
    input.addEventListener("blur", validate);
  });
}

function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => setEventListeners(formElement, config));
}

function clearValidation(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector),
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((input) => hideInputError(formElement, input, config));
  toggleButtonState(inputList, buttonElement, config);
}

export {
  enableValidation,
  clearValidation,
  toggleButtonState,
  checkInputValidity,
};
