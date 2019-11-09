'use strict';

(function () {
  window.backend = {
    load: function load(onDownload, onDownloadError) {
      var URL = 'https://js.dump.academy/keksobooking/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onDownload(xhr.response);
        } else {
          onDownloadError();
        }
      });
      xhr.addEventListener('error', function () {
        onDownloadError();
      });
      xhr.addEventListener('timeout', function () {
        onDownloadError();
      });

      xhr.timeout = 15000; // 10s

      xhr.open('GET', URL);
      xhr.send();
    }

  };
})();
