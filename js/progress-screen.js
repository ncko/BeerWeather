"use strict";

/*
 *  This module manages the progress section
 */
(function($, eventEmitter) {

  eventEmitter.on('submit-location', showScreen);
  eventEmitter.on('coordinates-received', coordinatesReceived);
  eventEmitter.on('forecast-received', forecastReceived);
  eventEmitter.on('beer-list-received', beerlistReceived);
  eventEmitter.on('beer-recommendations-ready', hideScreen);

  const $SCREEN = $('#js-loading-screen');
  const $PROGRESS_LIST = $('#js-loading-list');

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