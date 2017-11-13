'use strict'

angular
  .module('exposureBusinessApp')
  .directive('fileSelect', fileSelect)

function fileSelect() {
  return {
    scope: {
      fileSelect: '&'
    },
    link: function($scope, element) {
      element.bind("change", function(e) {
        $scope.fileSelect({
          file: (e.srcElement || e.target).files[0]
        })
      })
    }
  }
}