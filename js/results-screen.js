"use strict";

/*
 *  This module manages the results screen
 */
(function($, eventEmitter) {

  eventEmitter.on('init-app', init);
  eventEmitter.on('beer-recommendations-ready', showResults);

  const $SCREEN = $('#js-results-screen');
  const $BEER_LIST = $('#js-beer-list');
  const $START_AGAIN_BTN = $('#js-start-again-btn');
  const WEATHER_PARAGRAPHS_CLASS = '.js-weather-info';

  /*
   *  Add click event listener to the "start again" button
   */
  function init() {
    $START_AGAIN_BTN.on('click', startAgain);
  }

  /*
   *  - Prepend paragraph
   *  - Add list items w/ beer info to the BEER_LIST ul
   */
  function showResults( location, weather, beers, beerStyle ) {

    // prepend weather information to $SCREEN
    let fahrenheit = Math.round(((weather.main.temp - 273) * (9/5)) + 32); // convert kelvin to fahrenheit and round it
    $SCREEN.prepend( weatherParagraph( location, fahrenheit, beerStyle.name ) );

    // filter out beers without descriptions
    beers = beers.filter( beer => beer.description );

    //add beerListItems to $BEER_LIST
    let beerListMarkup = beers.map( beer => {
      return beerListItem( beer.name, beer.description, beer.labels );
    } ).join('');

    $BEER_LIST.html( beerListMarkup );

    $SCREEN.show();
  }

  /*
   *  generates markup for the paragraph that gets prepended to the section
   */
  function weatherParagraph(cityName, temp, beerStyle) {
    return `<p class="lead js-weather-info">In ${cityName} it is about ${temp}
    degrees. I recommend a ${beerStyle}. Here are some options:</p>`;
  }


  /*
   *  Generates markup for a beer list item
   */
  function beerListItem(title, description, label) {
    let imgURL = label && label.medium ? label.medium : 'no-label.jpg';

    return `<li class="media">
            <img class="media-image" src="${imgURL}" alt="Label for ${title}">
            <div class="media-body">
            <h3 class="beer-title">${title}</h3>
            <p class="beer-description">${description}</p>
            </div>
          </li>`;
  }

  /*
   *  - Emit 'start-again' event
   *  - Clear the generated HTML
   *  - Hide the section
   */
  function startAgain(){
    eventEmitter.emit('start-again');
    $(WEATHER_PARAGRAPHS_CLASS).remove();
    $BEER_LIST.html('');
    $SCREEN.hide();
  }

})(jQuery, window.eventEmitter);
