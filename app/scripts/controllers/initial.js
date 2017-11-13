'use strict'

angular
  .module('exposureBusinessApp')
  .controller('InitialCtrl', InitialCtrl);

function InitialCtrl($state, localStorageService) {

  var welcomeShown = (localStorageService.get('welcomeShown') != null)

  if (welcomeShown) {
    $state.go('auth.welcome');
    return
  }

  showAnimation()

  /**
   * Display animation before getting started page
   * @return {[type]} [description]
   */
  function showAnimation() {

    var height = document.getElementById('authPage').offsetHeight;
    var slideInitial = 75;
    var slide2Top = 150;
    var slide2Bottom = 150;

    if (height <= 400) {
      slideInitial = 60;
      slide2Top = 85;
      slide2Bottom = 120;
    }


    var tl = new TimelineLite();
    tl.from(".initialWelcome .upper", 0.5, {opacity: 0, ease: Power0.easeInOut, delay: 3})
      .to(".initialWelcome .upper", 1.5, {
        borderBottomColor: "#3eb649",
        bottom: slideInitial + "px",
        borderBottomWidth: 2,
        borderBottomStyle: "solid",
        delay: 0.5
      }, 'slideLayers')
      .to(".initialWelcome .down", 1.5, {
        borderTopColor: "#3eb649",
        top: slideInitial + "px",
        borderTopWidth: 2,
        borderTopStyle: "solid",
        delay: 0.5
      }, 'slideLayers')
      .from(".initialWelcome .text1", 1.5, {opacity: 0, ease: Power0.easeInOut}, '-=1')
      .to(".initialWelcome", 1, {opacity: 0, ease: Power0.easeInOut, display: 'none'})
      .fromTo(".slide2", 0, {display: 'none'}, {display: 'block'})
      .fromTo(".slide2 .upper", 4, {display: 'none'}, {
        display: 'block',
        borderBottomColor: "#3eb649",
        bottom: slide2Top + "px",
        borderBottomWidth: 2,
        borderBottomStyle: "solid"
      }, 'slideLayers2')
      .fromTo(".slide2 .down", 4, {display: 'none'}, {
        display: 'block',
        borderTopColor: "#3eb649",
        top: slide2Bottom + "px",
        borderTopWidth: 2,
        borderTopStyle: "solid"
      }, 'slideLayers2')
      .fromTo(".slide2 .text2", 1.5, {opacity: 0, ease: Power0.easeInOut, display: 'block'}, {
        opacity: 1,
        ease: Power0.easeInOut,
        display: 'block'
      }, '-=2')
      .to(".slide2", 1.5, {opacity: 0, ease: Power0.easeInOut, onComplete: completeHandler});
  }

  /**
   * Redirect to getting started page
   * @return {[type]}         [description]
   */
  function completeHandler() {
    localStorageService.set('welcomeShown', 1)
    $state.go('auth.welcome');
  }

}
