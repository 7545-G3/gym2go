'use strict'

angular
  .module('exposureBusinessApp')
  .directive('apiMessages', apiMessages);

function apiMessages($timeout) {
  return {
    restrict: 'E',
    templateUrl: 'views/api-messages.html',
    scope: {
      errors: "="
    },
    link: function(scope, element, attrs) {

      function hideMessages() {
        $timeout(function() {
          element.hide();
          scope.errors = [];
        }, 5000);
      }

      scope.$watch(function() {
        if (scope.errors.length > 0) {
          element.show();
          hideMessages();
        }
      });
    }
  }
}
