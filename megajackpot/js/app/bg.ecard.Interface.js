bg.ecard.Interface = function(params) {
	this.parent = params.parent;
	this.params = {
		type: 'bg.ecard.Interface',
		id: 'if-' + this.parent.params.id
	}
	
	this.labels = {};
	
	this.init();
	
}

bg.ecard.Interface.prototype.init = function() {
	app.log(this, 'init()');
	
	if (this.parent.params.labels) { // create labels
		for (var i in this.parent.params.labels) {
			this.labels[i] = new bg.ecard.InterfaceLabel({parent: this, id: i, value: this.parent.params.labels[i]});
		}	
	}
		
	if (this.parent.params.data) { // fill dom element data-
		if (this.parent.holder.main) {				
			this.parent.holder.main.setData(this.parent.params.data);
		}
	}
	
  return;
  
	if (this.parent.holder.main.target) {
		if (this.parent.params.type.indexOf('.section.') < 0 ) { // skip auto show holder for section objects
			this.show();
		}
	} else {
		// !!!!!!!!! //
		//app.die({errorId: 'Interface holder DOM element missing', elementName: 'section: ' + this.parent.params.id + ', selector: ' + this.parent.holder.main.params.selector});
		// !!!!!!!!! //
	}
	
	if (!this.parent.button) {
		this.parent.button = this.button;
	}
	
	
}


bg.ecard.Interface.prototype.hide = function() {
	app.log( this, 'hide()' );
	
	if (this.scrollTarget) {
    app.input.clearScrollTarget();
  }
	
	this.parent.holder.main.hide();
}

bg.ecard.Interface.prototype.show = function() {
	app.log( this, 'show()' );
//	console.log( this.params.id, 'show()' );
	
	this.parent.holder.main.show();
	
	if (this.parent.params.scrollArea) {
		this.scrollTarget = new _App.dom.domTarget( this.parent.holder.main.find(this.parent.params.scrollArea) );	
		app.input.setScrollTarget( this.scrollTarget );
	}

}

bg.ecard.Interface.prototype.updateListScroll = function(list) {
	
//  console.log(list.params.id, 'updateListScroll()', list.params.reverseOrder);
  
	if (this.parent.params.scrollArea) {
		app.log( this, 'updateListScroll()' );
		if (!list.params.skipAutoScroll && !list.params.reverseOrder) {
			app.input.scrollToEnd();
		}
	}
}

bg.ecard.Interface.prototype.button = function(domEl) {
	app.log( this, 'button');
	this.events.trigger('button:'+domEl.dataset.action, domEl);
}

bg.ecard.Interface.prototype.updateLabels = function(labels) {
	app.log( this, 'updateLabels()' );
	
	for (var i in labels) {	
		if (!this.labels[i]) {
			this.labels[i] = new bg.ecard.InterfaceLabel({parent: this, id: i});
		}
		this.labels[i].set( labels[i] );
	}
	
}

bg.ecard.Interface.prototype.revertLabels = function() {
  app.log(this, 'revertLabels()');
  
  for (var i in this.labels) {	
		this.labels[i].revert();
	}
}

bg.ecard.Interface.prototype.setState = function(stateId) {
	app.log( this, 'setState()', stateId );
	
	this.parent.holder.main.addClass('app-state-'+stateId);	
	
}

bg.ecard.Interface.prototype.removeState = function(stateId) {
	app.log( this, 'removeState()', stateId);
	
	this.parent.holder.main.removeClass('app-state-'+stateId);
   
  
	
}

bg.ecard.Interface.prototype.removeStates = function( partStateId ) {
	app.log( this, 'removeStates()', partStateId );
	
	for (var i=0; i<this.parent.holder.main.target.classList.length; i++) {
		if (this.parent.holder.main.target.classList[i].indexOf(partStateId) >= 0) {		
			this.parent.holder.main.removeClass( this.parent.holder.main.target.classList[i] );			
		}
	}

}

bg.ecard.Interface.prototype.disable = function() {
	app.log( this, 'disable()' );

	this.setState('disabledInterface')

}

bg.ecard.Interface.prototype.enable = function() {
	app.log( this, 'enable()' );

	this.removeState('disabledInterface')

}

bg.ecard.Interface.prototype.getScrollBarWidth = function() {
  var inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  var outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild (inner);

  document.body.appendChild (outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild (outer);

  return (w1 - w2);
}

bg.ecard.utils.registerJS('bg.ecard.Interface.js');