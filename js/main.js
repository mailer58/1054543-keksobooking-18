'use strict';

var NOTICES_QUANTITY = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PIN_INIT_WIDTH = 156;
var PIN_INIT_HEIGHT = 156;
var ENTER_KEYCODE = 13;

var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
var times = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking',
  'washer', 'elevator', 'conditioner'
];

var guestsRoomsMap = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};

var pinDestination = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
  .content.querySelector('.map__pin');
var cardDestination = document.body;
var cardTemplate = document.querySelector('#card')
  .content.querySelector('.map__card');
var adForm = document.querySelector('.ad-form');
var pinMain = document.querySelector('.map__pin');
var cardsCollection = document.getElementsByClassName('map__card');
var pinsCollection = document.getElementsByClassName('map__pin');
var roomNumber = adForm.querySelector('#room_number');
var guestNumber = adForm.querySelector('#capacity');
var adFormElements = document.querySelectorAll('.ad-form input, .ad-form select');
var mapFiltersElements = document.querySelectorAll('.map__filters input, .map__filters select');

function getRandomNumber(number) {
  return Math.floor(Math.random() * number);
}

function getRandomIntegerFromDiapason(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArray(arr) {
  var randomArray = [];
  var copyArray = [];
  for (var i = 0; i < arr.length; i++) {
    copyArray[i] = arr[i];
  }
  var randomArrayLength = getRandomIntegerFromDiapason(1, arr.length);
  // generation of random array:
  for (i = 0; i < randomArrayLength; i++) {
    var randomIndex = getRandomNumber(copyArray.length);
    randomArray[i] = copyArray[randomIndex];
    copyArray.splice(randomIndex, 1);
  }
  return randomArray;
}

// array of links:
function getLinksArray(min, max, linkBegining, imgExtension) {
  var randomArray = [];
  var randomArrayLength = getRandomIntegerFromDiapason(min, max);
  for (var i = 0; i < randomArrayLength; i++) {
    randomArray[i] = linkBegining + (i + 1) + imgExtension;
  }
  return randomArray;
}

function onCloseButtonClick(evt) {
  evt.target.closest('.popup').style.display = 'none';
}

function generateNotices(noticesQuantity) {
  var notices = [];
  for (var i = 0; i < noticesQuantity; i++) {
    notices[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Заголовок объявления',
        address: getRandomNumber(1000) + ',' + getRandomNumber(10000),
        price: getRandomNumber(10000),
        type: offerTypes[getRandomNumber(offerTypes.length)],
        rooms: getRandomNumber(10),
        guests: getRandomNumber(10),
        checkin: times[getRandomNumber(times.length)],
        checkout: times[getRandomNumber(times.length)],
        features: getRandomArray(features),
        description: 'Описание',
        photos: getLinksArray(1, 10, 'http://o0.github.io/assets/images/tokyo/hotel', '.jpg')
      },
      location: {
        x: getRandomNumber(1201),
        y: getRandomIntegerFromDiapason(130, 630)
      }
    };
  }
  return notices;
}

function onPinClick(i) {
  return function () {
    var openCard = document.querySelector('.open');
    // there is no open card:
    if (!openCard) {
      cardsCollection[i].style.display = 'block';
      cardsCollection[i].classList.add('open');
    } /* there is open card:*/ else {
      openCard.style.display = 'none';
      openCard.classList.remove('open');
      cardsCollection[i].style.display = 'block';
      cardsCollection[i].classList.add('open');
    }
  };
}

function generatePins(newElement, i, arr) {
  newElement.classList.add('pin' + i);
  newElement.style.left = arr[i].location.x - PIN_WIDTH / 2 + 'px';
  newElement.style.top = arr[i].location.y - PIN_HEIGHT + 'px';
  newElement.querySelector('img').src = arr[i].author.avatar;
  newElement.querySelector('img').alt = arr[i].offer.title;
  newElement.addEventListener('click', onPinClick(i));
}

function generateCards(newElement, i, arr) {
  newElement.style.display = 'none';
  newElement.querySelector('.popup__avatar').src = arr[i].author.avatar;
  newElement.querySelector('.popup__title').textContent = arr[i].offer.title;
  newElement.querySelector('.popup__text--address').textContent = arr[i].offer.address;
  newElement.querySelector('.popup__text--price').innerHTML = arr[i].offer.price + '&#x20bd;';
  newElement.querySelector('.popup__type').textContent = arr[i].offer.type;
  newElement.querySelector('.popup__text--capacity').textContent = arr[i].offer.rooms + ' комнаты для ' + arr[i].offer.guests + ' гостей';
  newElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + arr[i].offer.checkin + ', выезд до ' + arr[i].offer.checkout;
}

