'use strict';
bg.ecard.DomTarget = function( selector, createClone, is2scr, parentDomObj, prepend ) {
	this.params = {	type: 'bg.ecard.DomTarget' };
	
	//console.log( this, selector );
	
	if ( typeof(selector) === 'string' ) {
		this.params.id = selector;
		this.params.selector = selector;
	} else {
		this.target = selector;
		this.params.selector = selector;
	}
  
  this.attachedState = new Array();
	
//	console.log( this );
	
	this.init( createClone, is2scr, parentDomObj, prepend );
}

bg.ecard.DomTarget.prototype.init = function(createClone, is2scr, parentDomObj, prepend) {
//	app.log(this, 'init()', this.params.selector);
  
//  console.log('bg.ecard.DomTarget.prototype.init', prepend);
	
	if (!is2scr) {
		var docToSearch = document;
	} else {
    if (app.secondScreen.secondScreen) {
		  var docToSearch = app.secondScreen.secondScreen.document;
    }
	}
	
	if (parentDomObj){
		//console.log( 'parentDomObj: ', parentDomObj);
		docToSearch = parentDomObj;
	}
	
	if (createClone) { // clone DOM element from selector
		
		var cloneSource = docToSearch.querySelector( this.params.selector );
//		console.log(docToSearch, this.params.selector, cloneSource);
		if (!cloneSource) {
			app.die({errorId:'domTarget - clone source element missing', elementName:''+this.params.selector});
			return false;
		}
    if (prepend === true) {
		  this.target = cloneSource.parentNode.insertBefore( cloneSource.cloneNode(true), cloneSource.parentNode.firstChild.nextSibling );
    } else {
      this.target = cloneSource.parentNode.appendChild( cloneSource.cloneNode(true) );
    }
		this.target.prevDisplayState = cloneSource.prevDisplayState;
		
	} else { // just search DOM
		
		if (!this.target) this.target = docToSearch.querySelector( this.params.selector );
		
	}
	
	if (!this.target) {
		
		return false;
//		app.die({errorId: 'domTarget created for non-existant dom element', elementName: this.params.selector});
		
	}
	
	this.style = this.target.style;
  this.targetDomTag = this.target.tagName;
  this.targetDataType = this.target.dataset.type;
	
//	console.log( this.target );
}

bg.ecard.DomTarget.prototype.button = function(domEl) {
	app.log(this, 'button', domEl.innerHTML);
	
	
	
	var actionValue = domEl.innerHTML;
	if (domEl.dataset && domEl.dataset['action']) {
		var action = domEl.dataset['action'];
	} else {
		var action = domEl.innerHTML.toLowerCase();
	}
  	
	if (this.target.tagName === 'INPUT') {
		
		if (action === 'back' || action === '&lt;'|| action === '&#8592;' || action === '←') { // backspace
			
      var currValue = this.target.value;
      var currPos = this.target.selectionStart;
      if (currPos === 0) {
        app.active.input.focus();
        return;
      }
			this.target.value = currValue.slice(0, currPos - 1) + currValue.slice(currPos, currValue.length);
      this.target.setSelectionRange(currPos - 1, currPos - 1);
			app.active.input.focus();
					
		} else if ( (action === 'ent') || (action === 'ok') ) { // enter
			
			if ( this.target.dataset.action && this.target.dataset.target ) {
				
				if (this.target.dataset.target === 'section') {
					app.active.section.events.trigger( this.target.dataset.action, this.target );
					return true;
				}	else if (this.target.dataset.target === 'element') {
//					var targetEl = app.getElement( this.target.dataset.eltype, this.target.dataset.elid );
//					console.log( 'targetEl:', targetEl ); 
//					if (targetEl) {
//						targetEl.events.trigger(domEl.dataset.action, domEl);
//					} 		
				}
			} else {
				//console.log( 'ENT', domEl );	
				app.input.clearSelection();
			}
      
    } else if ( action === 'moveL' ) {
      
      this.target.setSelectionRange(this.target.selectionStart-1, this.target.selectionStart-1);
      app.active.input.focus();
      
    } else if ( action === 'moveR' ) {
      
      this.target.setSelectionRange(this.target.selectionStart+1, this.target.selectionStart+1);
      app.active.input.focus();
			
		} else { // fill button value in input
			
			var shouldAdd = true;
			if (this.target.dataset.maxlength) { // input el has data-maxlength set
				if ( parseInt(this.target.dataset.maxlength) <= this.target.value.length ) {
					shouldAdd = false;
				}
			}
			
			if (shouldAdd) {
        var currValue = this.target.value; 
        var currPos = this.target.selectionStart;
				this.target.value = currValue.slice(0, currPos) + actionValue + currValue.slice(currPos, currValue.length);
        this.target.setSelectionRange(currPos+1, currPos+1);
			}
			app.active.input.focus();
			
		}
		
	}
	
}

