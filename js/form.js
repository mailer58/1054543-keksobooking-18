'use strict';

(function () {
  var NOTICES_QUANTITY = 8;
  var ENTER_KEYCODE = 13;
  var DELETE_KEYCODE = 46;
  var ESC_KEYCODE = 27;
  var MIN_BUNGALO_PRICE = 0;
  var MIN_FLAT_PRICE = 1000;
  var MIN_HOUSE_PRICE = 5000;
  var MIN_PALACE_PRICE = 10000;
  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 87;
  var PIN_INIT_WIDTH = 156;
  var PIN_INIT_HEIGHT = 156;
  var PIN_INIT_TOP = '375px';
  var PIN_INIT_LEFT = '570px';

  var pinDestination = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin')
    .content.querySelector('.map__pin');
  var cardDestination = document.querySelector('.map__pins');
  var cardTemplate = document.querySelector('#card')
    .content.querySelector('.map__card');
  var adForm = document.querySelector('.ad-form');
  var pinMain = document.querySelector('.map__pin');
  var cardsCollection = document.getElementsByClassName('map__card');
  var pinsCollection = document.getElementsByClassName('map__pin--new');
  var roomNumber = adForm.querySelector('#room_number');
  var guestNumber = adForm.querySelector('#capacity');
  var adFormElements = document.querySelectorAll('.ad-form input, .ad-form select');
  var mapFiltersElements = document.querySelectorAll('.map__filters input, .map__filters select');
  var priceInput = document.querySelector('#price');
  var titleInput = document.querySelector('#title');
  var houseType = document.querySelector('#type');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var address = document.querySelector('#address');
  var mapFaded = document.getElementsByClassName('map--faded')[0];

  function onPopupEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      var openCard = document.querySelector('.open');
      if (openCard) {
        openCard.style.display = 'none';
        openCard.classList.remove('open');
      }
    }
  }

  // activation/deactivation of form
  function switchForm(collection, isDisabled) {
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

  function activatePage() {
    adForm.classList.remove('ad-form--disabled');
    window.util.setAddress(pinMain.style.left, PIN_MAIN_WIDTH / 2, pinMain.style.top, PIN_MAIN_HEIGHT);
    document.querySelector('.map').classList.remove('map--faded');
    switchForm(adFormElements, false);
    switchForm(mapFiltersElements, false);
    window.getNewElements(NOTICES_QUANTITY, cardTemplate, cardDestination, 'cards');
    window.getNewElements(NOTICES_QUANTITY, pinTemplate, pinDestination, 'pins');
    adForm.addEventListener('change', checkSelects);
    // set address input readonly:
    address.readOnly = true;
    // disable pinMain when page is activated
  }

  function deactivatePage() {
    adForm.classList.add('ad-form--disabled');
    document.querySelector('.map').classList.add('map--faded');
    switchForm(adFormElements, true);
    switchForm(mapFiltersElements, true);
    pinMain.style.top = PIN_INIT_TOP;
    pinMain.style.left = PIN_INIT_LEFT;
    // set Address for initial pin
    window.util.setAddress(pinMain.style.left, PIN_INIT_WIDTH / 2, pinMain.style.top, PIN_INIT_HEIGHT / 2);
    if (mapFaded) {
      /* // remove eventListeners for pins (don't work!):
      for (var i = 1; i < pinsCollection.length; i++) {
        pinsCollection[i].removeEventListener('click', onPinClick);
        // console.log(pinsCollection[i]);
      }*/

      // remove Html collection of pins:
      while (pinsCollection.length) {
        pinsCollection[0].parentNode.removeChild(pinsCollection[0]);
      }

      // remove eventListeners for button 'Close'
      for (var i = 0; i < cardsCollection.length; i++) {
        cardsCollection[i].querySelector('.popup__close').removeEventListener('click', window.util.onCloseButtonClick);
      }

      // remove Html collection of cards:
      while (cardsCollection.length) {
        cardsCollection[0].parentNode.removeChild(cardsCollection[0]);
      }
    }
  }


  checkGuestsRoomsCorrespondence();
  // set correct number of guests
  guestNumber[2].selected = true;
  // set min price for flat:
  priceInput.setAttribute('min', '1000');
  priceInput.setAttribute('placeholder', '1000');
  // set Address for initial pin
  window.util.setAddress(pinMain.style.left, PIN_INIT_WIDTH / 2, pinMain.style.top, PIN_INIT_HEIGHT / 2);

  deactivatePage();

  // enable form:
  pinMain.addEventListener('mousedown', function (evt) {
    if (document.querySelector('.map--faded')) {
      activatePage(evt);
    } else {
      window.onPinMove(evt);
    }
  });

  pinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      activatePage();
    }
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === DELETE_KEYCODE) {
      deactivatePage();
    }
    onPopupEscPress(evt);
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

})();