'use strict';
bg.ecard.DisplayElement = {}

bg.ecard.DisplayElement.Class = function() {  
  this.params = {
    type: 'bg.ecard.DisplayElement.Class',
  }
}

bg.ecard.DisplayElement.Class.prototype.params = {
  type: 'bg.ecard.DisplayElement.Class'
}

bg.ecard.DisplayElement.Class.prototype.initClass = function() {
  app.log( this, 'initClass()');
  
  this.state = new Object();
  
  this.events = new bg.ecard.EventDispatcher(this);
  
  this.createHolder();

  this.interface = new bg.ecard.Interface({parent: this});
  
  
  
//  bg.ecard.utils.extendClass(bg.ecard.DisplayElement.Class, this, true);
  
//  this.createHolder();
//  this.createScreens();
}

bg.ecard.DisplayElement.Class.prototype.createHolder = function() {
  app.log(this, 'createHolder()');
  
  if (!this.holder) {
    this.holder = {};
  }
  
  this.holder.main = new bg.ecard.DomTarget(this.params.holder);
  
}

bg.ecard.DisplayElement.Class.prototype.show = function() {
  app.log(this, 'show()');
  
  this.holder.main.removeClass('hidden');
  
}

bg.ecard.DisplayElement.Class.prototype.hide = function() {
  app.log(this, 'hide()');
  
//  console.log(this.params.parent);
  this.params.parent.active = null;
  
  this.holder.main.addClass('hidden');

  
  
}

bg.ecard.DisplayElement.Class.prototype.button = function(domEl) {
  app.log(this, 'button');
  
  this.events.trigger('button:'+domEl.dataset.action, domEl);
  
  
}

bg.ecard.DisplayElement.Class.prototype.setState = function(stateId) {
	app.log( this, 'setState()', stateId );
	
  this.state[stateId] = true;
	this.holder.main.addClass('app-state-'+stateId);
  if (this.holder.main.attachedState.length) {
    for (var i in this.holder.main.attachedState) {
      this.holder.main.attachedState[i].addClass('app-state-'+stateId);
    }
  }	
	
}

bg.ecard.DisplayElement.Class.prototype.removeState = function(stateId) {
	app.log( this, 'removeState()', stateId);
	
  delete this.state[stateId];
	this.holder.main.removeClass('app-state-'+stateId);
  if (this.holder.main.attachedState.length) {
    for (var i in this.holder.main.attachedState) {
      this.holder.main.attachedState[i].removeClass('app-state-'+stateId);
    }
  }	
	
}

bg.ecard.DisplayElement.Class.prototype.removeStates = function( partStateId ) {
	app.log( this, 'removeStates()', partStateId );
	
	if (partStateId) {
	
		for (var i=0; i < this.holder.main.target.classList.length; i++) {
			if (this.holder.main.target.classList[i].indexOf(partStateId) >= 0) {
				this.holder.main.removeClass(this.holder.main.target.classList[i]);
        i--;
			}	
		}
		
		for (var i in this.state) {
			if (i.indexOf(partStateId) >= 0) {
				delete this.state[i];
			}
		}
		
	} else { // remove All states

			
		for (var i in this.state) {
			this.holder.main.removeClass( 'app-state-' + i );
			delete this.state[i];
		}
		
	}

}

bg.ecard.DisplayElement.Class.prototype.updateLabels = function(labels) {
  app.log(this, 'updateLabels');
  
  this.interface.updateLabels(labels);
}




bg.ecard.utils.registerJS('bg.ecard.DisplayElement.Class.js');