'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  window.util = {
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
    },
    // activation/deactivation of the form
    toggleFormAvailability: function (collection, isDisabled) {
      for (var i = 0; i < collection.length; i++) {
        collection[i].disabled = isDisabled;
      }
    },
  };

})();
