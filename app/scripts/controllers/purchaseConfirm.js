'use strict'

angular.module('exposureBusinessApp')
  .controller('PurchaseConfirmCtrl', PurchaseConfirmCtrl)

function PurchaseConfirmCtrl($state, membershipService, errorHelper, npService, _) {

  var vm = this
  vm.np = {}
  vm.errorMessages = {}
  init()

  function init() {
    vm.np = npService.getCurrentNonProfit()
    vm.purchasePrice = vm.currentPlan.monthly_price * (1 - vm.currentPlan.discount) * vm.currentPlan.number_of_months
    vm.donationAmount = vm.purchasePrice * vm.currentPlan.donation
    var auxDate= new Date()
    vm.renewalDate = auxDate.setMonth(auxDate.getMonth() + vm.currentPlan.number_of_months)
    vm.autoRenew = vm.currentPlan.isAutoRenew ? 'Yes' : 'No'
  }

  vm.cancelPurchase = function () {
    $state.transitionTo('dashboard.find-np.list')
  }

  vm.doPurchase = function () {
    vm.messages = []
    membershipService.createMembership(vm.np.id, vm.currentPlan._id, vm.currentPlan.isAutoRenew)
      .then(function(response) {
        console.log(response)
        vm.np.memberships.push(response)
        vm.np.status = "active"
        npService.setCurrentNonProfit(vm.np)
        $state.transitionTo('dashboard.purchase.summary')
      })
      .catch(function(err) {
        console.log(err)
        vm.errorMessages = errorHelper.getPurchaseErrors(err.data)
      })
  }
}
