'use strict';
bg.ecard.EventDispatcher = function(parent, params) {
	
	if (params) { this.params = params; } else { this.params = {}; }
	if (parent) {
		this.parent = parent;
		this.params.id = parent.params.type+'-'+parent.params.id;
	}
	this.params.type = 'bg.ecard.EventDispatcher';
  
  this.params.triggerAsync = false;
	
	if (app.log) app.log(this, 'new bg.ecard.EventDispatcher');
	
	this.events = {};
	this.disabledEvents = [];
	
}

bg.ecard.EventDispatcher.prototype.bind = function(eventType, caller, action, execOnce) {
	app.console.log(this, 'bind()', ' eventType: ' + eventType, ' caller: ' + caller.params.id, ' action: '+action);
	
	if (!this.events[eventType]) {
    this.events[eventType] = [];
  }
	
	this.events[eventType].push( new bg.ecard.EventDispatcher.Event( this, {'eventType': eventType, 'caller': caller, 'action': action, 'execOnce': execOnce}) );
	
}

bg.ecard.EventDispatcher.prototype.unbind = function(eventType, caller, action) {
	app.console.log(this, 'unbind()', ' eventType: ' + eventType, ' caller: ' + caller.params.id, ' action: '+action);
	
	if (this.events[eventType]) {
		for (var i = 0; i < this.events[eventType].length; i++) {
			var eventi = this.events[eventType][i];
			if ( (eventi.params.caller === caller) && (eventi.params.action === action) ) {
				this.events[eventType].splice(i,1);
			}
		}
  }
	
}

bg.ecard.EventDispatcher.prototype.trigger = function(eventType,data,data2) {
	if(eventType.indexOf('timer.') < 0) app.console.log(this, 'trigger()', eventType, data, data2);

	if (this.events[eventType]) {
		if (this.disabledEvents[eventType]) {
		} else {
			for (var i = 0; i < this.events[eventType].length; i++) {
				this.events[eventType][i].trigger(data,data2);
			}
		}
	}

}

bg.ecard.EventDispatcher.prototype.disable = function(eventType) {
	app.log(this, 'disable()', eventType);
	
	this.disabledEvents[eventType] = true;
	
}

bg.ecard.EventDispatcher.prototype.enable = function(eventType) {
	app.log(this, 'enable()', eventType);
	
	this.disabledEvents[eventType] = false;
	delete this.disabledEvents[eventType];
	
}



bg.ecard.EventDispatcher.Event = function(parent, params) {

	this.parent = parent;
	this.params = params;
	
	this.params.type = 'bg.ecard.EventDispatcher.Event';
	this.params.id = this.params.caller.params.id+'---'+this.params.action;
	
}

bg.ecard.EventDispatcher.Event.prototype.trigger = function(data, data2) {
	app.log( this, 'trigger()' );
  
	if ( typeof( this.params.caller[this.params.action] ) === 'function' ) {
    if (this.parent.params.triggerAsync) {
      var _that = this;
      setTimeout(function(){
        _that.params.caller[_that.params.action](data, data2, {caller: _that.params.caller, eventParams: {action: _that.params.action, name: _that.params.eventType} });
      },0);
    } else {
		  this.params.caller[this.params.action](data, data2, {caller: this.params.caller, eventParams: {action: this.params.action, name: this.params.eventType} });
    }
		if (this.params.execOnce) {
			this.parent.unbind( this.params.eventType, this.params.caller, this.params.action );
		}
	} else {
		app.die({errorId: 'Event triger target action missing', elementName: this.params.caller.params.type + ' - action: ' + this.params.action});
	}
	

}

bg.ecard.utils.registerJS('bg.ecard.EventDispatcher.js');