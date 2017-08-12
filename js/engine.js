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

  const TEMP_RANGE_UPPER = 100;
  const TEMP_RANGE_LOWER = 30;

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

  function generateBeerRecommendations(weatherData, beerData){
    let beerStyles = beerData.data;
    let temperature = Math.round(((weatherData.main.temp - 273) * (9/5)) + 32);

    // helper function for getting the average SRM of a beer style
    function averageSRM(style) {
      return (parseFloat(style.srmMin) + parseFloat(style.srmMax)) / 2;
    }

    // filter out beer with not enough information
    beerStyles = beerStyles.filter( style => {
      let srm = averageSRM(style);
      return !isNaN(srm);
    } );

    // sort beer styles by their average SRM
    beerStyles.sort( (a, b) => {
      let srmA = averageSRM(a);
      let srmB = averageSRM(b);
      return srmA - srmB;
    } );

    let srmRangeLower = averageSRM(beerStyles[0]);
    let srmRangeHigher = averageSRM(beerStyles[ beerStyles.length - 1 ]);
    let srmRange = srmRangeHigher - srmRangeLower;
    let tempRange = TEMP_RANGE_UPPER - TEMP_RANGE_LOWER; // degrees fahrenheit

    let tempPercentage = (temperature - TEMP_RANGE_LOWER) / tempRange; // what percentage of temp range is temperature?
    let targetSRM = tempPercentage * srmRange; // what number is tempPercentage% of srmRange?
    targetSRM = srmRange - targetSRM; // invert - the higher the temperature, the lower the SRMs should be
    targetSRM += srmRangeLower; // adjust to within the actual range of possible SRMs


    // find the lowest difference between targetSRM and the closest average SRM value
    let lowestDistance = 999999;

    for (let i = 0; i < beerStyles.length; i++) {
      if (lowestDistance > Math.abs(averageSRM(beerStyles[i]) - targetSRM)) {
        lowestDistance = Math.abs(averageSRM(beerStyles[i]) - targetSRM);
      }
    }

    // collect the beerStyles with the closest average SRM value
    let selectedStyles = [];

    for (let i = 0; i < beerStyles.length; i++) {
      if ( Math.abs(averageSRM(beerStyles[i]) - targetSRM) === lowestDistance ) {
        selectedStyles.push( beerStyles[i] );
      }
    }

    // select a beer style randomly from the selected styles
    let selectedBeerStyle = selectedStyles[ Math.floor( Math.random() * selectedStyles.length ) ];

    // Uses JSONP to call FETCHER.beerCB()
    // FETCHER.beerCB emits 'beer-list-received'
    fetchBeersByStyleID( selectedBeerStyle.id );
    eventEmitter.once('beer-list-received', data => {
      eventEmitter.emit('beer-recommendations-ready', weather, data.data, selectedBeerStyle );
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