'use strict';

(function () {

  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var ANY = 'any';

  var typeFilter = document.querySelector('#housing-type');

  var PriceType = {
    HIGH_PRICE_STRING: 'high',
    MIDDLE_PRICE_STRING: 'middle',
    LOW_PRICE_STRING: 'low',
  };
  // filter data:
  window.filters = {
    onFiltersChange: function (evt) {
      var target = evt.target;
      switch (target.tagName) {
        case 'SELECT':
          var filter = target.id.split('-')[1];
          currentFilter[filter] = target.value;
          break;
        case 'INPUT':
          currentFilter[target.value] = !target.hasAttribute('checked');
          target.toggleAttribute('checked');
      }
    },
    getFilteredData: function () {
      window.form.filteredData = window.form.filteredData.filter(function (currentItem) {
        for (var key in currentFilter) {
          if (!filters[key](currentItem, currentFilter[key], key)) {
            return false;
          }
        }
        return true;
      });
      return window.form.filteredData;
    },
  };

  function filterByType(currentItem, type) {
    if (type === ANY) {
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
    if (string === ANY) {
      return true;
    }
    switch (true) {
      case currentItem.offer.price < LOW_PRICE:
        textValue = PriceType.LOW_PRICE_STRING;
        break;
      case currentItem.offer.price > HIGH_PRICE:
        textValue = PriceType.HIGH_PRICE_STRING;
        break;
      case currentItem.offer.price >= LOW_PRICE && currentItem.offer.price <= HIGH_PRICE:
        textValue = PriceType.MIDDLE_PRICE_STRING;
    }
    return textValue === string;
  }

  var filterByRooms = function (currentItem, rooms) {
    return rooms === ANY || +rooms === currentItem.offer.rooms;
  };

  var filterByGuests = function (currentItem, guests) {
    return guests === ANY || +guests === currentItem.offer.guests;
  };

  function filterByFeature(currentItem, isNecessary, feature) {

    if (isNecessary) {
      return currentItem.offer.features.indexOf(feature) !== -1;
    }
    return true;
  }

  // current state of filters:
  var currentFilter = {
    type: ANY,
    price: ANY,
    rooms: ANY,
    guests: ANY,
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

})();