bg.ecard.DomTarget.prototype.html = function( htmlStr ) {
//	app.log( this, 'html()');
  
  if (!this.target) {
    return;
  }

//	if (!htmlStr) {
//		return this.target.innerHTML;
//	}

	if (this.targetDataType == 'currency') {
		htmlStr = parseFloat(htmlStr).formatCurrency(0,'.','&nbsp;')
//		htmlStr += ' лв.';
	} else if (this.targetDataType == 'secToMin') {
		htmlStr = app.time.secondsToTime(parseInt(htmlStr));
	}
	
	if (this.targetDomTag === 'INPUT') {
   this.target.value = htmlStr; 
  } else {
	 this.target.innerHTML = htmlStr;
  }
	
}

bg.ecard.DomTarget.prototype.getValues = function() {
	if (this.target.tagName !== 'FORM') return;
	
	app.log( this, 'getValues()' );
	
	var inputEls = this.target.querySelectorAll('input');
	var retObj = {};
	
	for (var i=0; i<inputEls.length; i++) {
		retObj[inputEls[i].name] = inputEls[i].value;
	}
	
	return retObj;
}

bg.ecard.DomTarget.prototype.getValue = function() {
//	if (this.target.tagName !== 'INPUT') return;

	app.log( this, 'getValue()' );
  if (this.target.tagName === 'INPUT') {
    return this.target.value;
  } else {
    return this.target.textContent;
  }
}

bg.ecard.DomTarget.prototype.setValue = function( valueToSet ) {
	if (this.target.tagName !== 'INPUT') return;

	app.log( this, 'setValue()' );

	this.target.value = valueToSet;
}

bg.ecard.DomTarget.prototype.serialize = function() {
	if (this.target.nodeName !== 'FORM') return;
	
	var inputEls = this.target.querySelectorAll('input, select');
	var retObj = [];
	
	for (var i=0; i<inputEls.length; i++) {
//    console.log(inputEls[i], inputEls[i].value);
		retObj.push( inputEls[i].name + '=' + encodeURIComponent(inputEls[i].value) );
	}
	
	return retObj.join('&');
}

bg.ecard.DomTarget.prototype.select = function() {
	
	this.addClass('active');
//	this.target.setAttribute('selected','selected')
	
}

bg.ecard.DomTarget.prototype.deselect = function() {
	
	this.removeClass('active');
//	this.target.setAttribute('selected','selected')
	
}

bg.ecard.DomTarget.prototype.clear = function() {
	
	if (!this.target) {
		return;
	}
	
	if (this.target.nodeName !== 'FORM') return;

	var inputEls = this.target.querySelectorAll('input');
	
	for (var i=0; i<inputEls.length; i++) {
		inputEls[i].value = '';
	}


}

bg.ecard.DomTarget.prototype.show = function() {
	
	if (!this.target) {
		return;
	}
	
	app.log( this, 'show()', this.target.prevDisplayState );
	
	this.target.style.visibility = 'visible';
	
	if (this.target.prevDisplayState && this.target.prevDisplayState != 'none') {
		this.target.style.display = this.target.prevDisplayState;
	} else {
		this.target.style.display = 'block';
	}
}

bg.ecard.DomTarget.prototype.hide = function() {
	app.log( this, 'hide()' );
  
  //console.log(this);
	
  if (this.target) {
    //console.log(window.getComputedStyle( this.target ));
    this.target.prevDisplayState = window.getComputedStyle( this.target ).display;
    

    this.target.style.visibility = 'hidden';	
    this.target.style.display = 'none';
  }
}

bg.ecard.DomTarget.prototype.focus = function() {
	this.target.focus();
}

bg.ecard.DomTarget.prototype.blur = function() {
	this.target.blur();
}

bg.ecard.DomTarget.prototype.find = function(selector, returnDomTarget) {
	
  if (!this.target) {
    return;
  }
  
	if (returnDomTarget) {
		return new bg.ecard.DomTarget( this.target.querySelector(selector) );
	} else {
		return this.target.querySelector(selector);
	}
}

