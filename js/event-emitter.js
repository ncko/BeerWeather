/*
 *  Simple Event Emitter object
 */

function EventEmitter() {
  this.events = {};
}

/*
 *  Add an array to the this.events[event] if one doesn't already exist
 *  and put the provided callback in it
 */
EventEmitter.prototype.on = function( event, fn ) {
  if (!this.events[event]) this.events[event] = [];

  this.events[event].push(fn);
}

/*
 *  Call all of the functions in this.events[ arguments[0] ]
 *  and pass the rest of the provided arguments to them
 */
EventEmitter.prototype.emit = function() {
  const event = arguments[0];
  const params = Array.prototype.slice.call( arguments, 1 );

  if (!this.events[event]) return;

  this.events[event].forEach( callback => {
    callback.apply( null, params );
  } );
}

/*
 *  Produces a clone of this.events[event] with 'fn' filtered out
 *  and assigns the new array to this.events[event]
 */
EventEmitter.prototype.removeListener = function( event, fn ) {
  if (!this.events[event]) return;

  this.events[event] = this.events[event].filter( eventCB => {
    return (eventCB !== fn);
  } );
}

/*
 *  Add two functions to this.event[event]: fn() and g()
 *  g() removes itself and fn() from this.events[event]
 */
EventEmitter.prototype.once = function( event, fn ) {
  var self = this;
  function g() {
    self.removeListener(event, fn);
    self.removeListener(event, g);
  }

  this.on(event, fn);
  this.on(event, g);
}