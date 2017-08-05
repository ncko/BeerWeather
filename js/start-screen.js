"use strict";

(function($, eventEmitter) {

  eventEmitter.on('init-app', init);

  const $SCREEN = $('#js-start-screen');
  const $FORM = $('#js-form');

  function init() {
    $FORM.find('input:text').prop('disabled', false);
  }

})(jQuery, window.eventEmitter);