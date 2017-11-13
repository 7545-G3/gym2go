'use strict'

angular
  .module('exposureBusinessApp')
  .factory('billingService', billingService)

function billingService(apiResolver) {

  var vm = this
  vm.setCurrentBillingInfo = {}

  return {
    getBillingInfo: getBillingInfo,
    setCurrentBillingInfo: setCurrentBillingInfo,
    getCurrentBillingInfo: getCurrentBillingInfo
  }

  function getBillingInfo() {
    return apiResolver.resolve('billingInfo@get', {})
  }

  function setCurrentBillingInfo(aBillingInfo) {
    vm.setCurrentBillingInfo = aBillingInfo
  }

  function getCurrentBillingInfo() {
    return vm.setCurrentBillingInfo
  }
}
