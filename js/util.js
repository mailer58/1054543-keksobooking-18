'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  window.util = {
    getRandomNumber: function (number) {
      return Math.floor(Math.random() * number);
    },
    getRandomIntegerFromDiapason: function getRandomIntegerFromDiapason(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomArray: function (arr) {
      var randomArray = [];
      var copyArray = [];
      for (var i = 0; i < arr.length; i++) {
        copyArray[i] = arr[i];
      }
      var randomArrayLength = this.getRandomIntegerFromDiapason(1, arr.length);
      // generation of random array:
      for (i = 0; i < randomArrayLength; i++) {
        var randomIndex = this.getRandomNumber(copyArray.length);
        randomArray[i] = copyArray[randomIndex];
        copyArray.splice(randomIndex, 1);
      }
      return randomArray;
    },
    // array of links:
    getLinksArray: function (min, max, linkBegining, imgExtension) {
      var randomArray = [];
      var randomArrayLength = this.getRandomIntegerFromDiapason(min, max);
      for (var i = 0; i < randomArrayLength; i++) {
        randomArray[i] = linkBegining + (i + 1) + imgExtension;
      }
      return randomArray;
    },
    onCloseButtonClick: function (evt) {
      evt.target.closest('.popup').removeEventListener('click', window.util.onCloseButtonClick);
      evt.target.closest('.popup').remove();
    },
    getFormattedAddress: function (left, width, top, height) {
      var leftPosition = Math.floor(parseInt(left, 10) + width);
      var topPosition = Math.floor(parseInt(top, 10) + height);
      return leftPosition + ', ' + topPosition;
    },
    debounce: function (func) {
      var lastTimeout = null;
      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          func.apply(null, parameters);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };

})();
