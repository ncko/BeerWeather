/*
 *  Simple Event Emitter object
 */

function EventEmitter() {
  this.events = {};
}

EventEmitter.prototype.on = function( event, fn ) {
  if (!this.events[event]) this.events[event] = [];

  this.events[event].push(fn);
}

EventEmitter.prototype.emit = function() {
  const event = arguments[0];
  const params = Array.prototype.slice.call( arguments, 1 );

  if (!this.events[event]) return;

  this.events[event].forEach( callback => {
    callback.apply( null, params );
  } );
}

EventEmitter.prototype.removeListener = function( event, fn ) {
  if (!this.events[event]) return;

  this.events[event] = this.events[event].filter( eventCB => {
    return (eventCB !== fn);
  } );
}