bg.ecard.DomTarget.prototype.findAll = function(selector) {
	if (this.target) {
		return this.target.querySelectorAll(selector);
	}
}

bg.ecard.DomTarget.prototype.removeClass = function(className) {
	if (this.target) {
		if (this.target.classList.contains(className) ) {
			this.target.classList.remove( className );
		}
	}
}

bg.ecard.DomTarget.prototype.addClass = function(className) {
	if (this.target) {
		this.target.classList.add( className );
	}
}

bg.ecard.DomTarget.prototype.setData = function(dataObj) {
	if (this.target) {
		for (var i in dataObj) {
			//this.target.dataset[i] = dataObj[i];
      this.target.setAttribute('data-'+i.replace(/([A-Z])/g, "-$1").toLowerCase(), dataObj[i]);
		}
	}
}

bg.ecard.DomTarget.prototype.getData = function(dataId) {
  if (this.target) {
    return this.target.getAttribute('data-'+dataId);
	}
}

bg.ecard.DomTarget.prototype.removeData = function(dataAtributeName) {
  if (this.target) {
    this.target.removeAttribute('data-'+dataAtributeName.replace(/([A-Z])/g, "-$1").toLowerCase());
  }
  
}

bg.ecard.DomTarget.prototype.setAttribute = function(attributeName, attributeValue) {
  app.log(this, 'setAttribute', attributeName, attributeValue);
  
  this.target.setAttribute(attributeName.replace(/([A-Z])/g, "-$1").toLowerCase(), attributeValue);
}

bg.ecard.DomTarget.prototype.getAttribute = function(attributeName) {
  if (this.target) {
    return this.target.getAttribute(attributeName);
	}
}

bg.ecard.DomTarget.prototype.remove = function() {
	this.target.parentNode.removeChild(this.target);
}

bg.ecard.DomTarget.prototype.setState = function(stateId) {
	app.log( this, 'setState()', stateId );
	
	this.addClass('app-state-'+stateId);
  if (this.attachedState) {
    for (var i in this.attachedState) {
      this.attachedState[i].addClass('app-state-'+stateId);
    }
  }	
}

bg.ecard.DomTarget.prototype.removeState = function(stateId) {
	app.log( this, 'removeState()', stateId);
	
	this.removeClass('app-state-'+stateId);
  if (this.attachedState) {
    for (var i in this.attachedState) {
      this.attachedState[i].removeClass('app-state-'+stateId);
    }
  }	
	
}

bg.ecard.DomTarget.prototype.removeStates = function( partStateId ) {
	app.log( this, 'removeStates()', partStateId );
	
	if (partStateId) {
		for (var i=0; i < this.target.classList.length; i++) {
			if (this.target.classList[i].indexOf(partStateId) >= 0) {
        this.removeClass(this.target.classList[i]);
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
			this.removeClass( 'app-state-' + i );
			delete this.state[i];
		}
		
	}

}


bg.ecard.DomTarget.prototype.appendStringAsNodes = function(html) {
//	return;
	var element = this.target;
	var frag = document.createDocumentFragment(),
	tmp = document.createElement('body'), child;
	tmp.innerHTML = html;
	// Append elements in a loop to a DocumentFragment, so that the browser does
	// not re-render the document for each node
	while (child = tmp.firstChild) {
		frag.appendChild(child);
	}
	element.appendChild(frag); // Now, append all elements at once
	frag = tmp = null;
//	document.getElementById('s').pr
}

bg.ecard.DomTarget.prototype.prependStringAsNodes = function(html) {
//	return;
	var element = this.target;
	var frag = document.createDocumentFragment(),
	tmp = document.createElement('body'), child;
	tmp.innerHTML = html;
	// Append elements in a loop to a DocumentFragment, so that the browser does
	// not re-render the document for each node
	while (child = tmp.firstChild) {
		frag.appendChild(child);
	}
	element.insertBefore(frag, element.firstChild); // Now, append all elements at once
	frag = tmp = null;
//	document.getElementById('s').pr
}

bg.ecard.DomTarget.prototype.css = function(styleParam, styleValue) {
	app.log( this, 'css()', styleParam, styleValue);
		
	if ( (parseInt(styleValue) == styleValue) || (parseFloat(styleValue) == styleValue) ) {
		styleValue += 'px';
	}
	this.target.style[styleParam] = styleValue;
	
	
}

bg.ecard.utils.registerJS('bg.ecard.DomTarget.js');