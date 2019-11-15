'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var MIN_BUNGALO_PRICE = 0;
  var MIN_FLAT_PRICE = 1000;
  var MIN_HOUSE_PRICE = 5000;
  var MIN_PALACE_PRICE = 10000;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // elements of the form:
  var adForm = document.querySelector('.ad-form');
  var roomNumber = adForm.querySelector('#room_number');
  var guestNumber = adForm.querySelector('#capacity');
  var priceInput = document.querySelector('#price');
  var titleInput = document.querySelector('#title');
  var houseType = document.querySelector('#type');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  // users images:
  var userAvatarInput = document.querySelector('.ad-form-header__input');
  var userAvatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoHouseInput = document.querySelector('.ad-form__input');
  var photoHousePreviewDiv = document.querySelector('.ad-form__photo');
  var photoHousePreview;

  // vars for cloning:
  var pinDestination = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin')
    .content.querySelector('.map__pin');
  var errorDestination = document.querySelector('main');
  var errorTemplate = document.querySelector('#error')
    .content.querySelector('.error');
  var successDestination = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
    .content.querySelector('.success');

  var serverData;

  window.form = {
    filteredData: null,
    checkGuestsRoomsCorrespondence: function () {
      var roomsNumber = Number(roomNumber.value);
      roomsNumber = roomsNumber === 100 ? 0 : roomsNumber;
      var guestsNumber = Number(guestNumber.value);
      for (var i = 0; i < roomNumber.length; i++) {
        if (roomsNumber !== Number(guestNumber[i].value)) {
          guestNumber[i].disabled = true;
        } else {
          guestNumber[i].disabled = false;
        }
      }
      if (roomsNumber !== guestsNumber) {
        roomNumber.setCustomValidity('Число гостей и комнат должно совпадать');
        guestNumber.setCustomValidity('Число гостей и комнат должно совпадать');
      } else {
        roomNumber.setCustomValidity('');
        guestNumber.setCustomValidity('');
      }
    },
    resetCheckBoxes: function (checkBoxes) {
      for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
          checkBoxes[i].checked = false;
        }
      }
    },
    onFormChange: function (evt) {
      if (evt.target.matches('#timein') || evt.target.matches('#timeout')) {
        setTime(evt);
      } else if (evt.target.matches('#type')) {
        setMinPrice(houseType.value);
      } else if (evt.target.matches('#room_number') || evt.target.matches('#capacity')) {
        window.form.checkGuestsRoomsCorrespondence();
      } else {
        return;
      }
    },
    // send data to server:
    onSendButtonClick: function (evt) {
      evt.preventDefault();
      window.backend.save(adForm, onUpload, window.form.onUploadError);
    },
    filterServerData: function () {
      // clear the map:
      window.map.closeCard();
      window.map.removePins();
      // reset filtered data:
      window.form.filteredData = serverData;
      // filter data:
      window.filters.getFilteredData();
      // show filtered data:
      window.map.appendPins(pinTemplate, pinDestination, window.form.filteredData);
    },
    onDownload: function (response) {
      window.map.appendPins(pinTemplate, pinDestination, response);
      serverData = response;
      return serverData;
    },
    // create error handlers based on template:
    onDownloadError: onErrorTemplate(removeDownloadErrorMessage, 'download-error',
        'Ошибка загрузки данных с сервера'),
    onUploadError: onErrorTemplate(removeUploadErrorMessage, 'upload-error'),
  };

  function setPriceInput(value) {
    priceInput.setAttribute('min', value);
    priceInput.setAttribute('placeholder', value);
  }

  function setMinPrice(house) {
    switch (house) {
      case 'bungalo':
        setPriceInput(MIN_BUNGALO_PRICE);
        break;
      case 'flat':
        setPriceInput(MIN_FLAT_PRICE);
        break;
      case 'house':
        setPriceInput(MIN_HOUSE_PRICE);
        break;
      case 'palace':
        setPriceInput(MIN_PALACE_PRICE);
        break;
    }
  }

  function setTime(evt) {
    timeIn.selectedIndex = evt.target.selectedIndex;
    timeOut.selectedIndex = evt.target.selectedIndex;
  }


  function appendMessage(template, destination) {
    var newElement = template.cloneNode(true);
    destination.appendChild(newElement);
  }


  function onUpload() {
    window.page.deactivatePage();
    appendMessage(successTemplate, successDestination);
    document.addEventListener('click', removeSuccessMessage);
  }

  function onErrorTemplate(errorMessageHandler, errorType, newErrorText) {
    return function () {
      appendMessage(errorTemplate, errorDestination);
      var errorText = document.getElementsByClassName('error__message')[0];
      errorText.classList.add(errorType);
      // change text of an error:
      if (newErrorText) {
        errorText.innerHTML = newErrorText;
      }
      var errorDiv = document.getElementsByClassName('error')[0];
      errorDiv.addEventListener('click', errorMessageHandler);
    };
  }

  // remove an message and its listener:
  function removeMessage(messageType, removeMessageListener) {
    var message = document.getElementsByClassName(messageType)[0];
    message.remove();
    document.removeEventListener('click', removeMessageListener);
  }

  function removeDownloadErrorMessage() {
    removeMessage('error', removeDownloadErrorMessage);
  }

  function removeUploadErrorMessage() {
    removeMessage('error', removeUploadErrorMessage);
  }

  function removeSuccessMessage() {
    removeMessage('success', removeSuccessMessage);
  }

  // add user's images:
  function addImg(fileChooser, preview, previewContainer) {
    return function () {
      var file = fileChooser.files[0];
      if (file) {
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });
        if (matches) {
          var reader = new FileReader();
          reader.addEventListener('load', function () {
            if (!preview) {
              var newImg = document.createElement('img');
              newImg.classList.add('new-img');
              newImg.setAttribute('src', reader.result);
              previewContainer.append(newImg);
            } else {
              preview.src = reader.result;
            }
          });
          reader.readAsDataURL(file);
        }
      }
    };
  }
  window.form.checkGuestsRoomsCorrespondence();

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      var successMessage = document.getElementsByClassName('success')[0];
      var errorDownloadMessage = document.getElementsByClassName('download-error')[0];
      var errorUploadMessage = document.getElementsByClassName('upload-error')[0];

      window.map.closeCard();

      if (successMessage) {
        removeSuccessMessage();
      }
      if (errorDownloadMessage) {
        removeDownloadErrorMessage();
      }
      if (errorUploadMessage) {
        removeUploadErrorMessage();
      }
    }
  });

  titleInput.addEventListener('invalid', function () {
    if (titleInput.validity.tooShort) {
      titleInput.setCustomValidity('Заголовок должен состоять минимум из 30-ти символов');
    } else if (titleInput.validity.tooLong) {
      titleInput.setCustomValidity('Заголовок не должен превышать 100 символов');
    } else if (titleInput.validity.valueMissing) {
      titleInput.setCustomValidity('Обязательное поле');
    } else {
      titleInput.setCustomValidity('');
    }
  });

  priceInput.addEventListener('invalid', function () {
    if (priceInput.validity.rangeOverflow) {
      priceInput.setCustomValidity('Максимальная цена не должна превышать 1 000 000');
    } else if (priceInput.validity.valueMissing) {
      priceInput.setCustomValidity('Обязательное поле');
    } else if (priceInput.validity.rangeUnderflow) {
      priceInput.setCustomValidity('Минимальная цена составляет ' + priceInput.getAttribute('min'));
    } else {
      priceInput.setCustomValidity('');
    }
  });

  // user's avatar:
  var userAvatarHandler = addImg(userAvatarInput, userAvatarPreview);
  var photoHouseHandler = addImg(photoHouseInput, photoHousePreview,
      photoHousePreviewDiv);
  userAvatarInput.addEventListener('change', userAvatarHandler);
  photoHouseInput.addEventListener('change', photoHouseHandler);

})();
