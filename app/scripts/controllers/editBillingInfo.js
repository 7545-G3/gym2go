'use strict'

angular
  .module('exposureBusinessApp')
  .controller('editBillingInfoCtrl', editBillingInfoCtrl);

function editBillingInfoCtrl($scope, $state, dateService, stripe, APP, creditCardService, usSpinnerService, _, errorHelper) {

  var vm = this;

  // Card data
  vm.number;
  vm.cvv;
  vm.$ccType;
  vm.expirationMonth = "";
  vm.expirationYear = "";

  // Methods
  vm.saveCreditCard = saveCreditCard;

  // Other
  vm.errorMessages = {};
  vm.months = dateService.getMonths();
  vm.years = dateService.getYears(undefined, 10);

  function saveCreditCard() {
    vm.messages = []; // Reset errors
    var card = {
      number: vm.number,
      expirationMonth: vm.expirationMonth.number,
      expirationYear: vm.expirationYear.toString().substr(-2),
      cvc: vm.cvv,
      ccType: $scope.editBillingForm.number.$ccEagerType
    }
    console.log(card)
    saveInBraintree(card)
  }

  function saveInBraintree(card) {
    var parseExpiration = card.expirationMonth + '/' + card.expirationYear
    var masked_number = '**** **** **** ' + card.number.substr(-4)
    usSpinnerService.spin('spinner-1')
    stripe.setPublishableKey(APP.STRIPE_PUBLIC_KEY)
    return stripe.card.createToken({
        number: card.number,
        exp_month: card.expirationMonth,
        exp_year: card.expirationYear,
        cvc: card.cvc
      })
      .then(function (res) {
        return creditCardService.setCardToken(res.id)
      })
      .then(function(res) {
        usSpinnerService.stop('spinner-1')
        creditCardService.setCurrentCreditCard({
          expiration_date: parseExpiration,
          masked_number: masked_number,
          brand: card.ccType,
          cvc: card.cvc,
          id: res.id
        })
        $state.transitionTo('dashboard.purchase.new')
      })
      .catch(function(err) {
        usSpinnerService.stop('spinner-1')
        console.log('Error charging card', err)
        if (err.data) {
          vm.errorMessages = errorHelper.getGenericParamsErrors(err.data)
        } else {
          vm.messages.push(err.message)
        }
      })
  }
}