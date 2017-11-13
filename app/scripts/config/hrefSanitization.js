'use strict'

angular.module('exposureBusinessApp')
  .config(['$compileProvider', function($compileProvider) {
    $compileProvider
      .aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|geo):/)
      .imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//)
  }])