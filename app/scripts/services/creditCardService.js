'use strict'

angular
  .module('exposureBusinessApp')
  .factory('creditCardService', creditCardService);

function creditCardService() {

  var that = this
  that.currentCreditCard = null

  return {
    setCurrentCreditCard: setCurrentCreditCard,
    getCurrentCreditCard: getCurrentCreditCard,
    getCreditCard: getCreditCard,
    setCardToken: setCardToken
  }

  function setCurrentCreditCard(creditCard) {
    that.currentCreditCard = creditCard
  }

  function getCurrentCreditCard() {
    return that.currentCreditCard
  }

  function getCreditCard() {
    return  {}
  }

  function setCardToken(token) {
    return {
      'card_token': token
    }
  }
}
