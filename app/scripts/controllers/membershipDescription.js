'use strict'

angular.module('exposureBusinessApp')
  .controller('MembershipDescriptionCtrl', MembershipDescriptionCtrl)

function MembershipDescriptionCtrl($state, $scope, membershipService) {
  var vm = this
  vm.showButton = false
  init()

  function init() {
    vm.showButton = $state.current.name.indexOf('stop-ad') == -1 &&
      $state.current.name.indexOf('history') == -1
    vm.showSwitch = $state.current.name.indexOf('manage') != -1 &&
      $state.current.name.indexOf('stop-ad') == -1
    vm.isAutoRenew = $scope.isAutoRenew == "true"
  }

  vm.updateAutoRenew = function () {
    membershipService.updateAutorenewFlag($scope.membershipId, vm.isAutoRenew)
      .catch(function (err) {
        vm.isAutoRenew = !vm.isAutoRenew
        console.log(err)
      })
  }
}