'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var cardDestination = document.querySelector('.map__pins');
  var cardTemplate = document.querySelector('#card')
    .content.querySelector('.map__card');

  function appendCard(i, response) {
    var fragment = document.createDocumentFragment();
    var newElement = cardTemplate.cloneNode(true);
    fragment.appendChild(newElement);
    generateCards(newElement, i, response);
    // generation innerHTML for features
    generateFeatures(newElement, i, response);
    cardDestination.appendChild(fragment);
    newElement.style.display = 'block';
  }

  function onPinClick(i, response) {
    var openCard = document.getElementsByClassName('open')[0];
    // there is no open card:
    if (!openCard) {
      appendCard(i, response);
    } /* there is open card:*/ else {
      openCard.style.display = 'none';
      openCard.classList.remove('open');
      appendCard(i, response);
    }
  }
  window.onPinClick = onPinClick;

  function generatePins(newElement, i, arr) {
    newElement.classList.add('map__pin--new');
    newElement.style.left = arr[i].location.x - PIN_WIDTH / 2 + 'px';
    newElement.style.top = arr[i].location.y - PIN_HEIGHT + 'px';
    newElement.querySelector('img').src = arr[i].author.avatar;
    newElement.querySelector('img').alt = arr[i].offer.title;
    newElement.addEventListener('click', onPinClick.bind(null, i, arr));
    newElement.setAttribute('tabindex', '0');
  }

  function generateCards(newElement, i, arr) {
    newElement.style.display = 'none';
    newElement.classList.add('open');
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
    newElement.querySelector('.popup__close').addEventListener('click', window.util.onCloseButtonClick);
  }

  function appendPins(numberOfPins, template, destination, arr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < numberOfPins; i++) {
      var newElement = template.cloneNode(true);
      fragment.appendChild(newElement);
      generatePins(newElement, i, arr);
    }
    destination.appendChild(fragment);
  }

  window.appendPins = appendPins;

})();
