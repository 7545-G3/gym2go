'use strict'

angular
  .module('exposureBusinessApp')
  .factory('locationsService', locationsService)

function locationsService() {

  var locationsService = {
    getCurrentPosition: getCurrentPosition,
    addressObjectToString: addressObjectToString,
    googleAddressToObject: googleAddressToObject,
    getURI: getMapsAppURI
  }

  return locationsService


  function getCurrentPosition(options) {

    if (!options) {
      options = {
        enableHighAccuracy: true,
        timeout: 5 * 1000,
        maximumAge: 1000 * 60 * 5
      }
    }

    return new Promise(function(resolve, reject){

      navigator.geolocation.getCurrentPosition(success, error, options)

      function success(position) {
        resolve(position)
      }

      function error(error) {
        reject(error)
      }
    })
  }

  function addressObjectToString(address) {
    var addressArray = _.without([address.street, address.city, address.state, address.country], undefined)
    return addressArray.join(", ")
  }

  function googleAddressToObject(googleAddress) {

    var parsedAddress = {}
    var fields = ['street_number', 'route', 'locality', 'administrative_area_level_1', 'postal_code']

    // Build new address components object with keys in 'fields' array
    angular.forEach(googleAddress.address_components, function(value, key) {
      var type = value.types[0]
      if (fields.indexOf(type) != -1) {
        parsedAddress[type] = value.long_name
      }
    })

    if (!parsedAddress.street_number || !parsedAddress.route) {
      return undefined
    }

    var address = {
      street: parsedAddress.street_number + ' ' + parsedAddress.route,
      city: parsedAddress.locality,
      state: parsedAddress.administrative_area_level_1,
      zipCode: parsedAddress.postal_code,
      lat: googleAddress.geometry.location.lat(),
      long: googleAddress.geometry.location.lng()
    }

    return address
  }

  function getMapsAppURI(lat, lng, query) {

    var URI = ""
    var platform

    if (window.device) {
      platform = window.device.platform
    }

    switch (platform) {
      case "Android":
        URI = "geo:" + lat + "," + lng + "?q=" + lat + "," + lng
        break
      case "iOS":
        URI = "http://maps.apple.com/?ll=" + lat + "," + lng + "&q=" + query
        break
      default:
        URI = "http://maps.google.com/?q=" + lat + "," + lng
    }

    return URI
  }
}