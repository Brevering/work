bg.ecard.DomTargets = function( params ) {
	
	if (params) {
		this.params = params;
		if (params.parent) this.parent = params.parent;
	} else {
		this.params = {};
	}
	
	this.params.type = 'bg.ecard.DomTargets';
	
	
	
	
	
	
	/*
	if ( typeof(selector) === 'string' ) {
		this.params.id = selector;
		this.params.selector = selector;
	} else {
		this.target = selector;
		this.params.selector = selector;
	}
	*/
	
	this.init();
	
}

bg.ecard.DomTargets.prototype.init = function() {
	app.log(this, 'init()');

	//ANTON UGLY PATCH
	if ( !this.params || !this.params.parentEl ) {

		app.log(this, 'UNDEFINED PARENT EL');
		return;
	}

	this.targets = this.params.parentEl.querySelectorAll( this.params.query );
	this.targetDOMs = [];
	
	for (var i=0; i <this.targets.length; i++) {	
		this.targetDOMs.push( new bg.ecard.DomTarget(this.targets[i]) );
	}
	
}

bg.ecard.DomTargets.prototype.button = function(domEl) {
	app.log( this, 'button() not yet implemented !' );
}

bg.ecard.DomTargets.prototype.html = function( htmlStr ) {
	app.log( this, 'html()' );

	//ANTON PATCH
	if ( !this.targetDOMs ) {
		return;
	}
	
	//console.log('!!!!!!!!!');
	
	for (var i=0; i<this.targetDOMs.length; i++) {
		this.targetDOMs[i].html( htmlStr );	
	}

	
}

bg.ecard.DomTargets.prototype.getValues = function() {
	app.log( this, 'getValues() not yet implemented !' );
}

bg.ecard.DomTargets.prototype.getValue = function() {
	app.log( this, 'getValue() not yet implemented !' );
  
}


bg.ecard.DomTargets.prototype.serialize = function() {
	app.log( this, 'serialize() not yet implemented !' );
}

bg.ecard.DomTargets.prototype.select = function() {
	app.log( this, 'select()' );
	
	for (var i=0; i<this.targetDOMs.length; i++) {
		this.targetDOMs[i].select();	
	}
}

bg.ecard.DomTargets.prototype.deselect = function() {
	app.log( this, 'select()' );
	
	for (var i=0; i<this.targetDOMs.length; i++) {
		this.targetDOMs[i].deselect();	
	}
}

bg.ecard.DomTargets.prototype.setState = function(stateId) {
	app.log( this, 'setState()', stateId );

	for (var i=0; i<this.targetDOMs.length; i++) {
		this.targetDOMs[i].setState(stateId);	
	}

}

bg.ecard.DomTargets.prototype.removeState = function(stateId) {
	app.log( this, 'removeState()', stateId);
	
	for (var i=0; i<this.targetDOMs.length; i++) {
		this.targetDOMs[i].removeState(stateId);	
	}
	
}

bg.ecard.DomTargets.prototype.setValue = function( newValue ) {
	
	for (var i=0; i<this.targetDOMs.length; i++) {
		this.targetDOMs[i].setValue(newValue);	
	}
}


bg.ecard.DomTargets.prototype.show = function() {
	app.log( this, 'show() not yet implemented !' );
}

bg.ecard.DomTargets.prototype.hide = function() {
	app.log( this, 'hide() not yet implemented !' );
}

bg.ecard.DomTargets.prototype.focus = function() {
	app.log( this, 'focus() not yet implemented !' );
}

bg.ecard.DomTargets.prototype.blur = function() {
	app.log( this, 'blur() not yet implemented !' );
}

bg.ecard.DomTargets.prototype.find = function(selector, returnDomTarget) {
	app.log( this, 'find() not yet implemented !' );
}

bg.ecard.DomTargets.prototype.findAll = function(selector) {
	app.log( this, 'findAll() not yet implemented !' );
}

bg.ecard.DomTargets.prototype.removeClass = function(className) {
	app.log( this, 'removeClass() not yet implemented !' );
}

bg.ecard.DomTargets.prototype.addClass = function(className) {
	app.log( this, 'addClass() not yet implemented !' );
}

bg.ecard.DomTargets.prototype.setData = function(dataObj) {
	app.log( this, 'setData()' );
  
  for (var i=0; i<this.targetDOMs.length; i++) {
		this.targetDOMs[i].setData(dataObj);	
	}
}
bg.ecard.DomTargets.prototype.removeData = function(dataId) {
	app.log( this, 'removeData()' );
	console.log( this, 'removeData()' );
  
  for (var i=0; i<this.targetDOMs.length; i++) {
    console.log(i);
		this.targetDOMs[i].removeData(dataId);	
	}
}

bg.ecard.DomTargets.prototype.remove = function() {
	app.log( this, 'remove() not yet implemented !' );
}

bg.ecard.utils.registerJS('bg.ecard.DomTargets.js');
