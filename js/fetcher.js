"use strict";

/*
 *  This module fetches information from the relevant APIs
 */
(function($, eventEmitter) {

  eventEmitter.on('submit-location', fetchCoordinates);
  eventEmitter.on('coordinates-received', fetchForecast);
  eventEmitter.on('forecast-received', fetchBeer);

  function fetchCoordinates( location ) {
    console.log('fetchCoordinates');
    setTimeout( () => {
      eventEmitter.emit('coordinates-received');
    }, 3000);
  }

  function fetchForecast(){
    console.log('fetchForecast');
    setTimeout( () => {
      eventEmitter.emit('forecast-received');
    }, 2000);
  }

  function fetchBeer(){
    console.log('fetchBeer');
    setTimeout( () => {
      eventEmitter.emit('beer-list-received');
    }, 3000);
  }


})(jQuery, window.eventEmitter);