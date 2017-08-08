"use strict";

(function($, eventEmitter) {

  eventEmitter.on('init-app', init);
  eventEmitter.on('beer-recommendations-ready', showResults);

  const $SCREEN = $('#js-results-screen');
  const $BEER_TITLE = $('#js-beer-title');
  const $BEER_DESCRIPTION = $('#js-beer-description');

  const $START_AGAIN_BTN = $('#js-start-again-btn');
  const $LOAD_NEW_BTN = $('#js-load-recommendation-btn');

  let beerList = null;

  function init() {
    $START_AGAIN_BTN.on('click', startAgain);
    $LOAD_NEW_BTN.on('click', loadNewBeer);
  }

  function showResults( beers ) {
    beerList = beers;
    loadNewBeer();
    $SCREEN.show();
  }

  function loadNewBeer() {
    let beer = beerList[ Math.floor( Math.random() * beerList.length ) ];
    populateBeerArticle( beer );
  }

  function populateBeerArticle( beer ) {
    $BEER_TITLE.text(beer.name);
    $BEER_DESCRIPTION.text(beer.description);
  }

  function startAgain(){
    eventEmitter.emit('start-again');
    $SCREEN.hide();
    populateBeerArticle({
      name: '',
      description: ''
    });
  }

})(jQuery, window.eventEmitter);