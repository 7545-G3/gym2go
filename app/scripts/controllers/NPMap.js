'use strict'

angular
  .module('exposureBusinessApp')
  .controller('NPMapCtrl', NPMapCtrl)

function NPMapCtrl(NgMap, npService, localStorageService, $timeout, locationsService, $state) {

  var vm = this

  vm.markers = []

  // Load map
  NgMap.getMap().then(function(map) {
    vm.map = map
    vm.map.setCenter({
      lat: vm.defaultLat,
      lng: vm.defaultLng
    })
    google.maps.event.trigger(vm.map, 'resize')
    getMarkers()
  })

  vm.icons = {
    active: 'images/marker_green_small.png',
    inactive: 'images/marker_black_small.png',
    opportunity: 'images/marker_grey_small.png'
  }

  // Methods
  vm.getMarkers = getMarkers
  vm.showMarkerDetail = showMarkerDetail
  vm.onBoundsChanged = onBoundsChanged

  init()

  function init() {
  }

  function getMarkers() {

    var bounds = vm.map.getBounds()
    var center = bounds.getCenter()
    var corner = bounds.getNorthEast()

    var offset = 0
    var limit = 50
    var range = parseInt(npService.computeDistance(center.lat(), center.lng(), corner.lat(), corner.lng()))

    npService.getNPList(null, center.lat(), center.lng(), offset, limit, range)
      .then(function(response) {
        vm.markers = []
        angular.forEach(response, function(item, key) {
          item.status = item.status.key.toLowerCase()
          item.distance = npService.computeDistance(vm.defaultLat, vm.defaultLng, item.shipping_latitude, item.shipping_longitude, true)
          item.icon = vm.icons[item.status]
          item.position = [item.shipping_latitude, item.shipping_longitude]
          item.mapHref = locationsService.getURI(item.shipping_latitude, item.shipping_longitude, item.name)
          vm.markers.push(item)
        })
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  function showMarkerDetail(event, marker) {
    vm.infoWindow = marker
    vm.map.showInfoWindow('npInfo', marker.id)

    // Workaround: if the map moves when we open the infoWindow, then we want to cancel the request because it will close the infoWindow on return
    $timeout(function() {
      $timeout.cancel(vm.requestDelay)
    }, 1000)
  }

  function onBoundsChanged() {

    if (!vm.map) {
      return
    }

    // Workaround to allow swift drag
    $timeout.cancel(vm.requestDelay)
    vm.requestDelay = $timeout(function() {
      getMarkers()
    }, 1200)
  }

  vm.goToPurchase = function goToPurchase(opts, action) {
    npService.setCurrentNonProfit(opts)
    $state.transitionTo('dashboard.purchase.new', {
      action: action
    })
  }

  vm.goToManageMembership = function goToManageMembership(opts) {
    npService.setCurrentNonProfit(opts)
    $state.transitionTo('dashboard.manage.membership')
  }

  vm.goToHistory = function(opts) {
    npService.setCurrentNonProfit(opts)
    $state.transitionTo('dashboard.history.memberships')
  }
}
