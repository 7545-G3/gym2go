'use strict'

angular.module('ui.router-decorator', ['ui.router'])

  .config(function ($provide) {
    $provide.decorator('$state', function ($delegate) {
      var $stateTransitionTo = $delegate.transitionTo;

      $delegate.transitionTo = function transitionTo(to, toParams, options) {
        var toState = $delegate.get(to);

        if (toState && toState.abstract && toState.redirectTo) {
          to = toState.redirectTo;
          options = options || {};
          options.inherit = false;
        }

        return $stateTransitionTo.call($delegate, to, toParams, options);
      };

      return $delegate;
    });
  });
