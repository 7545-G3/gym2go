'use strict'

angular
  .module('exposureBusinessApp')
  .controller('dashboardCtrl', dashboardCtrl)

function dashboardCtrl($state, _, localStorageService, $uibModal, localeService) {

  var vm = this

  vm.state = $state
  vm.locale = {}

  if (window.device) {

    vm.platform = window.device.platform

    // Angular Datepicker toogle (iOS workaround)
    if (vm.platform == 'iOS') {
      $("#dashboard").click(function() {
        $("._720kb-datepicker-calendar").blur()
      })
      $("#dashboard").on("click", "datepicker", function(event) {
        event.stopPropagation()
      })
    }
  }

  vm.tabs = [{
    id: 'find-np',
    sref: 'dashboard.find-np',
    title: "dashboard.findNp.headerTitle",
    buttonTitle: "dashboard.findNp.buttonTitle"
  }, {
    id: 'purchase',
    sref: "dashboard.purchase",
    title: "dashboard.purchase.headerTitle",
    buttonTitle: "dashboard.purchase.buttonTitle"
  }, {
    id: 'manage',
    sref: 'dashboard.manage',
    title: "dashboard.manage.headerTitle",
    buttonTitle: "dashboard.manage.buttonTitle"
  }, {
    id: 'history',
    sref: 'dashboard.history',
    title: "dashboard.history.headerTitle",
    buttonTitle: "dashboard.history.buttonTitle"
  }, {
    id: 'billing',
    sref: 'dashboard.billing',
    title: "dashboard.billing.headerTitle",
    buttonTitle: "dashboard.billing.buttonTitle"
  }];

  // Select tab according to state
  for (var i = 0; i < vm.tabs.length; i++) {
    if ($state.includes(vm.tabs[i].sref)) {
      vm.currentTab = vm.tabs[i]
    }
  }

  // If no tab was found for state, default is find-np
  if (!vm.currentTab) {
    vm.currentTab = vm.tabs[0]
  }

  vm.changeCurrentTab = function (id) {
    vm.currentTab = _.findWhere(vm.tabs, {
      id: id
    })
  }

  vm.isActiveTab = function (tab) {
    return vm.currentTab.id == tab.id
  }
}