'use strict'

angular
  .module('exposureBusinessApp')
  .controller('SettingsCtrl', SettingsCtrl)

function SettingsCtrl($state, authService) {
  var vm = this
  vm.state = $state
  if (window.device) {
    vm.platform = window.device.platform
  }

  vm.logout = function () {
    authService.logout()
    $state.go('auth.welcome')
  }
}
