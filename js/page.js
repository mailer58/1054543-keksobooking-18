'use strict';

(function () {

  var MIN_FLAT_PRICE = 1000;
  var PIN_INIT_WIDTH = 156;
  var PIN_INIT_HEIGHT = 156;
  var PIN_INIT_TOP = '375px';
  var PIN_INIT_LEFT = '570px';

  var adForm = document.querySelector('.ad-form');
  var adFormElements = document.querySelectorAll('.ad-form input, .ad-form select');
  var mapFiltersElements = document.querySelectorAll('.map__filters input, .map__filters select');
  var submitButton = document.querySelector('.ad-form__submit');
  var resetButton = document.querySelector('.ad-form__reset');
  var mainPin = document.querySelector('.map__pin');
  var mapFilters = document.querySelector('.map__filters');
  var mapFeatures = document.querySelectorAll('.map__checkbox');


  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 87;

  // elements of the form:
  var roomNumber = adForm.querySelector('#room_number');
  var guestNumber = adForm.querySelector('#capacity');
  var priceInput = document.querySelector('#price');
  var titleInput = document.querySelector('#title');
  var houseType = document.querySelector('#type');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var address = document.querySelector('#address');
  var features = document.querySelectorAll('.feature__checkbox');
  var descriptionArea = document.querySelector('#description');
  // users images:
  var userAvatarPreview = document.querySelector('.ad-form-header__preview img');

  window.page = {
    activatePage: function () {
      adForm.classList.remove('ad-form--disabled');
      document.querySelector('.map').classList.remove('map--faded');
      // set main pin address:
      address.value = window.util.getFormattedAddress(mainPin.style.left, MAIN_PIN_WIDTH / 2, mainPin.style.top, MAIN_PIN_HEIGHT);
      // set eventListeners:
      adForm.addEventListener('change', window.form.onFormChange);
      adForm.addEventListener('submit', window.form.onSendButtonClick);
      adForm.addEventListener('reset', function (evt) {
        evt.preventDefault();
        window.page.deactivatePage();
      });
      mapFilters.addEventListener('change', window.filters.onFiltersChange);
      mapFilters.addEventListener('change', window.util.debounce(window.form.filterServerData));
      // enable form:
      window.util.toggleFormAvailability(adFormElements, false);
      window.util.toggleFormAvailability(mapFiltersElements, false);
      submitButton.disabled = false;
      resetButton.disabled = false;
      // load data from server:
      window.backend.load(window.form.onDownload, window.form.onDownloadError);
    },
    deactivatePage: function () {
      adForm.classList.add('ad-form--disabled');
      document.querySelector('.map').classList.add('map--faded');
      // disable form:
      window.util.toggleFormAvailability(adFormElements, true);
      window.util.toggleFormAvailability(mapFiltersElements, true);
      submitButton.disabled = true;
      resetButton.disabled = true;
      // remove eventListeners:
      adForm.removeEventListener('change', window.form.onFormChange);
      adForm.removeEventListener('submit', window.form.onSendButtonClick);
      adForm.removeEventListener('reset', function (evt) {
        evt.preventDefault();
        window.page.deactivatePage();
      });
      mapFilters.removeEventListener('change', window.filters.onFiltersChange);
      mapFilters.removeEventListener('change', window.util.debounce(window.form.filterServerData));

      // restore default avatar:
      userAvatarPreview.setAttribute('src', 'img/muffin-grey.svg');
      // delete user's photos:
      var userPhotos = document.getElementsByClassName('new-img');
      if (userPhotos) {
        while (userPhotos.length) {
          userPhotos[0].parentNode.removeChild(userPhotos[0]);
        }
      }
      // reset title:
      titleInput.value = '';
      // set flat as an default option:
      houseType[1].selected = true;
      // reset price input:
      priceInput.value = '';
      // set min price for flat:
      priceInput.setAttribute('min', MIN_FLAT_PRICE);
      priceInput.setAttribute('placeholder', MIN_FLAT_PRICE);
      // set correct number of rooms and guests:
      roomNumber[0].selected = true;
      guestNumber[2].selected = true;
      // disable unnecessary options for guests:
      window.form.checkGuestsRoomsCorrespondence();
      // reset timeIn and timeOut:
      timeIn.selectedIndex = 0;
      timeOut.selectedIndex = 0;
      // reset checkboxes of the form:
      window.form.resetCheckBoxes(features);
      // reset textarea:
      descriptionArea.value = '';
      // center main pin:
      mainPin.style.left = PIN_INIT_LEFT;
      mainPin.style.top = PIN_INIT_TOP;
      var mapFaded = document.getElementsByClassName('map--faded')[0];
      address.readOnly = true;
      if (!mapFaded) { // when the page is activated
        address.value = window.util.getFormattedAddress(mainPin.style.left, MAIN_PIN_WIDTH / 2, mainPin.style.top, MAIN_PIN_HEIGHT);
      } else {
        address.value = window.util.getFormattedAddress(mainPin.style.left, PIN_INIT_WIDTH / 2, mainPin.style.top, PIN_INIT_HEIGHT / 2);
      }
      // reset filters:
      var filterSelects = mapFilters.querySelectorAll('select');
      for (var i = 0; i < filterSelects.length; i++) {
        filterSelects[i].selectedIndex = 0;
      }
      // reset checkboxes of the filter:
      window.form.resetCheckBoxes(mapFeatures);
      // close card:
      window.map.closeCard();
      // remove Html collection of pins:
      window.map.removePins();
    }
  };
})();
