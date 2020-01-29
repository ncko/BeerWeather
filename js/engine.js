"use strict";

/*
 *  ENGINE fetches data from the relevant APIs and uses the data
 *  to generate a list of beers
 */
const ENGINE = (function($, eventEmitter) {

  eventEmitter.on('submit-location', setLocation);
  eventEmitter.on('coordinates-received', fetchForecast);
  eventEmitter.on('forecast-received', fetchBeerStyles);
  eventEmitter.on('beer-data-ready', generateBeerRecommendations);
  eventEmitter.on('start-again', init);

  const BREW_URL = 'https://beerweather-api.ncko.app';
  const GEOCODE_URL = 'https://geocode.xyz/?scantext=${location}&json=1';
  const GEOCODE_DEFAULT_QUERY = { json: 1 };
  const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/weather';
  const FORECAST_DEFAULT_QUERY = {
    appid: '208b09d63f6454839e7f821fad7776a0'
  };

  const TEMP_RANGE_UPPER = 100;
  const TEMP_RANGE_LOWER = 30;

  const DATA = {};

  let location = null;

  /*
   *  Delete keys from DATA
   */
  function init() {
    delete DATA.weather;
    delete DATA.beerStyles;
    location = null;
  }

  function setLocation( loc ) {
    location = loc;
    fetchCoordinates( location );
  }

  /*
   *  Takes a string representing a location and uses AJAX to send it to the
   *  Geocode.xyz api, sets a callback that receives the latitude and longitude
   */
  function fetchCoordinates( location ) {
    const query = Object.assign( GEOCODE_DEFAULT_QUERY, { scantext: location } );

    $.getJSON( GEOCODE_URL, query, data => {
      eventEmitter.emit('coordinates-received', data.latt, data.longt);
    });
  }

  /*
   *  Uses AJAX to send latitude and longitude to the OpenWeatherAPI and receives
   *  the current forecast
   */
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

  /*
   *  Gets a list of Beer Styles from the BreweryDB API
   */
  function fetchBeerStyles(){
      $.getJSON(`${BREW_URL}/styles`, data => {
        submitData('beerStyles', data);
        eventEmitter.emit('beer-styles-received');
      });
  }

  /*
   *  Fetches a list of beers with the provided StyleID
   */
  function fetchBeersByStyleID( id, fn ) {
    $.getJSON(`${BREW_URL}/beers?styleId=${id}` , data => {
      eventEmitter.emit('beer-list-received', data);
    })
  }

  /*  If it is hot, recommend a light beer. If it is cold, recommend a dark beer.
   *  See below for more details:
   *
   *  1.) Sort the list of beer styles by average SRM value (SRM = beer darkness)
   *  2.) Find the ratio of the current temperature and the range of temperatures between
   *      TEMP_RANGE_LOWER and TEMP_RANGE_UPPER. => "tempPercentage"
   *  3.) Produce a "targetSRM" that has the same ratio as tempPercentage to
   *      between the lowest and highest SRM values
   *  4.) Get a list of the beer styles with the closest average SRM values to targetSRM
   *  5.) Pick one randomly out of that list
   */
  function generateBeerRecommendations(weatherData, beerData){
    let beerStyles = beerData.data;
    // kelvin to fahrenheit
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

    /*
     *  1.) Sort the list of beer styles by average SRM value (SRM = beer darkness)
     */
    beerStyles.sort( (a, b) => {
      let srmA = averageSRM(a);
      let srmB = averageSRM(b);
      return srmA - srmB;
    } );

    /*
     *  2.) Find the ratio of the current temperature and the range of temperatures between
     *      TEMP_RANGE_LOWER and TEMP_RANGE_UPPER. => "tempPercentage"
     */
    let srmRangeLower = averageSRM(beerStyles[0]);
    let srmRangeHigher = averageSRM(beerStyles[ beerStyles.length - 1 ]);
    let srmRange = srmRangeHigher - srmRangeLower;
    let tempRange = TEMP_RANGE_UPPER - TEMP_RANGE_LOWER; // degrees fahrenheit
    let tempPercentage = (temperature - TEMP_RANGE_LOWER) / tempRange; // what percentage of temp range is temperature?
    
    /*
     *  3.) Produce a "targetSRM" that has the same ratio as tempPercentage to
     *      between the lowest and highest SRM values
     */
    let targetSRM = tempPercentage * srmRange; // what number is tempPercentage% of srmRange?
    targetSRM = srmRange - targetSRM; // invert - the higher the temperature, the lower the SRMs should be
    targetSRM += srmRangeLower; // adjust to within the actual range of possible SRMs

    /*
     *  4.) Get a list of the beer styles with the closest average SRM values to targetSRM
     */
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

    /*
     *  5.) Pick one randomly out of that list
     */
    let selectedBeerStyle = selectedStyles[ Math.floor( Math.random() * selectedStyles.length ) ];

    // Calls ENGINE.beerCB()
    // ENGINE.beerCB emits 'beer-list-received'
    fetchBeersByStyleID( selectedBeerStyle.id );
    eventEmitter.once('beer-list-received', data => {
      eventEmitter.emit('beer-recommendations-ready', location, weatherData, data.data, selectedBeerStyle );
    } );
  }

  /*
   *  Assigns data to DATA[type].
   *  If DATA['weather'] and DATA['beerStyles'] have both been assigned
   *  then it emits 'beer-data-ready' and passes.
   *  This triggers 'generateBeerRecommendations'
   */
  function submitData(type, data) {
    if (type === 'weather' || type === 'beerStyles') {
      DATA[type]=data;
    }

    if (DATA['weather'] && DATA['beerStyles'])
      eventEmitter.emit('beer-data-ready', DATA.weather, DATA.beerStyles);
  }
})(jQuery, window.eventEmitter);