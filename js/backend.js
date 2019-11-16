'use strict';

(function () {
  var SUCCESS_LOAD = 200;
  var TIMEOUT = 10000;

  window.backend = {
    load: function (url, method, onLoadSuccess, onLoadError, data) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_LOAD) {
          if (data) {
            onLoadSuccess(data);
          } else {
            onLoadSuccess(xhr.response);
          }
        } else {
          onLoadError();
        }
      });
      xhr.addEventListener('error', function () {
        onLoadError();
      });
      xhr.addEventListener('timeout', function () {
        onLoadError();
      });

      xhr.timeout = TIMEOUT;

      xhr.open(method, url);
      if (data) {
        xhr.send(new FormData(data));
      } else {
        xhr.send();
      }
    },
  };
})();
