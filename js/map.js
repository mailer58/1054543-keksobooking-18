'use strict';

(function () {

  var ENTER_KEYCODE = 13;

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 87;

  var MAP_WIDTH = 1200;
  var MAP_LEFT_X = 0;
  var MAP_TOP_MIN = 130;
  var MAP_TOP_MAX = 630;
  var PIN_LEFT_MIN = MAP_LEFT_X - MAIN_PIN_WIDTH / 2;
  var PIN_LEFT_MAX = MAP_WIDTH - MAIN_PIN_WIDTH / 2;
  var PIN_TOP_MIN = MAP_TOP_MIN - MAIN_PIN_HEIGHT;
  var PIN_TOP_MAX = MAP_TOP_MAX - MAIN_PIN_HEIGHT;
  var MAX_PINS_NUMBER = 5;

  var mainPin = document.querySelector('.map__pin');
  var address = document.querySelector('#address');
  window.pinsListeners = [];

  var cardDestination = document.querySelector('.map__pins');
  var cardTemplate = document.querySelector('#card')
    .content.querySelector('.map__card');

  function appendCard(note) {
    var fragment = document.createDocumentFragment();
    var newElement = cardTemplate.cloneNode(true);
    fragment.appendChild(newElement);
    generateCard(newElement, note);
    // generation innerHTML for features
    generateFeatures(newElement, note);
    cardDestination.appendChild(fragment);
    newElement.style.display = 'block';
  }

  function onPinClick(note, evt) {
    var openCard = document.getElementsByClassName('open')[0];
    if (openCard) {
      window.map.closeCard();
    }
    evt.currentTarget.classList.add('map__pin--active');
    appendCard(note);
  }
  window.onPinClick = onPinClick;

  function generatePin(newElement, note) {
    newElement.classList.add('map__pin--new');
    newElement.style.left = note.location.x - PIN_WIDTH / 2 + 'px';
    newElement.style.top = note.location.y - PIN_HEIGHT + 'px';
    newElement.querySelector('img').src = note.author.avatar;
    newElement.querySelector('img').alt = note.offer.title;

    var onPinClickBinded = onPinClick.bind(null, note);
    window.pinsListeners.push(onPinClickBinded);
    newElement.addEventListener('click', onPinClickBinded);
    newElement.setAttribute('tabindex', '0');
  }

  function generateCard(newElement, note) {
    newElement.style.display = 'none';
    newElement.classList.add('open');
    newElement.querySelector('.popup__avatar').src = note.author.avatar;
    newElement.querySelector('.popup__title').textContent = note.offer.title;
    newElement.querySelector('.popup__text--address').textContent = note.offer.address;
    newElement.querySelector('.popup__text--price').innerHTML = note.offer.price + '&#x20bd;';
    newElement.querySelector('.popup__type').textContent = note.offer.type;
    newElement.querySelector('.popup__text--capacity').textContent = note.offer.rooms + ' комнаты для ' + note.offer.guests + ' гостей';
    newElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + note.offer.checkin + ', выезд до ' + note.offer.checkout;
  }

  function generateFeatures(newElement, note) {
    var featuresHtml = [];
    for (var j = 0; j < note.offer.features.length; j++) {
      featuresHtml[j] = '<li class="popup__feature popup__feature--' + note.offer.features[j] + '"></li>';
    }
    newElement.querySelector('.popup__features').innerHTML = featuresHtml.join('');
    newElement.querySelector('.popup__description').textContent = note.offer.description;
    // generation innerHTML for photo
    var photosHtml = [];
    for (var l = 0; l < note.offer.photos.length; l++) {
      photosHtml[l] = '<img src="' + note.offer.photos[l] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
    }
    newElement.querySelector('.popup__photos').innerHTML = photosHtml.join('');
    newElement.querySelector('.popup__close').addEventListener('click', window.map.onCloseButtonClick);
  }

  window.map = {
    onCloseButtonClick: function (evt) {
      evt.target.closest('.popup').removeEventListener('click', window.map.onCloseButtonClick);
      evt.target.closest('.popup').remove();
    },
    appendPins: function (template, destination, arr) {
      if (arr.length > MAX_PINS_NUMBER) {
        arr = arr.slice(0, MAX_PINS_NUMBER);
      }
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < arr.length; i++) {
        var newElement = template.cloneNode(true);
        fragment.appendChild(newElement);
        generatePin(newElement, arr[i]);
      }
      destination.appendChild(fragment);
    },
    closeCard: function () {
      var openCard = document.querySelector('.open');
      var activePin = document.getElementsByClassName('map__pin--new map__pin--active')[0];
      if (openCard) {
        openCard.classList.remove('open');
        openCard.querySelector('.popup__close').removeEventListener('click', window.map.onCloseButtonClick);
        openCard.remove();
        // desactivate current active pin:
        activePin.classList.remove('map__pin--active');
      }
    },
    // remove Html collection of pins:
    removePins: function () {
      var pinsCollection = document.getElementsByClassName('map__pin--new');
      // remove listeners of pins:
      for (var i = 0; i < pinsCollection.length; i++) {
        pinsCollection[i].removeEventListener('click', window.pinsListeners[i]);
      }
      // remove pins:
      while (pinsCollection.length) {
        pinsCollection[0].parentNode.removeChild(pinsCollection[0]);
      }
    },
  };

  // enable form:
  mainPin.addEventListener('mousedown', function (evt) {
    if (document.querySelector('.map--faded')) {
      window.page.activatePage();
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
      window.page.activatePage();
    }
  });

})();
