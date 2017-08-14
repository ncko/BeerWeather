"use strict";

/*
 *  This module manages the start screen
 */
(function($, eventEmitter) {

  eventEmitter.on('init-app', init);
  eventEmitter.on('start-again', init);

  const $SCREEN = $('#js-start-screen');
  const $FORM = $('#js-form');
  const $STATUS_PANEL = $('#js-status-panel');

  /*
   *  - Ready the input to receive text
   *  - Hook up a submit event
   */
  function init() {
    $SCREEN.show();
    $FORM.find('input:text').prop('disabled', false);
    $STATUS_PANEL.html('');
    addSubmitListener();
  }

  /*
   *  - if input is valid
   *    - hide the starting screen
   *    - emit the 'submit-location' event
   *  - else
   *    - clear the input
   *    - tell the user to try again
   */
  function submitForm() {
    const input = $FORM.find('input:text');
    const val = input.val().trim();

    input.val('');

    if (validateInput(val)) {
      $SCREEN.hide();
      input.prop('disabled', true);
      eventEmitter.emit('submit-location', val);
    } else {
      showInvalidInputError();
      addSubmitListener();
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

  /*
   *  Add 'submit' listener to the form
   */
  function addSubmitListener() {
    $FORM.one( 'submit', event => {
      event.preventDefault();
      submitForm();
    });
  }

})(jQuery, window.eventEmitter);