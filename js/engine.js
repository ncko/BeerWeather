"use strict";

/*
 * The "engine" pulls information from the APIs and generates
 * a beer recommendation
 */
const ENGINE = (function($, eventEmitter) {

  eventEmitter.on('submit-location', fetchCoordinates);
  eventEmitter.on('coordinates-received', fetchForecast);
  eventEmitter.on('forecast-received', fetchBeer);
  eventEmitter.on('beer-list-ready', generateBeerRecommendation);

  const DATA = {};

  function fetchCoordinates( location ) {
    const url = window.encodeURI(`https://geocode.xyz/?scantext=${location}&json=1`);
    $.getJSON( url, {}, data => {
      eventEmitter.emit('coordinates-received', data.latt, data.longt);
    });
  }

  function fetchForecast(latitude, longitude){
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const DEFAULT_QUERY = {
      appid: '208b09d63f6454839e7f821fad7776a0',
      lat: latitude,
      lon: longitude
    };

    $.getJSON(url, DEFAULT_QUERY, data => {
      eventEmitter.emit('forecast-received', data);
      submitData('weather', data);
    });
  }

  function fetchBeer(){
    const beerURL = encodeURIComponent('http://api.brewerydb.com/v2/styles/?key=8a9ed8ea98f0e79ee32f70659adfd782');
    const jsonpURL = `https://json2jsonp.com/?url=${beerURL}&callback=ENGINE.beerCB`;

    var tag = document.createElement("script");
    tag.src = jsonpURL;
    document.getElementsByTagName("head")[0].appendChild(tag);
  }

  function generateBeerRecommendation(weather, beer){

    console.log(weather);
    console.log(beer);

    let beerList = [
      {
        title: 'Yum',
        description: 'It is yummy.'
      },
      {
        title: 'Delish',
        description: 'Can\'t beat it.'
      },
      {
        title: 'Meh',
        description: 'It is beatable.'
      },
      {
        title: 'Fake Beer',
        description: 'Rich, decadent and full-bodied. The intense, roasted malt flavor is derived from two types of chocolate malt and raw cocoa nibs. Whole vanilla beans introduced post-fermentation adds complexity and enhances the desert-like quality.'
      }
    ];

    eventEmitter.emit('beer-recommendations-ready', beerList);
  }

  function submitData( type, data ) {
    if (type === 'weather' || type ==='beer') {
      DATA[type] = data;
    }

    if (DATA.weather && DATA.beer) {
      eventEmitter.emit('beer-list-ready', DATA.weather, DATA.beer);
    }
  }

  return {
    beerCB: function( data ) {
      eventEmitter.emit('beer-list-received');
      submitData('beer', data);
    }
  }

})(jQuery, window.eventEmitter);