'use strict';

(function() {
  var ENTER_KEYCODE = 13;
  var DELETE_KEYCODE = 46;
  var ESC_KEYCODE = 27;

  var MIN_BUNGALO_PRICE = 0;
  var MIN_FLAT_PRICE = 1000;
  var MIN_HOUSE_PRICE = 5000;
  var MIN_PALACE_PRICE = 10000;

  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 87;

  var MAP_WIDTH = 1200;
  var MAP_LEFT_X = 0;
  var MAP_TOP_MIN = 130;
  var MAP_TOP_MAX = 630;
  var PIN_LEFT_MIN = MAP_LEFT_X - MAIN_PIN_WIDTH / 2;
  var PIN_LEFT_MAX = MAP_WIDTH - MAIN_PIN_WIDTH / 2;
  var PIN_TOP_MIN = MAP_TOP_MIN - MAIN_PIN_HEIGHT;
  var PIN_TOP_MAX = MAP_TOP_MAX - MAIN_PIN_HEIGHT;
  var PINS_NUMBER = 5;

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // elements of the map:
  var mainPin = document.querySelector('.map__pin');
  var pinsCollection = document.getElementsByClassName('map__pin--new');
  var filterForm = document.querySelector('.map__filters');


  // elements of the form:
  var adForm = document.querySelector('.ad-form');
  var mapFilters = document.querySelector('.map__filters');
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
  var userAvatarInput = document.querySelector('.ad-form-header__input');
  var userAvatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoHouseInput = document.querySelector('.ad-form__input');
  var photoHousePreviewDiv = document.querySelector('.ad-form__photo');
  var photoHousePreview;


  // elements of the filter:
  var typeFilter = document.querySelector('#housing-type');
  var priceFilter = document.querySelector('#housing-price');
  var roomsFilter = document.querySelector('#housing-rooms');
  var guestsFilter = document.querySelector('#housing-guests');

  // vars for cloning:
  var pinDestination = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin')
    .content.querySelector('.map__pin');
  var errorDestination = document.querySelector('main');
  var errorTemplate = document.querySelector('#error')
    .content.querySelector('.error');
  var successDestination = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
    .content.querySelector('.success');

  var serverData;
  var filteredData;

  window.form = {
    resetCheckBoxes: function(checkBoxes) {
      for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
          checkBoxes[i].checked = false;
        }
      }
    },
    checkSelects: function(evt) {
      if (evt.target.matches('#timein') || evt.target.matches('#timeout')) {
        setTime(evt);
      } else if (evt.target.matches('#type')) {
        setMinPrice();
      } else if (evt.target.matches('#room_number') || evt.target.matches('#capacity')) {
        checkGuestsRoomsCorrespondence();
      } else {
        return;
      }
    },
    // send data to server:
    onSendButtonClick: function(evt) {
      evt.preventDefault();
      window.backend.save(adForm, onUpload, window.form.onUploadError);
    },
    filterServerData: function() {
      // clear the map:
      window.util.closeCard();
      window.util.removePins();
      // reset filtered data:
      filteredData = serverData;
      // filter data:
      getFilteredData();
      // show filtered data:
      var numberOfPins = filteredData.length < PINS_NUMBER ? filteredData.length : PINS_NUMBER;
      window.appendPins(numberOfPins, pinTemplate, pinDestination, filteredData);
    },
    onDownload: function(response) {
      window.appendPins(PINS_NUMBER, pinTemplate, pinDestination, response);
      serverData = response;
      return serverData;
    },
    // create error handlers based on template:
    onDownloadError: onErrorTemplate(removeDownloadErrorMessage, 'download-error',
      'Ошибка загрузки данных с сервера'),
    onUploadError: onErrorTemplate(removeUploadErrorMessage, 'upload-error'),
  };

  function setPriceInput(value) {
    priceInput.setAttribute('min', value);
    priceInput.setAttribute('placeholder', value);
  }

  function setMinPrice() {
    switch (houseType.value) {
      case 'bungalo':
        setPriceInput(MIN_BUNGALO_PRICE);
        break;
      case 'flat':
        setPriceInput(MIN_FLAT_PRICE);
        break;
      case 'house':
        setPriceInput(MIN_HOUSE_PRICE);
        break;
      case 'palace':
        setPriceInput(MIN_PALACE_PRICE);
        break;
    }
  }

  function setTime(evt) {
    timeIn.selectedIndex = evt.target.selectedIndex;
    timeOut.selectedIndex = evt.target.selectedIndex;
  }


  function appendMessage(template, destination) {
    var newElement = template.cloneNode(true);
    destination.appendChild(newElement);
  }


  function onUpload() {
    appendMessage(successTemplate, successDestination);
    document.addEventListener('click', removeSuccessMessage);
  }

  function onErrorTemplate(errorMessageHandler, errorType, newErrorText) {
    return function() {
      appendMessage(errorTemplate, errorDestination);
      var errorText = document.getElementsByClassName('error__message')[0];
      errorText.classList.add(errorType);
      // change text of an error:
      if (newErrorText) {
        errorText.innerHTML = newErrorText;
      }
      document.addEventListener('click', errorMessageHandler);
    };
  }

  // remove an message and its listener:
  function removeMessageTemplate(messageType, removeMessageListener) {
    var message = document.getElementsByClassName(messageType)[0];
    message.remove();
    document.removeEventListener('click', removeMessageListener);
  }

  function removeDownloadErrorMessage() {
    removeMessageTemplate('error', removeDownloadErrorMessage);
    window.page.activatePage();
  }

  function removeUploadErrorMessage() {
    removeMessageTemplate('error', removeUploadErrorMessage);
    window.backend.save(adForm, onUpload, window.form.onUploadError);
  }

  function removeSuccessMessage() {
    removeMessageTemplate('success', removeSuccessMessage);
    window.page.deactivatePage();
  }
  /*
  // filter data:
  function filterByType() {
    if (typeFilter.value !== 'any') {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.type === typeFilter.value) {
          return notice;
        } else {
          return false;
        }
      });
    }
  }

  function filterByPrice() {
    if (priceFilter[1].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.price >= LOW_PRICE && notice.offer.price <= HIGH_PRICE) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (priceFilter[2].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.price < LOW_PRICE) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (priceFilter[3].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.price > HIGH_PRICE) {
          return notice;
        } else {
          return false;
        }
      });
    }
  }

  function filterByRooms() {
    if (roomsFilter[1].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.rooms === 1) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (roomsFilter[2].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.rooms === 2) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (roomsFilter[3].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.rooms === 3) {
          return notice;
        } else {
          return false;
        }
      });
    }
  }

  function filterByGuests() {
    if (guestsFilter[1].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.guests === 2) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (guestsFilter[2].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.guests === 1) {
          return notice;
        } else {
          return false;
        }
      });
    } else if (guestsFilter[3].selected === true) {
      filteredData = filteredData.filter(function (notice) {
        if (notice.offer.guests === 0) {
          return notice;
        } else {
          return false;
        }
      });
    }

  }

  function filterByFeature(filterName, featureName) {
    if (filterName.checked) {
      filteredData = filteredData.filter(function (notice) {
        for (var i = 0; i < notice.offer.features.length; i++) {
          if (notice.offer.features[i] === featureName) {
            return notice;
          }
        }
        return false;
      });
    }
  }

  function getFilteredData() {
    // run filters:
      for (var key in filters) {
        var filterName = eval("document.querySelector('#filter-" + key + "')");
        filters[key](filterName, key);
      }
    return filteredData;
  }
*/

  function filterByType(currentItem, type) {
    if (type === 'any') {
      return true;
    } else {
      if (currentItem.offer.type === typeFilter.value) {
        return currentItem;
      } else {
        return false;
      }
    }
  }

  function filterByPrice(currentItem, string) {
    var textValue;
    if (string === 'any') {
      return true;
    }
    if (currentItem.offer.price < LOW_PRICE) {
      textValue = 'low';
    }
    if (currentItem.offer.price > HIGH_PRICE) {
      textValue = 'high';
    }
    if (currentItem.offer.price >= LOW_PRICE && currentItem.offer.price <= HIGH_PRICE) {
      textValue = 'middle';
    }
    return textValue === string;
  }

  var filterByRooms = function(currentItem, rooms) {
    return rooms === 'any' || +rooms === currentItem.offer.rooms;
  };

  var filterByGuests = function(currentItem, guests) {
    return guests === 'any' || +guests === currentItem.offer.guests;
  };

  function filterByFeature(currentItem, isNecessary, feature) {

    if (isNecessary) {
      return currentItem.offer.features.indexOf(feature) !== -1;
    }
    return true;
  }


  function getFilteredData() {
    filteredData = filteredData.filter(function(currentItem) {
      var counter = 0;
      for (var key in currentFilter) {
        counter++;
        if (!filters[key](currentItem, currentFilter[key], key)) {
          return false;
        }
      }
      return true;
    });
    return filteredData;
  };
  // current state of filters:
  var currentFilter = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    wifi: false,
    dishwasher: false,
    parking: false,
    washer: false,
    elevator: false,
    conditioner: false,
  };

  var filters = {
    type: filterByType,
    price: filterByPrice,
    rooms: filterByRooms,
    guests: filterByGuests,
    wifi: filterByFeature,
    dishwasher: filterByFeature,
    parking: filterByFeature,
    washer: filterByFeature,
    elevator: filterByFeature,
    conditioner: filterByFeature,
  };

  mapFilters.addEventListener('change', function(evt) {
    var target = evt.target;
    switch (target.tagName) {
      case 'SELECT':
        var filter = target.id.split('-')[1];
        currentFilter[filter] = target.value;
        break;
      case 'INPUT':
        target.toggleAttribute('checked');
        if (target.hasAttribute('checked')) {
          currentFilter[target.value] = 'true';
        } else {
          currentFilter[target.value] = 'false';
        }
    }
    window.form.filterServerData();
  });

  // add user's images:
  function addImg(fileChooser, preview, previewContainer) {
    return function() {
      var file = fileChooser.files[0];
      if (file) {
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function(it) {
          return fileName.endsWith(it);
        });
        if (matches) {
          var reader = new FileReader();
          reader.addEventListener('load', function() {
            if (!preview) {
              var newImg = document.createElement('img');
              newImg.classList.add('new-img');
              newImg.setAttribute('src', reader.result);
              previewContainer.append(newImg);
            } else {
              preview.src = reader.result;
            }
          });
          reader.readAsDataURL(file);
        }
      }
    };
  }

  window.page.deactivatePage();
  // enable form:
  mainPin.addEventListener('mousedown', function(evt) {
    if (document.querySelector('.map--faded')) {
      window.page.activatePage();
    }
    // move Pin:
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      if ((mainPin.offsetLeft - shift.x) >= PIN_LEFT_MIN &&
        (mainPin.offsetLeft - shift.x) <= PIN_LEFT_MAX &&
        (mainPin.offsetTop - shift.y) >= PIN_TOP_MIN &&
        (mainPin.offsetTop - shift.y) <= PIN_TOP_MAX) {
        mainPin.style.top = mainPin.offsetTop - shift.y + 'px';
        mainPin.style.left = mainPin.offsetLeft - shift.x + 'px';
      }
      address.value = window.util.getFormattedAddress(mainPin.style.left, MAIN_PIN_WIDTH / 2, mainPin.style.top, MAIN_PIN_HEIGHT);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      address.value = window.util.getFormattedAddress(mainPin.style.left, MAIN_PIN_WIDTH / 2, mainPin.style.top, MAIN_PIN_HEIGHT);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  mainPin.addEventListener('keydown', function(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      window.page.activatePage();
    }
  });

  document.addEventListener('keydown', function(evt) {
    if (evt.keyCode === DELETE_KEYCODE) {
      window.page.deactivatePage();
    }
    if (evt.keyCode === ESC_KEYCODE) {
      var successMessage = document.getElementsByClassName('success')[0];
      var errorDownloadMessage = document.getElementsByClassName('download-error')[0];
      var errorUploadMessage = document.getElementsByClassName('upload-error')[0];

      window.util.closeCard();

      if (successMessage) {
        removeSuccessMessage();
      }
      if (errorDownloadMessage) {
        removeDownloadErrorMessage();
      }
      if (errorUploadMessage) {
        removeUploadErrorMessage();
      }
    }
  });

  titleInput.addEventListener('invalid', function() {
    if (titleInput.validity.tooShort) {
      titleInput.setCustomValidity('Заголовок должен состоять минимум из 30-ти символов');
    } else if (titleInput.validity.tooLong) {
      titleInput.setCustomValidity('Заголовок не должен превышать 100 символов');
    } else if (titleInput.validity.valueMissing) {
      titleInput.setCustomValidity('Обязательное поле');
    } else {
      titleInput.setCustomValidity('');
    }
  });

  priceInput.addEventListener('invalid', function() {
    if (priceInput.validity.rangeOverflow) {
      priceInput.setCustomValidity('Максимальная цена не должна превышать 1 000 000');
    } else if (priceInput.validity.valueMissing) {
      priceInput.setCustomValidity('Обязательное поле');
    } else if (priceInput.validity.rangeUnderflow) {
      priceInput.setCustomValidity('Минимальная цена составляет ' + priceInput.getAttribute('min'));
    } else {
      priceInput.setCustomValidity('');
    }
  });

  // user's avatar:
  var userAvatarHandler = addImg(userAvatarInput, userAvatarPreview);
  var photoHouseHandler = addImg(photoHouseInput, photoHousePreview,
    photoHousePreviewDiv);
  userAvatarInput.addEventListener('change', userAvatarHandler);
  photoHouseInput.addEventListener('change', photoHouseHandler);

})();
