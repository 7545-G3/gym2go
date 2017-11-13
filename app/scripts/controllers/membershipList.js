'use strict'

angular
  .module('exposureBusinessApp')
  .controller('MembershipListCtrl', MembershipListCtrl);

function MembershipListCtrl($rootScope, $state, npService, membershipService, billingService, _) {

  var vm = this

  vm.memberships = []
  vm.np = {}
  vm.billingInfo = []

  if ($state.current.data) {
    vm.displayedStatuses = $state.current.data.statuses;
    vm.itemClickAction = $state.current.data.itemClickAction;
  }

  init();

  function init() {
    vm.np = npService.getCurrentNonProfit()
    vm.memberships = getOrderedMemberships()
    if ($rootScope.previousState.indexOf('billing') !== -1) {
      billingService.getBillingInfo()
        .then(function (res) {
          vm.billingInfo = res
        })
    }
  }

  function getOrderedMemberships() {
    var memberships = npService.getCurrentNonProfit().memberships
    _.each(memberships, function (membership) {
      membership.expiration_date = new Date(membership.expiration_date)
    })
    return _.sortBy(memberships, 'expiration_date').reverse()
  }

  vm.getStatus = function (isActive) {
    return isActive ? 'active' : 'inactive'
  }

  vm.clickAction = function (membership) {
    membershipService.setMembership(membership)
    if ($rootScope.previousState.indexOf('history') !== -1 ||
      $rootScope.previousState.indexOf('purchase') !== -1 ||
      $rootScope.previousState.indexOf('find-np') !== -1) {
      $state.transitionTo('dashboard.history.ads')
    } else {
      var billing = _.find(vm.billingInfo, function (aBilling) {
        return aBilling.metadata.membershipId === membership._id
      })
      billingService.setCurrentBillingInfo(billing)
      $state.transitionTo('dashboard.billing.summary')
    }
  }
}