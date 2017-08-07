"use strict";

(function($, eventEmitter) {

  eventEmitter.on('init-app', init);
  eventEmitter.on('beer-recommendations-ready', showResults);

  const $SCREEN = $('#js-results-screen');
  const $BEER_TITLE = $('#js-beer-title');
  const $BEER_DESCRIPTION = $('#js-beer-description');

  const $START_AGAIN_BTN = $('#js-start-again-btn');
  const $LOAD_NEW_BTN = $('#js-load-recommendation-btn');

  function init() {
    $START_AGAIN_BTN.on('click', startAgain);
    $LOAD_NEW_BTN.on('click', loadNewBeer);
  }

  function showResults( beerList ) {
    // let beer = beerList[ Math.floor( Math.random() * beerList.length) ];
    let beer = {
      title: 'Fake Beer',
      description: 'Rich, decadent and full-bodied. The intense, roasted malt flavor is derived from two types of chocolate malt and raw cocoa nibs. Whole vanilla beans introduced post-fermentation adds complexity and enhances the desert-like quality.'
    };
    populateBeerArticle( beer );
    $SCREEN.show();
  }

  function populateBeerArticle( beer ) {
    $BEER_TITLE.text(beer.title);
    $BEER_DESCRIPTION.text(beer.description);
  }

  function startAgain(){ console.log('start again'); }

  function loadNewBeer(){ console.log('load new beer'); }

})(jQuery, window.eventEmitter);