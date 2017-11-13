'use strict'

angular.module('exposureBusinessApp')
  .controller('ManageCtrl', ManageCtrl)

function ManageCtrl($scope, $state, npService, membershipService, localeService, _) {

  var vm = this
  vm.np = {}
  vm.busy = true
  vm.connectionError = false
  init()

  function init() {
    $scope.dashboard.changeCurrentTab('manage')
    if (!npService.getCurrentNonProfit()) {
      return $state.transitionTo('dashboard.manage')
    }
    vm.locale = localeService.getCurrentLocale()
    vm.np = npService.getCurrentNonProfit()
    vm.activeMembership = npService.getActiveMembership()
    membershipService.getAds(vm.activeMembership._id, true)
      .then(function (response) {
        vm.ads = response
        vm.activeMembership.ads = response
        vm.busy = false
      })
      .catch(function (err) {
        vm.connectionError = err.status == -1
        vm.busy = false
        console.log(err)
      })
  }

  vm.getStatus = function (isActive) {
    return isActive ? 'active' : 'inactive'
  }

  vm.goToEditAd = function (adData) {
    $state.transitionTo('dashboard.manage.create-ad', {action: 'edit'})
  }

  vm.goToStopAd = function () {
    npService.setCurrentNonProfit(vm.np)
    $state.transitionTo('dashboard.manage.stop-ad')
  }

  vm.goToAdDetail = function(ad) {
    membershipService.setMembership(vm.activeMembership)
    $state.transitionTo('dashboard.history.ad-details')
  }
}