function generateFeatures(newElement, i, arr) {
  var featuresHtml = [];
  for (var j = 0; j < arr[i].offer.features.length; j++) {
    featuresHtml[j] = '<li class="popup__feature popup__feature--' + arr[i].offer.features[j] + '"></li>';
  }
  newElement.querySelector('.popup__features').innerHTML = featuresHtml.join('');
  newElement.querySelector('.popup__description').textContent = arr[i].offer.description;
  // generation innerHTML for photo
  var photosHtml = [];
  for (var l = 0; l < arr[i].offer.photos.length; l++) {
    photosHtml[l] = '<img src="' + arr[i].offer.photos[l] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
  }
  newElement.querySelector('.popup__photos').innerHTML = photosHtml.join('');
  newElement.querySelector('.popup__close').addEventListener('click', onCloseButtonClick);
}

function getNewElements(numberOfCopy, template, destination, newElementName) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < numberOfCopy; i++) {
    var newElement = template.cloneNode(true);
    fragment.appendChild(newElement);
    switch (newElementName) {
      // generate pins
      case 'pins':
        generatePins(newElement, i, notices);
        break;
        /* generate cards */
      case 'cards':
        generateCards(newElement, i, notices);
        // generation innerHTML for features
        generateFeatures(newElement, i, notices);
        break;
    }
  }
  destination.appendChild(fragment);
}

// activation/deactivation of form
function switchForm(collection, isDisabled) {
  for (var i = 0; i < collection.length; i++) {
    collection[i].disabled = isDisabled;
  }
}

function checkGuestRoomCorrespondence(evt) {
  var roomsNumber = Number(adForm.querySelector('#room_number').value);
  var guestsNumber = Number(adForm.querySelector('#capacity').value);

  if (guestsRoomsMap[roomsNumber].indexOf(guestsNumber) === -1) {
    evt.target.setCustomValidity('Число гостей и комнта должно совпадать');
  } else {
    evt.target.setCustomValidity('');
  }
}

function activatePage() {
  adForm.classList.remove('ad-form--disabled');
  document.querySelector('.map').classList.remove('map--faded');
  switchForm(adFormElements, false);
  switchForm(mapFiltersElements, false);
  getNewElements(NOTICES_QUANTITY, cardTemplate, cardDestination, 'cards');
  getNewElements(NOTICES_QUANTITY, pinTemplate, pinDestination, 'pins');
  setAddress(pinMain.style.left, PIN_WIDTH / 2, pinMain.style.top, PIN_HEIGHT);
  roomNumber.addEventListener('change', checkGuestRoomCorrespondence);
  guestNumber.addEventListener('change', checkGuestRoomCorrespondence);
}

function deactivatePage() {
  adForm.classList.add('ad-form--disabled');
  document.querySelector('.map').classList.add('map--faded');
  switchForm(adFormElements, true);
  switchForm(mapFiltersElements, true);

  // remove eventListeners for pins (don't work!):
  for (var i = 1; i < pinsCollection.length; i++) {
    pinsCollection[i].removeEventListener('click', onPinClick);
    // console.log(pinsCollection[i]);
  }

  // remove Html collection of pins:
  // avoiding removing main-pin from map:
  while (pinsCollection.length > 1) {
    pinsCollection[1].parentNode.removeChild(pinsCollection[1]);
  }

  // remove eventListeners for button 'Close'
  for (i = 0; i < cardsCollection.length; i++) {
    cardsCollection[i].querySelector('.popup__close').removeEventListener('click', onCloseButtonClick);
  }

  // remove Html collection of cards:
  while (cardsCollection.length) {
    cardsCollection[0].parentNode.removeChild(cardsCollection[0]);
  }
  // set Address for initial pin
  setAddress(pinMain.style.left, PIN_INIT_WIDTH / 2, pinMain.style.top, PIN_INIT_HEIGHT / 2);
}

function setAddress(left, width, top, height) {
  var leftPosition = Math.floor(parseInt(left, 10) + width);
  var topPosition = Math.floor(parseInt(top, 10) + height);
  var addressForm = leftPosition + ', ' + topPosition;
  document.querySelector('#address').value = addressForm;
}

// set Address for initial pin
setAddress(pinMain.style.left, PIN_INIT_WIDTH / 2, pinMain.style.top, PIN_INIT_HEIGHT / 2);

deactivatePage();
var notices = generateNotices(NOTICES_QUANTITY);

// enable form:
pinMain.addEventListener('mousedown', function () {
  activatePage();
});

pinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activatePage();
  }
});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    deactivatePage();
  }
});
