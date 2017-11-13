'use strict'

angular
  .module('exposureBusinessApp')
  .controller('ModalCtrl', modalCtrl)

function modalCtrl($uibModalInstance, data) {

  var vm = this

  vm.data = data
  vm.close = function () {
    $uibModalInstance.close()
  }
}