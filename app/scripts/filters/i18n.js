'use strict'

angular.module('exposureBusinessApp')
  .filter('i18n', function (localeService, $util) {
    return function (input) {
      if (input && localeService.getCurrentLocale()) {
        return $util.propertyNested(localeService.getCurrentLocale(), input)
      }
    }
  })
