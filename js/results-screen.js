"use strict";

(function($, eventEmitter) {

  eventEmitter.on('init-app', init);
  eventEmitter.on('beer-recommendations-ready', showResults);

  const $SCREEN = $('#js-results-screen');
  const $BEER_LIST = $('#js-beer-list');

  const $START_AGAIN_BTN = $('#js-start-again-btn');
  const $LOAD_NEW_BTN = $('#js-load-recommendation-btn');

  const WEATHER_PARAGRAPHS_CLASS = '.js-weather-info';

  function init() {
    $START_AGAIN_BTN.on('click', startAgain);
  }

  function showResults( weather, beers, beerStyle ) {

    // prepend weather information to $SCREEN
    let fahrenheit = Math.round(((weather.main.temp - 273) * (9/5)) + 32); // convert kelvin to fahrenheit and round it
    $SCREEN.prepend( weatherParagraph( weather.name, fahrenheit, beerStyle.name ) );

    //add beerListItems to $BEER_LIST
    let beerListMarkup = beers.map( beer => {
      return beerListItem( beer.name, beer.description );
    } ).join('');

    $BEER_LIST.html( beerListMarkup );

    $SCREEN.show();
  }

  function weatherParagraph(cityName, temp, beerStyle) {
    return `<p class="lead js-weather-info">In ${cityName} it is about ${temp} degrees. 
    In times like these I reach for a ${beerStyle}. Here are some options below:</p>`;
  }

  function beerListItem(title, description) {
    if (!description) description = '';

    return `<li>
            <h3 class="beer-title">${title}</h3>
            <p class="beer-description">${description}</p>
          </li>`;
  }

  function startAgain(){
    eventEmitter.emit('start-again');
    $(WEATHER_PARAGRAPHS_CLASS).remove();
    $BEER_LIST.html('');
    $SCREEN.hide();
  }

})(jQuery, window.eventEmitter);