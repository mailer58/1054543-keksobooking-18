'use strict';

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';

  window.backend = {
    // download data:
    load: function load(onDownload, onDownloadError) {
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

      xhr.timeout = 10000;

      xhr.open('GET', DOWNLOAD_URL);
      xhr.send();
    }, // upload data:
    save: function save(data, onUpload, onUploadError) {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onUpload(data);
        } else {
          onUploadError();
        }
      });
      xhr.addEventListener('error', function () {
        onUploadError();
      });
      xhr.addEventListener('timeout', function () {
        onUploadError();
      });

      xhr.timeout = 10000;
      xhr.open('POST', UPLOAD_URL);

      xhr.send(new FormData(data));
    }
  };
})();
