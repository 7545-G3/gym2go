'use strict'

angular
  .module('exposureBusinessApp')
  .factory('localeService', localeService);

function localeService($window, $http, $q, $util) {

  var that = this
  var lan = $window.navigator.language.split('-')[0]
  that.currentLocale = null

  return {
    setCurrentLocale: setCurrentLocale,
    getCurrentLocale: getCurrentLocale,
    getStaticLocale: getStaticLocale
  }

  function setCurrentLocale() {
    switch (lan) {
      case 'en':
        return setLocales('en')
        break
      case 'es':
        return setLocales('es')
        break
      default:
        return setLocales('en')
    }
  }

  function setLocales(lan) {
    var def = $q.defer()
    $http.get('locales/' + lan + '.json')
      .then(function(response) {
        that.currentLocale = response.data
        def.resolve(that.currentLocale)
      })
      .catch(function(response) {
        def.reject(response)
      })
    return def.promise
  }

  function getCurrentLocale() {
    return that.currentLocale
  }
  
  function getStaticLocale(code) {
    return $util.propertyNested(that.currentLocale, code)
  }
}
