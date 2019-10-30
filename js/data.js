'use strict';

(function () {
  var NOTICES_QUANTITY = 8;

  var notices = [];
  var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
  var times = ['12:00', '13:00', '14:00'];
  var features = ['wifi', 'dishwasher', 'parking',
    'washer', 'elevator', 'conditioner'
  ];

  function generateNotices(noticesQuantity) {
    for (var i = 0; i < noticesQuantity; i++) {
      notices[i] = {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
          title: 'Заголовок объявления',
          address: window.util.getRandomNumber(1000) + ',' + window.util.getRandomNumber(10000),
          price: window.util.getRandomNumber(10000),
          type: offerTypes[window.util.getRandomNumber(offerTypes.length)],
          rooms: window.util.getRandomNumber(10),
          guests: window.util.getRandomNumber(10),
          checkin: times[window.util.getRandomNumber(times.length)],
          checkout: times[window.util.getRandomNumber(times.length)],
          features: window.util.getRandomArray(features),
          description: 'Описание',
          photos: window.util.getLinksArray(1, 10, 'http://o0.github.io/assets/images/tokyo/hotel', '.jpg')
        },
        location: {
          x: window.util.getRandomNumber(1201),
          y: window.util.getRandomIntegerFromDiapason(130, 630)
        }
      };
    }
    return notices;
  }

  notices = generateNotices(NOTICES_QUANTITY);
  window.notices = notices;

})();
