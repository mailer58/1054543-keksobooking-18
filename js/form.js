'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var DELETE_KEYCODE = 46;
  var ESC_KEYCODE = 27;

  var MIN_BUNGALO_PRICE = 0;
  var MIN_FLAT_PRICE = 1000;
  var MIN_HOUSE_PRICE = 5000;
  var MIN_PALACE_PRICE = 10000;

  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 87;
  var PIN_INIT_WIDTH = 156;
  var PIN_INIT_HEIGHT = 156;
  var PIN_INIT_TOP = '375px';
  var PIN_INIT_LEFT = '570px';
  var MAP_WIDTH = 1200;
  var MAP_LEFT_X = 0;
  var MAP_TOP_MIN = 130;
  var MAP_TOP_MAX = 630;
  var PIN_LEFT_MIN = MAP_LEFT_X - MAIN_PIN_WIDTH / 2;
  var PIN_LEFT_MAX = MAP_WIDTH - MAIN_PIN_WIDTH / 2;
  var PIN_TOP_MIN = MAP_TOP_MIN - MAIN_PIN_HEIGHT;
  var PIN_TOP_MAX = MAP_TOP_MAX - MAIN_PIN_HEIGHT;
  var PINS_NUMBER = 5;

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // elements of the map:
  var mainPin = document.querySelector('.map__pin');
  var pinsCollection = document.getElementsByClassName('map__pin--new');

  // elements of the form:
  var adForm = document.querySelector('.ad-form');
  var roomNumber = adForm.querySelector('#room_number');
  var guestNumber = adForm.querySelector('#capacity');
  var adFormElements = document.querySelectorAll('.ad-form input, .ad-form select');
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersElements = document.querySelectorAll('.map__filters input, .map__filters select');
  var priceInput = document.querySelector('#price');
  var titleInput = document.querySelector('#title');
  var houseType = document.querySelector('#type');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var address = document.querySelector('#address');
  var submitButton = document.querySelector('.ad-form__submit');
  var resetButton = document.querySelector('.ad-form__reset');
  var descriptionArea = document.querySelector('#description');
  // users images:
  var userAvatarInput = document.querySelector('.ad-form-header__input');
  var userAvatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoHouseInput = document.querySelector('.ad-form__input');
  var photoHousePreviewDiv = document.querySelector('.ad-form__photo');
  var features = document.querySelectorAll('.feature__checkbox');
  var photoHousePreview;

  // elements of the filter:
  var houseTypeFilter = document.querySelector('#housing-type');
  var priceFilter = document.querySelector('#housing-price');
  var roomsFilter = document.querySelector('#housing-rooms');
  var guestsFilter = document.querySelector('#housing-guests');
  var dishwasherFilter = document.querySelector('#filter-dishwasher');
  var wifiFilter = document.querySelector('#filter-wifi');
  var washerFilter = document.querySelector('#filter-washer');
  var parkingFilter = document.querySelector('#filter-parking');
  var elevatorFilter = document.querySelector('#filter-elevator');
  var conditionerFilter = document.querySelector('#filter-conditioner');

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
  var filteredData;

  function closeCard() {
    var openCard = document.querySelector('.open');
    if (openCard) {
      openCard.querySelector('.popup__close').removeEventListener('click', window.util.onCloseButtonClick);
      openCard.remove();
    }
  }

  // activation/deactivation of the form
  function toggleFormAvailability(collection, isDisabled) {
    for (var i = 0; i < collection.length; i++) {
      collection[i].disabled = isDisabled;
    }
  }

  function checkGuestsRoomsCorrespondence() {
    var guestsNumberArray = [];
    var roomsNumber = Number(adForm.querySelector('#room_number').value);
    for (var i = 0; i < roomNumber.length; i++) {
      if (Number(guestNumber[i].value) > 0) {
        guestsNumberArray.push(Number(guestNumber[i].value));
      } else {
        guestsNumberArray.push(100);
      }
      if (roomsNumber !== guestsNumberArray[i]) {
        guestNumber[i].disabled = true;
      } else {
        guestNumber[i].disabled = false;
      }
    }
    var guestsNumber = Number(adForm.querySelector('#capacity').value) > 0 ? Number(adForm.querySelector('#capacity').value) : 100;
    if (roomsNumber !== guestsNumber) {
      guestNumber.setCustomValidity('Число гостей и комнат должно совпадать');
    } else if (roomsNumber === guestsNumber) {
      guestNumber.setCustomValidity('');
    }
  }

  function setPriceInput(value) {
    priceInput.setAttribute('min', value);
    priceInput.setAttribute('placeholder', value);
  }

  function setMinPrice() {
    switch (houseType.value) {
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

  function checkSelects(evt) {
    if (evt.target.matches('#timein') || evt.target.matches('#timeout')) {
      setTime(evt);
    } else if (evt.target.matches('#type')) {
      setMinPrice();
    } else if (evt.target.matches('#room_number') || evt.target.matches('#capacity')) {
      checkGuestsRoomsCorrespondence();
    } else {
      return;
    }
  }

  function resetForm() {
    // restore default avatar:
    userAvatarPreview.setAttribute('src', 'img/muffin-grey.svg');
    // delete user's photos:
    var userPhotos = document.getElementsByClassName('new-img');
    if (userPhotos) {
      while (userPhotos.length) {
        userPhotos[0].parentNode.removeChild(userPhotos[0]);
      }
    }
    // reset title:
    titleInput.value = '';
    // set flat as an default option:
    houseType[1].selected = true;
    // reset price input:
    priceInput.value = '';
    // set min price for flat:
    priceInput.setAttribute('min', MIN_FLAT_PRICE);
    priceInput.setAttribute('placeholder', MIN_FLAT_PRICE);
    // set correct number of rooms and guests:
    roomNumber[0].selected = true;
    guestNumber[2].selected = true;
    // disable unnecessary options for guests:
    checkGuestsRoomsCorrespondence();
    // reset timeIn and timeOut:
    timeIn.selectedIndex = 0;
    timeOut.selectedIndex = 0;
    // reset checkboxs:
    for (var i = 0; i < features.length; i++) {
      if (features[i].checked) {
        features[i].checked = false;
      }
    }
    // reset textarea:
    descriptionArea.value = '';
    // center main pin:
    mainPin.style.left = PIN_INIT_LEFT;
    mainPin.style.top = PIN_INIT_TOP;
    var mapFaded = document.getElementsByClassName('map--faded')[0];
    if (!mapFaded) { // when the page is activated
      address.value = window.util.getFormattedAddress(mainPin.style.left, MAIN_PIN_WIDTH / 2, mainPin.style.top, MAIN_PIN_HEIGHT);
    } else {
      address.value = window.util.getFormattedAddress(mainPin.style.left, PIN_INIT_WIDTH / 2, mainPin.style.top, PIN_INIT_HEIGHT / 2);
    }
  }

  // remove Html collection of pins:
  function removePins() {
    while (pinsCollection.length) {
      pinsCollection[0].parentNode.removeChild(pinsCollection[0]);
    }
  }

  function activatePage() {
    adForm.classList.remove('ad-form--disabled');
    document.querySelector('.map').classList.remove('map--faded');
    // set main pin address:
    address.value = window.util.getFormattedAddress(mainPin.style.left, MAIN_PIN_WIDTH / 2, mainPin.style.top, MAIN_PIN_HEIGHT);
    // set eventListeners:
    adForm.addEventListener('change', checkSelects);
    adForm.addEventListener('submit', onSendButtonClick);
    adForm.addEventListener('reset', function (evt) {
      evt.preventDefault();
      resetForm();
    });
    mapFilters.addEventListener('change', window.util.debounce(filterServerData));
    // enable form:
    toggleFormAvailability(adFormElements, false);
    toggleFormAvailability(mapFiltersElements, false);
    submitButton.disabled = false;
    resetButton.disabled = false;
    // load data from server:
    window.backend.load(onDownload, onDownloadError);
  }

  function deactivatePage() {
    adForm.classList.add('ad-form--disabled');
    document.querySelector('.map').classList.add('map--faded');
    resetForm();
    // disable form:
    toggleFormAvailability(adFormElements, true);
    toggleFormAvailability(mapFiltersElements, true);
    submitButton.disabled = true;
    resetButton.disabled = true;

    /* // remove eventListeners for pins (don't work!):
    for (var i = 1; i < pinsCollection.length; i++) {
      pinsCollection[i].removeEventListener('click', onPinClick);
      // console.log(pinsCollection[i]);
    }*/

    // remove Html collection of pins:
    removePins();
    // remove eventListeners:
    adForm.removeEventListener('change', checkSelects);
    adForm.removeEventListener('submit', onSendButtonClick);
    adForm.removeEventListener('reset', function (evt) {
      evt.preventDefault();
      resetForm();
    });
  }

  function appendMessage(template, destination) {
    var newElement = template.cloneNode(true);
    destination.appendChild(newElement);
  }

  function onDownload(response) {
    window.appendPins(PINS_NUMBER, pinTemplate, pinDestination, response);
    serverData = response;
    return serverData;
  }

  function onUpload() {
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
      document.addEventListener('click', errorMessageHandler);
    };
  }

  // create error handlers based on template:
  var onDownloadError = onErrorTemplate(removeDownloadErrorMessage, 'download-error',
      'Ошибка загрузки данных с сервера');
  var onUploadError = onErrorTemplate(removeUploadErrorMessage, 'upload-error');

  // remove an message and its listener:
  function removeMessageTemplate(messageType, removeMessageListener) {
    var message = document.getElementsByClassName(messageType)[0];
    message.remove();
    document.removeEventListener('click', removeMessageListener);
  }

  function removeDownloadErrorMessage() {
    removeMessageTemplate('error', removeDownloadErrorMessage);
    activatePage();
  }

  function removeUploadErrorMessage() {
    removeMessageTemplate('error', removeUploadErrorMessage);
    window.backend.save(adForm, onUpload, onUploadError);
  }

  function removeSuccessMessage() {
    removeMessageTemplate('success', removeSuccessMessage);
    deactivatePage();
  }

  // send data to server:
  function onSendButtonClick(evt) {
    evt.preventDefault();
    window.backend.save(adForm, onUpload, onUploadError);
  }

  // filter data:
  function filterByHouseType() {
    if (houseTypeFilter.value !== 'any') {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.type === houseTypeFilter.value) {
          return notice;
        } else {
          return false;
        }
      });
    }
  }

  function filterByPrice() {
    if (priceFilter[1].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.price >= 10000 && notice.offer.price <= 50000) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (priceFilter[2].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.price < 10000) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (priceFilter[3].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.price > 50000) {
          return notice;
        } else {
          return false;
        }
      });
    }
  }

  function filterByRooms() {
    if (roomsFilter[1].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.rooms === 1) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (roomsFilter[2].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.rooms === 2) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (roomsFilter[3].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.rooms === 3) {
          return notice;
        } else {
          return false;
        }
      });
    }
  }

  function filterByGuests() {
    if (guestsFilter[1].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.guests === 2) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (guestsFilter[2].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.guests === 1) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (guestsFilter[3].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.guests === 0) {
          return notice;
        } else {
          return false;
        }
      });
    }

  }

  function filterByFeatures(filterName, featureName) {
    if (filterName.checked) {
      filteredData = filteredData.filter(function (notice) {
        for (var i = 0; i < notice.offer.features.length; i++) {
          if (notice.offer.features[i] === featureName) {
            return notice;
          }
        }
      });
    }
  }

  function filterServerData() {
    // clear the map:
    removePins();
    closeCard();
    // reset filtered data:
    filteredData = serverData;
    // filter data:
    filterByHouseType();
    filterByPrice();
    filterByRooms();
    filterByGuests();
    filterByFeatures(wifiFilter, 'wifi');
    filterByFeatures(dishwasherFilter, 'dishwasher');
    filterByFeatures(parkingFilter, 'parking');
    filterByFeatures(washerFilter, 'washer');
    filterByFeatures(elevatorFilter, 'elevator');
    filterByFeatures(conditionerFilter, 'conditioner');
    // show filtered data:
    var numberOfPins = filteredData.length < PINS_NUMBER ? filteredData.length : PINS_NUMBER;
    window.appendPins(numberOfPins, pinTemplate, pinDestination, filteredData);
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

  deactivatePage();

  // enable form:
  mainPin.addEventListener('mousedown', function (evt) {
    if (document.querySelector('.map--faded')) {
      activatePage();
    }
    // move Pin:
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      if ((mainPin.offsetLeft - shift.x) >= PIN_LEFT_MIN &&
        (mainPin.offsetLeft - shift.x) <= PIN_LEFT_MAX &&
        (mainPin.offsetTop - shift.y) >= PIN_TOP_MIN &&
        (mainPin.offsetTop - shift.y) <= PIN_TOP_MAX) {
        mainPin.style.top = mainPin.offsetTop - shift.y + 'px';
        mainPin.style.left = mainPin.offsetLeft - shift.x + 'px';
      }
      address.value = window.util.getFormattedAddress(mainPin.style.left, MAIN_PIN_WIDTH / 2, mainPin.style.top, MAIN_PIN_HEIGHT);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      address.value = window.util.getFormattedAddress(mainPin.style.left, MAIN_PIN_WIDTH / 2, mainPin.style.top, MAIN_PIN_HEIGHT);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      activatePage();
    }
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === DELETE_KEYCODE) {
      deactivatePage();
    }
    if (evt.keyCode === ESC_KEYCODE) {
      var successMessage = document.getElementsByClassName('success')[0];
      var errorDownloadMessage = document.getElementsByClassName('download-error')[0];
      var errorUploadMessage = document.getElementsByClassName('upload-error')[0];

      closeCard();

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
