'use strict';

var NOTICES_QUANTITY = 8;
var notices = [];
var offerType = ['palace', 'flat', 'house', 'bungalo'];
var times = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking',
  'washer', 'elevator', 'conditioner'
];

var pinDestination = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin')
  .content.querySelector('.map__pin');
var showMap = document.querySelector('.map');

function random(arr) {
  return Math.floor(Math.random() * arr.length);
}

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
  var randomArrayLength = (random(arr) !== 0) ? random(arr) : 1;
  // generation of random array:
  for (i = 0; i < randomArrayLength; i++) {
    var randomIndex = random(copyArray);
    randomArray[i] = copyArray[randomIndex];
    copyArray.splice(randomIndex, 1);
  }
  return randomArray;
}

showMap.classList.remove('map--faded');

// array of links:
function getLinksArray(min, max, linkBegining, imgExtension) {
  var randomArray = [];
  var randomArrayLength = getRandomIntegerFromDiapason(min, max);
  for (var i = 0; i < randomArrayLength; i++) {
    randomArray[i] = linkBegining + (i + 1) + imgExtension;
  }
  return randomArray;
}

function generateNotices(arr) {
  for (var i = 0; i < NOTICES_QUANTITY; i++) {
    arr[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Заголовок объявления',
        address: getRandomNumber(1000) + ',' + getRandomNumber(10000),
        price: getRandomNumber(10000),
        type: offerType[random(offerType)],
        rooms: getRandomNumber(10),
        guests: getRandomNumber(10),
        checkin: times[random(times)],
        checkout: times[random(times)],
        features: getRandomArray(features),
        description: 'Описание',
        photos: getLinksArray(1, 3, 'http://o0.github.io/assets/images/tokyo/hotel', '.jpg')
      },
      location: {
        x: getRandomNumber(1201),
        y: getRandomIntegerFromDiapason(130, 630)
      }
    };
  }
}

function getNewElements(numberOfCopy, template, arr, destination) {
  var fragment = document.createDocumentFragment();
  var pinWidth = 50;
  var pinHeight = 70;
  for (var i = 0; i < numberOfCopy; i++) {
    var newElement = template.cloneNode(true);
    fragment.appendChild(newElement);
    newElement.style.left = arr[i].location.x - pinWidth / 2 + 'px';
    newElement.style.top = arr[i].location.y - pinHeight + 'px';
    newElement.querySelector('img').src = arr[i].author.avatar;
    newElement.querySelector('img').alt = arr[i].offer.title;
  }
  destination.appendChild(fragment);
}
generateNotices(notices);
getNewElements(NOTICES_QUANTITY, pinTemplate, notices, pinDestination);
