bg.ecard.InterfaceLabel = function(params) {
	this.parent = params.parent;
	this.params = {
		type: 'bg.ecard.InterfaceLabel',
		id: params.id
	}
	
	this.def = {
    value: ''
  };
	this.prevValue = '';
	
//  console.log(this.parent.parent.holder.main.target);
  
	this.holder = {
		main: new bg.ecard.DomTargets({
			parentEl: this.parent.parent.holder.main.target,
			query: '.label-' + this.params.id
		})
	}
  
  app.log(this, 'new bg.ecard.InterfaceLabel');
	
	if (params.value) {
		this.set(params.value);
	}
  
 
  
	this.init();

}

bg.ecard.InterfaceLabel.prototype.init = function() {
	app.log( this, 'init()' );
	
	this.getDefValue();
		
}

bg.ecard.InterfaceLabel.prototype.getDefValue = function() {
	app.log( this, 'getDefValue()' );
	
	if (this.holder.main.target) {
		this.def.value = this.holder.main.target.innerHTML;
	} else if (this.holder.main.targetDOMs && this.holder.main.targetDOMs[0] && this.holder.main.targetDOMs[0].target) {
    this.def.value = this.holder.main.targetDOMs[0].target.innerHTML;
  }
	
}

bg.ecard.InterfaceLabel.prototype.set = function(newValue) {
	
	if (typeof( newValue) === 'function' ) {
		app.log( this, 'set()', 'function' );
	} else {
		app.log( this, 'set()', newValue );
	}
	
	var valueToSet = new String('');
	
	if (this.holder.main) {
		
		if ( typeof( newValue) === 'function' ) {
			valueToSet = newValue.call( this.parent.parent.params.master );
		} else {
			valueToSet = newValue;
		}
		
		
		if ( (this.prevValue != valueToSet) || (valueToSet == '') ) {
			this.prevValue = valueToSet;
			if (valueToSet == '') {
				//valueToSet = '&nbsp;';
			}
			this.holder.main.html(valueToSet);
		}
	}
	

}

bg.ecard.InterfaceLabel.prototype.revert = function() {
  app.log( this, 'revert' );
  
  this.set(this.def.value);
  
}

bg.ecard.utils.registerJS('bg.ecard.InterfaceLabel.js');