'use strict'

angular
  .module('exposureBusinessApp')
  .factory('errorHelper', errorHelper)

function errorHelper(_, localeService) {

  var mapFieldName = {
    "branch_name": localeService.getStaticLocale('errors.invalidBranchName'),
    "address.zipCode": localeService.getStaticLocale('errors.invalidAddressZipCode'),
    "address": localeService.getStaticLocale('errors.invalidAddress'),
    "phone_number": localeService.getStaticLocale('errors.invalidPhoneNumber'),
    "contact_name": localeService.getStaticLocale('errors.invalidContactName'),
    "title": localeService.getStaticLocale('errors.invalidTitle'),
    "email": localeService.getStaticLocale('errors.invalidEmail'),
    "password": localeService.getStaticLocale('errors.invalidPassword'),
    "name": localeService.getStaticLocale('errors.invalidFirstName'),
    "last_name": localeService.getStaticLocale('errors.invalidLastName'),
    "business_name": localeService.getStaticLocale('errors.invalidBusinessName'),
    "card_token": localeService.getStaticLocale('errors.cardTokenError')
  }

  var mapAdCreationFieldName = {
    "name": localeService.getStaticLocale('errors.invalidAdName'),
    "category": localeService.getStaticLocale('errors.invalidAdCategory'),
    "content": localeService.getStaticLocale('errors.invalidAdContent'),
    "disclaimer": localeService.getStaticLocale('errors.invalidAdDisclaimer'),
    "placement": localeService.getStaticLocale('errors.placement'),
    "msg": localeService.getStaticLocale('errors.invalidRotation') 
  }

  var genericHandler = {
    'INVALID_PARAMS': invalidParamsHandler
  }

  var purchaseErrorHandler = {
    'CREDIT_CARD_NOT_SET': infoNotSetHandler
  }

  var adCreationErrorHandler = {
    'INVALID_PARAMS': invalidParamsHandler,
    'OVERLAPPED_RANGES': overlappedRangesHandler
  }

  var changePasswordHandler = {
    'INVALID_CREDENTIALS': invalidCredentialsHandler
  }

  var stopAdHandler = {
    'NO_NEXT_AD': noAdsInRotationHandler
  }

  return {
    getGenericParamsErrors: getGenericParamsErrors,
    getPurchaseErrors: getPurchaseErrors,
    getAdCreationErrors: getAdCreationErrors,
    getStopAdErrors: getStopAdErrors,
    getLoginErrors: getLoginErrors,
    getChangePasswordError: getChangePasswordError
  }

  function noAdsInRotationHandler() {
    var errorMessages = {}
    errorMessages['stop_ad_error'] = localeService.getStaticLocale('errors.thereIsNoAdInRotationError')
    return errorMessages
  }

  function getGenericParamsErrors(data) {
    return genericHandler[data.code](data.errors, mapFieldName)
  }

  function invalidParamsHandler(errors, mapper) {
    var errorMessages = {}
    _.each(errors, function (err) {
      var errorName = _.keys(err)[0]
      if (errorName.indexOf('address') != -1) {
        errorMessages['address'] = mapper['address']
      } else {
        errorMessages[errorName] = mapper[errorName]
      }
    })
    return errorMessages
  }

  function getPurchaseErrors(data) {
    return purchaseErrorHandler[data.code](data.errors)
  }

  function getAdCreationErrors(data) {
    return adCreationErrorHandler[data.code](data.errors, mapAdCreationFieldName)
  }

  function infoNotSetHandler(errors) {
    var errorMessages = {}
    errorMessages['credit_card_not_set'] = localeService.getStaticLocale('errors.creditCardNotSet')
    return errorMessages
  }

  function overlappedRangesHandler(errors) {
    var errorMessages = {}
    errorMessages['rotation'] = localeService.getStaticLocale("errors.adsOverlapped")
    return errorMessages
  }
  
  function invalidCredentialsHandler() {
    var errorMessages = {}
    errorMessages['change_password_error'] = localeService.getStaticLocale('errors.invalidPassword')
    return errorMessages
  }

  function getLoginErrors(errors) {
    var errorMessages = {}
    errorMessages['login_error'] = localeService.getStaticLocale('errors.loginError')
    return errorMessages
  }

  function getChangePasswordError(data) {
    return changePasswordHandler[data.code]()
  }

  function getStopAdErrors(data) {
    return stopAdHandler[data.code]()
  }
}