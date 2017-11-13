'use strict'

angular.module('exposureBusinessApp')
  .controller('PurchaseCtrl', PurchaseCtrl)

function PurchaseCtrl($scope, $state, _, $q, creditCardService, npService, $stateParams) {

  var vm = this
  vm.np = {}
  vm.busy = true
  vm.messages = []
  vm.currentPlan = null
  vm.isAutoRenew = true
  vm.creditCardData = {}
  vm.creditCardData.expiration_date = 'No credit card registered'
  vm.creditCardData.masked_number = 'No credit card registered'
  vm.plans= []
  init()

  function init() {
    $scope.dashboard.changeCurrentTab('purchase')
    if (npService.getCurrentNonProfit()) {
      vm.np = npService.getCurrentNonProfit()
    }
    if (creditCardService.getCurrentCreditCard()) {
      vm.creditCardData = creditCardService.getCurrentCreditCard()
    }
    loadData()
  }

  function loadData() {
    vm.messages = []
    $q.all([creditCardService.getCreditCard()])
      .then(function (response) {
        vm.busy = false
        if (response[0].last_4 && !vm.creditCardData.id) {
          vm.creditCardData = response[0]
          vm.creditCardData.expiration_date = ('0' + vm.creditCardData.exp_month.toString()).slice(-2) + '/' + vm.creditCardData.exp_year.toString().substr(2, 2)
          vm.creditCardData.masked_number = '**** **** **** ' + vm.creditCardData.last_4
        }
        vm.update()
      })
      .catch(function (err) {
        vm.busy = false
        console.log('Error loading data', err)
        _.forEach(err.data.errors[0], function (value, key) {
          vm.messages.push(value)
        })
      })
  }

  vm.update = function () {
    vm.purchasePrice = vm.currentPlan.monthly_price * (1 - vm.currentPlan.discount ) * vm.currentPlan.number_of_months
    vm.donationAmount = vm.purchasePrice * vm.currentPlan.donation
  }

  vm.saveData = function () {
    vm.currentPlan.isAutoRenew = vm.isAutoRenew
    creditCardService.setCurrentCreditCard(vm.creditCardData)
    npService.setCurrentNonProfit(vm.np)
  }

  vm.goToEdit = function () {
    vm.saveData()
    $state.transitionTo('dashboard.purchase.edit-billing-info')
  }
}
