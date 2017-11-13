'use strict'

angular
  .module('exposureBusinessApp')
  .factory('authService', authService)


/** @ngInject */
function authService(localStorageService, $q) {
  return {
    login: login,
    setAuthUser: setAuthUser,
    updateAuthUser: updateAuthUser,
    isAuthUser: isAuthUser,
    recoverPassword: recoverPassword,
    resetPassword: resetPassword,
    changePassword: changePassword,
    logout: logout
  }

  function login() {
    var def = $q.defer();
    def.resolve({first_name: 'First', last_name: 'Last'});
    return def.promise
  }

  function recoverPassword(email) {
    return apiResolver.resolve('auth.recoverPassword@post', {'email': email})
  }

  function resetPassword(validationCode, password) {
    return apiResolver.resolve('auth.resetPassword@post', {'code': validationCode, 'password': password})
  }

  function changePassword(oldPassword, newPassword) {
    return apiResolver.resolve('auth.changePassword@put', {'old_password': oldPassword, 'new_password': newPassword})
  }

  function setAuthUser(response) {

      var user = {
        first_name: response.first_name,
        last_name: response.last_name
      }

    localStorageService.set('authUser', user)
    localStorageService.set('lastUserLogged', response.email)
  }

  function isAuthUser() {
    return (localStorageService.get('authUser') != null)
  }

  function updateAuthUser(updatedUser) {

    var currentUser = localStorageService.get('authUser')

    // We are not replacing the object, just updating the keys we receive in updatedUser
    _.each(currentUser, function(value, key) {
      currentUser[key] = updatedUser[key] || value
    })

    localStorageService.set('authUser', currentUser)
  }

  function logout() {
    localStorageService.set('authUser', null)
    localStorageService.set('tutorialShown', null)
  }
}
