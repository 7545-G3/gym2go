'use strict'

angular
  .module('exposureBusinessApp')
  .controller('UpdateModalCtrl', updateModalCtrl)

function updateModalCtrl($uibModalInstance, $location, data) {

  var vm = this

  vm.data = data

  vm.close = function () {
    if (vm.data.requiredUpdate) {
      return $uibModalInstance.close()
    }
    if (vm.data.recommendedUpdate) {
      $location.path('initial')
      $uibModalInstance.close()
    }
  }

  vm.goToStore = function () {
    if (!window.cordova) {
      vm.close()
      return $location.path('initial')
    }
    if (window.device.platform == "iOS") {
        cordova.plugins.market.open("1084825229")
    } else {
      cordova.getAppVersion.getPackageName(function (packageName) {
        cordova.plugins.market.open(packageName)
      })
    }

  }
}