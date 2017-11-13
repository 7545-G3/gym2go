'use strict'

angular
  .module('exposureBusinessApp')
  .controller('NPListCtrl', NPListCtrl)

function NPListCtrl($state, npService, usSpinnerService, _, $timeout, locationsService, localeService) {

  var vm = this

  vm.items = [] // Array for list

  // Variables for infinite scroll load more
  vm.busy = true // If it is waiting for api response
  vm.offset = 0 // List offset
  vm.noMoreItems = false // No more items in list
  vm.filter // Search query

  vm.connectionError = false

  // Methods
  vm.getNPList = getNPList
  vm.loadMore = loadMore
  vm.onFilterChanged = onFilterChanged

  vm.showMapButton = $state.current.name.indexOf('find-np') != -1
  vm.showNamePlan = $state.current.name.indexOf('manage') != -1
  vm.showHistoryTitle = $state.current.name.indexOf('history') != -1

  if ($state.current.data) {
    vm.displayedStatuses = $state.current.data.statuses
    vm.itemClickAction = $state.current.data.itemClickAction
  }

  init()

  function init() {

    // This is just for convenience in development
    if (!localeService.getCurrentLocale()) {
      $state.transitionTo('loader')
    }

    // Define click action
    if (vm.itemClickAction) {
      vm.itemClick = function() {
        $state.go(vm.itemClickAction)
      }
    }

  }

  function getNPList() {
    vm.busy = true
    npService.getNPList()
      .then(function(response) {
        angular.forEach(response, function(item, key) {
          item.distance = npService.computeDistance(vm.lat, vm.lng, item.shipping_latitude, item.shipping_longitude, true)
          item.status = item.status.key.toLowerCase()
          item.mapHref = locationsService.getURI(item.shipping_latitude, item.shipping_longitude, item.name)
          vm.items.push(item)
        })

        sortNpMemberships()
        vm.offset += response.length
        vm.busy = false

        // Check if there aren't more items
        if (response.length == 0) {
          vm.noMoreItems = true
        }
      })
      .catch(function(response) {
        vm.connectionError = response.status == -1
        console.log(response)
        vm.busy = false
      })
  }

  /**
   * Load more non profits on scrolling
   * @return {[type]} [description]
   */
  function loadMore() {
    if (vm.lat && vm.lng && !vm.busy && !vm.noMoreItems) {
      console.log("Load more items...")
      getNPList()
    }
  }

  function sortNpMemberships() {
    _.map(vm.items, function(np) {
      np.memberships = _.sortBy(np.memberships, 'expirationDate')
      return np
    })
  }

  function onFilterChanged(skipDelay) {

    $timeout.cancel(vm.requestDelay)

    var delay = 1000
    if (skipDelay) {
      delay = 0
    }

    // Reset list when filter changes
    vm.requestDelay = $timeout(function() {
      vm.busy = true
      vm.items = []
      vm.offset = 0
      vm.noMoreItems = false
      getNPList()
    }, delay)
  }

  vm.clearFilter = function clearFilter() {
    vm.filter = ""
    onFilterChanged(true)
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
