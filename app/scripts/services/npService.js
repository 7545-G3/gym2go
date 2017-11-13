'use strict'

angular
  .module('exposureBusinessApp')
  .factory('npService', npService)


/** @ngInject */
function npService(_, $q) {
  var that = this
  that.currentNonProfit = null
  that.newAd = null
  return {
    setCurrentNonProfit: setCurrentNonProfit,
    getCurrentNonProfit: getCurrentNonProfit,
    getNPList: getNPList,
    computeDistance: computeDistance,
    getActiveMembership: getActiveMembership
  }

  function getNPList() {
    var def = $q.defer()

    def.resolve([])

    return def.promise
  }

  function computeDistance(lat1, lng1, lat2, lng2, convertToMiles) {
    var loc1 = new google.maps.LatLng(lat1, lng1)
    var loc2 = new google.maps.LatLng(lat2, lng2)
    var distance = google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2) / 1000
    if (convertToMiles) {
      distance = distance * 0.621371192
    }
    if (distance == 0) {
      distance = parseInt(distance);
    }
    return distance.toFixed(2)
  }

  function setCurrentNonProfit(np) {
    that.currentNonProfit = np
  }

  function getCurrentNonProfit() {
    return that.currentNonProfit
  }

  function getActiveMembership() {
    return _.find(that.currentNonProfit.memberships, function (membership) {
      return membership.is_active || membership.is_active == undefined
    })
  }
}
