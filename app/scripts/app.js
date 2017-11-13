'use strict'

var PhoneGapInit = {
  bootAngular: function () {
    angular.bootstrap(document, ['exposureBusinessApp'])
  },
  bindEvents: function () {
    document.addEventListener("deviceready", this.onDeviceReady, true)
  },
  onDeviceReady: function () {

    console.log("Device ready callback")

    if (navigator.splashscreen && window.device) {

      var delay = 0
      var platform = window.device.platform

      // Delay on Android to avoid blank screen after splash
      if (platform == "Android") {
        delay = 3000
      }

      setTimeout(function () {
        navigator.splashscreen.hide()
      }, delay)
    }

    PhoneGapInit.bootAngular()
  }
}

angular.element(document).ready(function () {

  if (window.cordova !== undefined) {
    console.log("Cordova found 😀")
    PhoneGapInit.bindEvents()
  } else {
    console.log("Cordova not found 🙁")
    PhoneGapInit.bootAngular()
  }

})


/**
 * Main module of the application.
 */
angular
  .module('exposureBusinessApp', [
    'LocalStorageModule',
    'ngMap',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMessages',
    'ui.router',
    'google.places',
    'ui.utils.masks',
    'underscore',
    'angularSpinner',
    'ui.router-decorator',
    'ui.bootstrap',
    'ngAnimate',
    'uiSwitch',
    'credit-cards',
    '720kb.datepicker',
    'ngFileUpload',
    'angular-carousel'
  ])
  .config(moduleConfig)
  .run(stateChangeConfig)
  .run(setAndroidBackButton);

function moduleConfig($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

  // Configure local storage
  localStorageServiceProvider.setPrefix('mvplocal')

  $urlRouterProvider.otherwise("/")

  $stateProvider
    .state('loader', {
      url: '/',
      resolve: {
        locales: function (localeService) {
          // localeService.setCurrentLocale()
          //   .then(function (res) {
          //     return $location.path('initial')
          //   })
          localeService.setCurrentLocale()
        }
      }
    })
    // Auth navigation: welcome, login, forgot password
    .state('initial', {
      url: "/initial",
      templateUrl: "views/auth/initial.html",
      controller: "InitialCtrl",
      controllerAs: "initial",
      data: {
        access: 'noAuth'
      }
    })
    .state('auth', {
      abstract: true,
      templateUrl: 'views/auth/layout.html'
    })
    .state('auth.welcome', {
      url: "/welcome",
      views: {
        'content': {
          templateUrl: "views/auth/welcome.html"
        }
      },
      data: {
        access: 'noAuth'
      }
    })
    .state('auth.login', {
      url: "/login",
      views: {
        'content': {
          templateUrl: "views/auth/login.html",
          controller: "LoginCtrl",
          controllerAs: "login"
        }
      },
      data: {
        access: 'noAuth'
      }
    })

    // Dashboard
    .state('dashboard', {
      url: "/dashboard",
      templateUrl: "views/dashboard/container.html",
      controller: "dashboardCtrl as dashboard",
      redirectTo: "dashboard.find-np.list",
      abstract: true,
      data: {
        access: 'auth'
      }
    })

    // Find NP
    .state('dashboard.find-np', {
      url: "/find-np",
      templateUrl: "views/dashboard/abstract-tab.html",
      redirectTo: "dashboard.find-np.list",
      abstract: true,
      data: {
        access: 'auth'
      }
    })
    .state('dashboard.find-np.list', {
      url: "/list",
      templateUrl: "views/dashboard/np-list.html",
      controller: "NPListCtrl as npList",
      data: {
        access: 'auth'
      }
    })
    .state('dashboard.find-np.map', {
      url: "/map",
      templateUrl: "views/dashboard/np-map.html",
      controller: "NPMapCtrl as npMap",
      data: {
        access: 'auth'
      }
    })

    // Purchase
    .state('dashboard.purchase', {
      url: "/purchase",
      redirectTo: 'dashboard.purchase.list',
      templateUrl: "views/dashboard/abstract-tab.html",
      abstract: true,
      data: {
        access: 'auth'
      }
    })
    .state('dashboard.purchase.list', {
      url: "/list",
      templateUrl: "views/dashboard/np-list.html",
      controller: "NPListCtrl as npList",
      data: {
        access: 'auth',
        statuses: ['inactive', 'opportunity']
      }
    })
    .state('dashboard.purchase.new', {
      url: "/create/:action",
      templateUrl: "views/dashboard/purchase-new.html",
      controller: "PurchaseCtrl as purchase",
      data: {
        access: 'auth'
      }
    })
    .state('dashboard.purchase.confirm', {
      url: "/confirm",
      templateUrl: "views/dashboard/purchase-confirm.html",
      controller: "PurchaseConfirmCtrl as confirmCtrl",
      data: {
        access: 'auth',
        backState: 'dashboard.purchase.new'
      }
    })
    .state('dashboard.purchase.edit-billing-info', {
      url: "/edit-billing-info",
      templateUrl: "views/dashboard/edit-billing-info.html",
      controller: "editBillingInfoCtrl as editBillingInfo",
      data: {
        access: 'auth',
        backState: 'dashboard.purchase.new'
      }
    })
    .state('dashboard.purchase.summary', {
      url: "/summary",
      templateUrl: "views/dashboard/purchase-summary.html",
      controller: "purchaseSummaryCtrl as summaryCtrl",
      data: {
        access: 'auth',
        backState: 'dashboard.purchase.list'
      }
    })

    // Settings
    .state('settings', {
      url: "/settings",
      templateUrl: "views/settings/settings.html",
      controller: "SettingsCtrl as settings",
      data: {
        access: 'auth',
        backState: 'dashboard'
      }
    })
    .state('location-list', {
      url: "/location-list",
      templateUrl: "views/settings/location-list.html",
      controller: "LocationListCtrl as locationListCtrl",
      data: {
        access: 'auth',
        backState: 'settings'
      }
    })
    .state('add-location', {
      url: "/add-location/:edit",
      templateUrl: "views/settings/create-location.html",
      controller: "CreateLocationCtrl as locationCtrl",
      data: {
        access: 'auth',
        backState: 'settings'
      }
    })
}


function stateChangeConfig($rootScope, $state, authService, creditCardService, npService) {
  $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
    // Data can't be undefined
    if (!toState.data) {
      toState.data = {}
    }

    // Handle session redirects
    var userLogged = authService.isAuthUser()
    if (toState.data.access === 'auth' && !userLogged) {
      e.preventDefault()
      $state.go('auth.login')
    }
    if (toState.data.access === 'noAuth' && userLogged) {
      e.preventDefault()
      $state.go('dashboard.find-np')
    }

    if (toState.data.toPrevious) {
      toState.data.backState = fromState.name
    }

    // If 'backState' exists then we set the 'backButtonEnabled' property to true. (Used on actionBar for iOS)
    toState.data.backButtonEnabled = (toState.data.backState != undefined)

    var purchaseTabChanged = (fromState.name.indexOf('purchase') != -1) && (toState.name.indexOf('purchase') == -1)
      && (toState.name.indexOf('history') == -1) && (toState.name.indexOf('manage.membership') == -1)
    if (purchaseTabChanged) {
      creditCardService.setCurrentCreditCard(null)
      npService.setCurrentNonProfit(null)
    }

    $rootScope.previousState = fromState.name
  })
}

function setAndroidBackButton($state) {
  document.addEventListener("backbutton", function () {
    var backState = $state.current.data.backState
    if (backState) {
      $state.go(backState)
    }
  }, true)
}
