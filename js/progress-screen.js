"use strict";

/*
 *  This module manages the progress screen
 */
(function($, eventEmitter) {

  eventEmitter.on('submit-location', showScreen);
  eventEmitter.on('coordinates-received', coordinatesReceived);
  eventEmitter.on('forecast-received', forecastReceived);
  eventEmitter.on('beer-styles-received', beerlistReceived);
  eventEmitter.on('beer-recommendations-ready', hideScreen);
  eventEmitter.on('start-again', init);

  const $SCREEN = $('#js-loading-screen');
  const $PROGRESS_LIST = $('#js-loading-list');

  /*
   *  Make sure the section is hidden and remove .done
   *  from the progress list items
   */
  function init() {
    hideScreen();
    $PROGRESS_LIST.find('li').removeClass('done');
  }

  function showScreen() {
    $SCREEN.show();
  }

  function hideScreen() {
    $SCREEN.hide();
  }

  function coordinatesReceived(){
    $PROGRESS_LIST.find('#js-coordinates-received').addClass('done');
  }
  
  function forecastReceived(){
    $PROGRESS_LIST.find('#js-forecast-received').addClass('done');
  }

  function beerlistReceived(){
    $PROGRESS_LIST.find('#js-beer-list-received').addClass('done');
  }

})(jQuery, window.eventEmitter);