'use strict'

angular
  .module('exposureBusinessApp')
  .controller('LoginCtrl', LoginCtrl)

/** @ngInject */
function LoginCtrl($state, $rootScope, authService, localStorageService, errorHelper, ENV) {
  var vm = this

  // Data
  vm.email = localStorageService.get('lastUserLogged') // Autocomplete last login
  vm.password = ""
  vm.errorMessages = {}
  vm.fromResetPassword = false

  // Methods
  vm.login = login

  init()

  function init() {
    if ($rootScope.previousState === "auth.resetPassword" && $rootScope.passwordChanged) {
      vm.fromResetPassword = true
      $rootScope.passwordChanged = false
    }
  }

  /**
   * Login user in app
   * @return {[type]} [description]
   */
  function login() {
    authService.login()
      .then(
        function (response) {
          authService.setAuthUser(response)
          $state.go('dashboard.find-np.list')
        },
        function (response) {
          vm.errorMessages = errorHelper.getLoginErrors(response.data)
        })
  }

  vm.clearError = function (fieldName) {
    vm.errorMessages[fieldName] = null
  }
}

