'use strict';
bg.ecard.Section = {}

bg.ecard.Section.Class = function() {  
  this.params = {
    type: 'bg.ecard.Section.Class',
  }
}

bg.ecard.Section.Class.prototype.params = {
  type: 'bg.ecard.Section.Class'
}

bg.ecard.Section.Class.prototype.initClass = function() {
  app.log( this, 'initClass()');
  
  this.state = new Object();
  
  this.timer = new Object();
  
  this.animation = new Object();
  
  this.events = new bg.ecard.EventDispatcher(this);
  
  this.createHolder();

  this.interface = new bg.ecard.Interface({parent: this});
  
  
  
//  bg.ecard.utils.extendClass(bg.ecard.DisplayElement.Class, this, true);
  
//  this.createHolder();
//  this.createScreens();
}

bg.ecard.Section.Class.prototype.createHolder = function() {
  app.log(this, 'createHolder()');
  
  if (!this.holder) {
    this.holder = {};
  }
  
  this.holder.main = new bg.ecard.DomTarget('.app-section-'+this.params.id);
//  console.log(this.holder.main);
  
}

bg.ecard.Section.Class.prototype.show = function() {
  app.log(this, 'show()');
  
  this.events.trigger('display:beforeShow');
  this.holder.main.removeClass('hidden');
  this.events.trigger('display:afterShow');
  
}

bg.ecard.Section.Class.prototype.hide = function() {
  app.log(this, 'hide()');
  
//  console.log(this.params.parent);
  this.params.parent.active = null;
  
  this.events.trigger('display:beforeHide');
  this.holder.main.addClass('hidden');
  this.events.trigger('display:afterHide');
  
  return this;
  
}

bg.ecard.Section.Class.prototype.button = function(domEl) {
  app.log(this, 'button');
  
  this.events.trigger('button:'+domEl.dataset.action, domEl);
  
  
}

bg.ecard.Section.Class.prototype.setState = function(stateId) {
	app.log( this, 'setState()', stateId );
	
  this.state[stateId] = true;
	this.holder.main.addClass('app-state-'+stateId);	
	
}

bg.ecard.Section.Class.prototype.removeState = function(stateId) {
	app.log( this, 'removeState()', stateId);
	
  delete this.state[stateId];
	this.holder.main.removeClass('app-state-'+stateId);	
	
}

bg.ecard.Section.Class.prototype.removeStates = function( partStateId ) {
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




bg.ecard.utils.registerJS('bg.ecard.Section.Class.js');