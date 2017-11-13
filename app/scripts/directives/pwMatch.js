'use strict'

angular
  .module('exposureBusinessApp')
  .directive('pwMatch', pwMatch);

function pwMatch() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      var firstPassword = '#' + attrs.pwMatch;
      elem.add(firstPassword).on('keyup', function() {
        scope.$apply(function() {
          var v = elem.val() === $(firstPassword).val();
          ctrl.$setValidity('pwmatch', v);
        });
      });
    }
  }
}