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

EventEmitter.prototype.emit = function( event ) {
  if (!this.events[event]) return;

  this.events[event].forEach( eventcb => {
    eventcb();
  } );
}