'use strict';

var NOTICES_QUANTITY = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var offerType = ['palace', 'flat', 'house', 'bungalo'];
var times = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking',
  'washer', 'elevator', 'conditioner'
];

var pinDestination = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
  .content.querySelector('.map__pin');
var bookingMap = document.querySelector('.map');

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
        type: offerType[getRandomNumber(offerType.length)],
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

function getNewElements(numberOfCopy, template, arr, destination) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < numberOfCopy; i++) {
    var newElement = template.cloneNode(true);
    fragment.appendChild(newElement);
    newElement.style.left = arr[i].location.x - PIN_WIDTH / 2 + 'px';
    newElement.style.top = arr[i].location.y - PIN_HEIGHT + 'px';
    newElement.querySelector('img').src = arr[i].author.avatar;
    newElement.querySelector('img').alt = arr[i].offer.title;
  }
  destination.appendChild(fragment);
}
bookingMap.classList.remove('map--faded');
var notices = generateNotices(NOTICES_QUANTITY);
getNewElements(NOTICES_QUANTITY, pinTemplate, notices, pinDestination);
