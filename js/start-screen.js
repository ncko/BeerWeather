"use strict";

/*
 *  This module manages the start screen
 */
(function($, eventEmitter) {

  eventEmitter.on('init-app', init);

  const $SCREEN = $('#js-start-screen');
  const $FORM = $('#js-form');
  const $STATUS_PANEL = $('#js-status-panel');

  /*
   *  - Ready the input to receieve text
   *  - Hook up a submit event
   */
  function init() {
    $FORM.find('input:text').prop('disabled', false);

    $FORM.submit( event => {
      event.preventDefault();
      submitForm();
    } );
  }

  /*
   *  - if inpute is valid
   *    - hide the starting screen
   *    - emit the 'submit-location' event
   *  - else
   *    - clear the input
   *    - tell the user to try again
   */
  function submitForm() {
    const input = $FORM.find('input:text').val().trim();

    if (validateInput(input)) {
      $SCREEN.hide();
      eventEmitter.emit('submit-location', input);
    } else {
      $FORM.find('input:text').val('');
      showInvalidInputError();
    }
  }

  /*
   *  allow only letters, spaces and commas
   */
  function validateInput( input ) {
    return /^[A-Za-z\s,]+$/.test(input);
  }

  /*
   *  Tell the user to try again
   */
  function showInvalidInputError() {
    $STATUS_PANEL.html('<p class="error">Your input is invalid. Try Again</p>');
  }

})(jQuery, window.eventEmitter);