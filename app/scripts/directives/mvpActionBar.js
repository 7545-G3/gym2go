'use strict'

angular
  .module('exposureBusinessApp')
  .directive('mvpActionBar', mvpActionBar);

function mvpActionBar() {
  return {
    restrict: 'E',
    templateUrl: 'views/mvp-action-bar.html',
    controller: 'ActionBarCtrl',
    scope: {
      title: "@",
      backButtonEnabled: "@",
      backState: "@",
      platform: "@",
      $state: '@'
    }
  };
}