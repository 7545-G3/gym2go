'use strict'

angular
  .module('exposureBusinessApp')
  .factory('$util', utilService)

function utilService(_) {

  return {
    propertyNested: propertyNested
  }

 function propertyNested (object, property) {
    var nested = property.split('.'),
      i = 0
    while (i < nested.length) object = object[nested[i++]]
    return object
  }
}