"use strict";

const ENGINE = (function($, eventEmitter) {

  eventEmitter.on('submit-location', fetchCoordinates);
  eventEmitter.on('coordinates-received', fetchForecast);
  eventEmitter.on('forecast-received', fetchBeerStyles);
  eventEmitter.on('beer-data-ready', generateBeerRecommendations);
  eventEmitter.on('start-again', init);

  const GEOCODE_URL = 'https://geocode.xyz/?scantext=${location}&json=1';
  const GEOCODE_DEFAULT_QUERY = { json: 1 };
  const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/weather';
  const FORECAST_DEFAULT_QUERY = {
    appid: '208b09d63f6454839e7f821fad7776a0'
  };

  const DATA = {};

  function init() {
    delete DATA.weather;
    delete DATA.beerStyles;
  }

  function fetchCoordinates( location ) {
    const query = Object.assign( GEOCODE_DEFAULT_QUERY, { scantext: location } );

    $.getJSON( GEOCODE_URL, query, data => {
      eventEmitter.emit('coordinates-received', data.latt, data.longt);
    });
  }

  function fetchForecast( latitude, longitude ){
    const query = Object.assign( FORECAST_DEFAULT_QUERY, {
      lat: latitude,
      lon: longitude
    } );

    $.getJSON(FORECAST_URL, query, data => {
      submitData('weather', data);
      eventEmitter.emit('forecast-received', data);
    });
  }

  function fetchBeerStyles(){
    const beerURL = encodeURIComponent('http://api.brewerydb.com/v2/styles/?key=8a9ed8ea98f0e79ee32f70659adfd782');
    const jsonpURL = `https://json2jsonp.com/?url=${beerURL}&callback=ENGINE.beerStylesCB`;

    var tag = document.createElement("script");
    tag.src = jsonpURL;
    document.getElementsByTagName("head")[0].appendChild(tag);
  }

  function fetchBeersByStyleID( id, fn ) {
    const beerURL = encodeURIComponent(`http://api.brewerydb.com/v2/beers/?key=8a9ed8ea98f0e79ee32f70659adfd782&styleId=${id}`);
    const jsonpURL = `https://json2jsonp.com/?url=${beerURL}&callback=ENGINE.beerCB`;

    var tag = document.createElement("script");
    tag.src = jsonpURL;
    document.getElementsByTagName("head")[0].appendChild(tag);
  }

  function generateBeerRecommendations(weather, beer){
    let style = beer.data[ Math.floor(Math.random() * beer.data.length) ];


    // Uses JSONP to call FETCHER.beerCB()
    // FETCHER.beerCB emits 'beer-list-received'
    fetchBeersByStyleID( style.id );
    eventEmitter.once('beer-list-received', data => {
      eventEmitter.emit('beer-recommendations-ready', weather, data.data, style );
    } );

  }

  function submitData(type, data) {
    if (type === 'weather' || type === 'beerStyles') {
      DATA[type]=data;
    }

    if (DATA['weather'] && DATA['beerStyles'])
      eventEmitter.emit('beer-data-ready', DATA.weather, DATA.beerStyles);
  }

  return {
    beerStylesCB: function( data ) {
      submitData('beerStyles', data);
      eventEmitter.emit('beer-styles-received');
    },
    beerCB: function( data ) {
      eventEmitter.emit('beer-list-received', data);
    }
  }

})(jQuery, window.eventEmitter);