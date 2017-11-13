'use strict'

angular.module('exposureBusinessApp')
  .controller('purchaseSummaryCtrl', purchaseSummary)

function purchaseSummary($state, npService, membershipService, creditCardService, billingService) {

  var vm = this
  vm.np = {}
  vm.billingInfo = {}
  init()

  function init() {
    vm.np = npService.getCurrentNonProfit()
    if (!membershipService.getCurrentMembership().plan) {
      vm.purchasePrice = vm.currentPlan.monthly_price * (1 - vm.currentPlan.discount) * vm.currentPlan.number_of_months
      vm.transactionDate = Date.now()
    } else {
      vm.membership = membershipService.getCurrentMembership()
      vm.np.status = getMembershipStatus()
      vm.currentPlan = membershipService.getCurrentMembership().plan
      vm.purchasePrice = vm.currentPlan.monthly_price * (1 - vm.currentPlan.discount) * vm.currentPlan.number_of_months
      vm.transactionDate = new Date(membershipService.getCurrentMembership().created_at)
      var auxDate = new Date()
      vm.renewalDate = auxDate.setMonth(auxDate.getMonth() + vm.currentPlan.number_of_months)
    }
    vm.donationAmount = vm.purchasePrice * vm.currentPlan.donation
    if (creditCardService.getCurrentCreditCard()) {
      vm.creditCard = creditCardService.getCurrentCreditCard()
    } else {
      creditCardService.getCreditCard()
        .then(function (response) {
          vm.creditCard = response
          vm.creditCard.expiration_date = ('0' + response.exp_month.toString()).slice(-2) + '/' + response.exp_year.toString().substr(2,2)
          vm.creditCard.masked_number = '**** **** **** ' + response.last_4
        })
    }
    vm.billingInfo = billingService.getCurrentBillingInfo()
  }

  vm.isInBilling = function () {
    return $state.current.name.indexOf('billing') !== -1
  }

  function getMembershipStatus () {
    return vm.membership.is_active ? 'active' : 'inactive'
  }
}
