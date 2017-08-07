"use strict";

/*
 * The "engine" pulls information from the APIs and generates
 * a beer recommendation
 */
(function($, eventEmitter) {

  eventEmitter.on('submit-location', fetchCoordinates);
  eventEmitter.on('coordinates-received', fetchForecast);
  eventEmitter.on('forecast-received', fetchBeer);
  eventEmitter.on('beer-list-received', generateBeerRecommendation);

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

  function generateBeerRecommendation(){
    eventEmitter.emit('beer-recommendations-ready');
  }


})(jQuery, window.eventEmitter);