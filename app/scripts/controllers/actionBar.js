'use strict'

angular.module('exposureBusinessApp')
  .controller('ActionBarCtrl', ActionBarCtrl)

function ActionBarCtrl($scope, $rootScope, $state) {
  var vm = this
  vm.backState = {}
  init()

  function init() {
    if (!$scope.backState) {
      $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
          vm.backState = toState.data.backButtonEnabled ? toState.data.backState : 'dashboard'
        })
    } else {
      vm.backState = $scope.backState
    }
  }

  $scope.goBack = function () {
    $state.transitionTo(vm.backState)
  }

  $scope.showButton = function () {
    return $state.current.name.indexOf('dashboard') === -1
  }
}