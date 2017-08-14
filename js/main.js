"use strict";

window.eventEmitter = new EventEmitter();

$(function($){
  eventEmitter.emit('init-app');
});