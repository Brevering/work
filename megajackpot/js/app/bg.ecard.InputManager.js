bg.ecard.InputManager = function(params) {
	this.parent = params.parent;
	this.params = params;
	
	this.params.type = 'bg.ecard.InputManager';
	this.params.kbdTypes = [];
	this.params.kbdDisplayOffset = 5;
	this.keyboards = {};
	app.active.keyboard = null;
  
	this.init();	
}


bg.ecard.InputManager.prototype.attachBrowserEvents = function() {
	app.log( this, 'attachBrowserEvents()');
	/*
  if (!app.params.isLite || app.params.inputMode === 'web') {
//    window.addEventListener('click', function(event) {
////      event.preventDefault();
//    });
  }
  */
  
 /*if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
   window.addEventListener('touchstart', this.uiEventDown, false);
//   window.addEventListener('touchmove', function(event) {event.preventDefault();}, false);
   window.addEventListener('touchend', this.uiEventUp, false);
 } else {
   window.addEventListener('mousedown', this.uiEventDown);
   window.addEventListener('mousemove', this.uiEventMove);
   window.addEventListener('mouseup', this.uiEventUp);
 } 
*/
    window.addEventListener('mousedown', this.uiEventDown);
   window.addEventListener('mousemove', this.uiEventMove);
   window.addEventListener('mouseup', this.uiEventUp);
  
  /*
	window.addEventListener('keypress', function(event) {
		app.input.handleKeypress(event);
	});
	*/
}

bg.ecard.InputManager.prototype.uiEventDown = function(event) {
  app.log(this, 'uiEventDown()');
   
  /*
  if ( (event.target.nodeName != 'BUTTON') && !app.params.isLite ) { // allow for css:active style to work
    if (app.params.inputMode !== 'web') {
      event.preventDefault();
    }
  }
  */
  
  
//  app.input.alertInputInProgress('uiEventDown: ' + event.which + ' - ' + event.target.tagName + ' - ' + JSON.stringify(event.target.dataset) );
  
//  if (event.which === 1) { // left click
    
    if (event.target.dataset.dragaction) {
      app.input.dragAction = {
        action: event.target.dataset.dragaction,
        sectionId: app.sections.active.params.id,
        endAction: event.target.dataset.dragactionend,
        target: event.target.dataset.target,
        start: {
          x: event.clientX,
          y: event.clientY,
          time: new Date(),
        }
      };
    }
    
    app.input.clickTarget = event.target;
    if ( app.input.scrollTarget ) {
      app.input.startScroll(event);
    }
//  }	
  
  
  
}

bg.ecard.InputManager.prototype.uiEventUp = function(event) {
  app.log(this, 'uiEventUp()');
//  app.input.alertInputInProgress('uiEventUp: ' + event.which + ' - ' + event.target.tagName + ' - ' + JSON.stringify(event.target.dataset));
//  console.log('uiEventUp: ' + event.which, event.target);

  
  event.preventDefault();
  
  
  var event = event;
//  if (event.which === 1) {
    if ( app.input.checkScroll(event) ) {
      if (app.input.clickTarget == event.target) {
        setTimeout( function(){
          app.input.handleClick(event)
        }, 30);
      }				
    }
    app.input.stopScroll();
    if (app.input.dragAction) {
      app.input.stopDrag();
    }
    
    
//  }
  
  event.preventDefault();
  
}

bg.ecard.InputManager.prototype.uiEventMove = function(event) {
  
  event.preventDefault();
  
  if (app.input.activeDrag && app.input.scrollTarget && app.input.scrollIsActive) {		
    app.input.doScroll(event);
  }
  if (app.input.dragAction) {
    app.input.dragAction.current = {
      x: event.clientX,
      y: event.clientY,
      time: new Date(),
    }
    if ((app.input.dragAction.target == 'section') && (app.input.dragAction.sectionId === app.sections.active.params.id)) {
      app.sections.active[app.input.dragAction.action](app.input.dragAction);
    }
  }
}

bg.ecard.InputManager.prototype.stopDrag = function() {
  app.log(this, 'stopDrag()');
  
    if ((app.input.dragAction.target == 'section') && (app.input.dragAction.sectionId === app.sections.active.params.id)) {
      app.sections.active[app.input.dragAction.endAction](app.input.dragAction);
    }
  
  delete app.input.dragAction;
}

bg.ecard.InputManager.prototype.init = function() {
	app.log( this, 'init()' );

	this.lastActiveInput = 'x';
	this.clickMarker = new bg.ecard.DomTarget('#markX');
	
	this.attachBrowserEvents();
	this.scrollTarget = document.getElementById('scrollTarget');
	
	this.params.windowDim = {
		w: window.innerWidth,
		h: window.innerHeight
	}
	
	this.initKeyboards();

}

bg.ecard.InputManager.prototype.initKeyboards = function() {
	app.log( this, 'initKeyboards()' );
	
  if (app.params.inputMode === 'web') {
    
    this.keyboard = new bg.ecard.VirtualKeyboard({parent: this});
    
    return;
  }
  
	for (var i=0; i<this.params.kbdTypes.length; i++) {
		var kbType = this.params.kbdTypes[i];
		var kbDomTarget = new bg.ecard.DomTarget( '.kbd.'+kbType );
		
		if (kbDomTarget.target) {
			this.keyboards[kbType] = kbDomTarget;
		} else {
			app.die({errorId:'Missing keyboard HTML element!', elementName: 'Keyboard type: ' + kbType});
		}
		
	}
		
}

bg.ecard.InputManager.prototype.setScrollTarget = function(scrollTarget) {
	app.log( this, 'setScrollTarget()' );
  
  if (this.scrollTarget) {
    if (this.scrollTarget.target == scrollTarget.target) {
      return;
    }
  }
		
	this.scrollTarget = scrollTarget;
  
	this.scrollTarget.target.onmousedown = function() { app.input.activeteScroll() };
	this.scrollTarget.target.onmouseup = function() { app.input.deactiveteScroll() };
	
}

bg.ecard.InputManager.prototype.clearScrollTarget = function(scrollTarget) {
	app.log( this, 'clearScrollTarget()' );
	
	if (this.scrollTarget.target) {
		this.scrollTarget.target.onmousedown = null;
		delete this.scrollTarget.target.onmousedown;
	
		this.scrollTarget.target.onmouseup = null;
		delete this.scrollTarget.target.onmouseup;
	}
	this.scrollTarget = false;
	
}

bg.ecard.InputManager.prototype.activeteScroll = function() {
	app.log( this, 'activeteScroll()' );
	
	app.input.scrollIsActive = true;
}

bg.ecard.InputManager.prototype.deactiveteScroll = function() {
	app.log( this, 'deactiveteScroll()' );
	
	app.input.scrollIsActive = false;
}

bg.ecard.InputManager.prototype.startScroll = function(event) {
	app.log( this, 'startScroll()' );
	
	app.input.activeDrag = {x:event.clientX, y:event.clientY, s:app.input.scrollTarget.target.scrollTop};
	
}

bg.ecard.InputManager.prototype.doScroll = function(event) {
	
	if (
		( this.activeDrag.y - event.clientY > _App.config.input.dragZone * 2 ) ||
		( this.activeDrag.y - event.clientY < _App.config.input.dragZone * -2 )
	) {
			this.scrollTarget.target.scrollTop = this.activeDrag.s + this.activeDrag.y - event.clientY;
	}
		
}

bg.ecard.InputManager.prototype.stopScroll = function() {
	app.log( this, 'stopScroll' );
		
	this.activeDrag = false;
	app.events.trigger('input.activity');
}

bg.ecard.InputManager.prototype.checkScroll = function(event) {
//	app.log( this, 'checkScroll' );
	
	if (!app.input.scrollTarget) return true;
	
	if (
		( app.input.activeDrag.x > event.clientX - _App.config.input.dragZone ) &&
		( app.input.activeDrag.x < event.clientX + _App.config.input.dragZone ) &&
		( app.input.activeDrag.y > event.clientY - _App.config.input.dragZone ) &&
		( app.input.activeDrag.y < event.clientY + _App.config.input.dragZone ) 
	) {
		return true;			
	} else {
		return false;
	}

}

bg.ecard.InputManager.prototype.scrollToEnd = function() {
	app.log( this, 'scrollToEnd()' );
	
	if (this.scrollTarget) {
		this.scrollTarget.target.scrollTop = 99999;	
	}
}

bg.ecard.InputManager.prototype.scrollToStart = function() {
	app.log( this, 'scrollToStart()' );
	
	if (this.scrollTarget) {
		this.scrollTarget.target.scrollTop = 0;	
	}
}

bg.ecard.InputManager.prototype.handleClick = function(event) {
	app.log( app.input, 'handleClick()', event.target.tagName  )
  
  if (app.params.inputMode === 'web') {

//      console.log( 'handleClick()', event.target.tagName, event.target, app.params.inputMode );
//      console.log('handleClick()', event.target.dataset, event.target.dataset.type);

    if (event.target.dataset && event.target.dataset.type == 'btn') {
      app.input.handleButton(event.target);

    } else if (event.target.dataset && event.target.dataset.type == 'kb') {
      app.input.keyboard.button(event.target);

    } else if (event.target.tagName === 'INPUT') {
      
      if (event.target.dataset && (event.target.dataset.selectable == 'true') ) {
        app.input.keyboard.show(event.target);
      } else {
        event.target.blur();
      }

    }

    if (event.target.tagName !== 'A') {
      event.preventDefault();
    }

  } else {

    switch (event.target.tagName) {
      case 'INPUT': {
        if (event.target.dataset.selectable == 'true') {
          app.input.handleInput(event.target);
        }
        break;
      }
      case 'SELECT': {
        //app.input.handleButton(event.target);
        event.target.focus();
        break;
      }  
      case 'BUTTON': {
        app.input.handleButton(event.target);
        break;
      }
      case 'DIV': {
        if(event.target.className == 'keyboard kb_type_login'){
          return false;
        }
        if (app.active.keyboard) {
          if (event.target === app.active.keyboard.target) {
            return false;
          }
        }
        app.input.clearSelection();
        break;
      }
      case 'LABEL': {
        var activeBtn = new bg.ecard.DomTarget(event.target).find('button[data-active="true"]');
        if (activeBtn) {
          app.input.handleButton(activeBtn);
          break;
        }        
      }
      default: {
        app.input.clearSelection();
        break;
      }
    }
  }
		
}

bg.ecard.InputManager.prototype.handleButton = function(domEl) {
	app.log(this, 'handleButton()', domEl.dataset.type, domEl.dataset.target, domEl.dataset.action, domEl.innerHTML);
	//console.log(' -- handleButton()', domEl.dataset.type, domEl.dataset.target, domEl.dataset.action, domEl.innerHTML);
	//console.log(' -- handleButton()', typeof domEl.dataset.type);
	
	if (domEl.dataset.type === 'kb') { // virtual keyboard button
	
		if (app.active.input) {
			app.active.input.button(domEl);
		}
	
	} else if (domEl.dataset.type == 'btn') { // action button
    
		if (domEl.dataset.target == 'section') { // send to active section
			/*
			if (app.active.section) {
				app.active.section.button(domEl);
			}
      */
      if (app.sections.active) {
        app.sections.active.button(domEl);
      }
			
		} else if (domEl.dataset.target == 'global') { // send to app
			
//			app.button(domEl);
      app.events.trigger('button:'+domEl.dataset.action, domEl);
			
		} else if (domEl.dataset.target == 'element') { // send to element
			
			var targetEl = app.getElement( domEl.dataset.eltype.toString(), domEl.dataset.elid );
			if (targetEl) {
				targetEl.events.trigger(domEl.dataset.action, domEl);
			}
			
		}
	} else if (domEl.dataset.type === 'option') {
    this.handleSelect(domEl);
  }
	
}

bg.ecard.InputManager.prototype.handleSelect = function(domEl) {
  app.log(this, 'handleSelect()', domEl.dataset.target, domEl.dataset.value); 
  
  if (new bg.ecard.DomTarget('.name_'+domEl.dataset.target).target.dataset.selectable != 'true') {
    return;
  }
  
  if (domEl.dataset.active === 'true') {
    this.showSelect(domEl);
  } else {
    this.setSelectValue(domEl);
  }
  
}

bg.ecard.InputManager.prototype.showSelect = function(domEl) {
  app.log(this, 'showSelect()', domEl.dataset.target);
//  console.log(' -- ', 'showSelect()', domEl.dataset.target);
  
  if (app.active.input || app.active.select) {
    this.clearSelection();
  }
  
  var selectDom = new bg.ecard.DomTarget('.dropDown.name_'+domEl.dataset.target);

  //console.log(new bg.ecard.DomTarget(selectDom.find('[data-active="true"]')));
  
  //console.log('sctive: ', selectActiveDom.target);
  
  app.active.select = selectDom;
  
  var selectDim = this.getDomElDimentions(domEl);

  selectDom.target.style.width = selectDim.w+'px';
  selectDom.target.style.left = selectDim.x+'px';
  selectDom.setState('open');
  
  this.setScrollTarget(selectDom);
  this.scrollToStart();
  
}

bg.ecard.InputManager.prototype.hideSelect = function() {
  app.log(this, 'hideSelect()');
//  console.log(' -- ', 'hideSelect()', app.active.select.target);
  
  var selectDom = app.active.select;
  
  //selectDom.target.style.width = 'auto';
  selectDom.target.style.left = 'auto';
  
  app.active.select.removeState('open');
  
}

bg.ecard.InputManager.prototype.setSelectValue = function(domEl, doNotTriggerAction) {
  app.log(this, 'setSelectValue()', domEl.dataset.target, domEl.dataset.value);
  
  var selectDomObj = new bg.ecard.DomTarget('.dropDown.name_'+domEl.dataset.target)
  
  new bg.ecard.DomTarget( selectDomObj.find('[data-active="true"]')).removeData('active');
  new bg.ecard.DomTarget(domEl).setData({active:'true'});
  new bg.ecard.DomTarget('input[name="'+domEl.dataset.target+'"]').setValue(domEl.dataset.value);
  
  if (domEl.dataset.value != '') {
    app.events.trigger('select.change',{target: domEl.dataset.target, value: domEl.dataset.value});
    //app.events.trigger('select.change',{target: domEl.dataset.target, value: domEl.dataset.value});

    this.clearSelection();

    if ( selectDomObj.target.dataset.action && selectDomObj.target.dataset.target && !doNotTriggerAction ) {

      if (selectDomObj.target.dataset.target === 'section') {

          app.active.section.events.trigger( selectDomObj.target.dataset.action, selectDomObj.target );
      }	
    }
  }
  
}

bg.ecard.InputManager.prototype.handleInput = function(domEl) {
	app.log(this, 'handleInput()', domEl.type);
	
	if ( app.input.lastActiveInput != domEl ) {
		if (app.active.input || app.active.select) {
			this.clearSelection();
		}
	}
	
	app.active.input = new bg.ecard.DomTarget(domEl);
	app.active.input.addClass('state-active');
	
	if ( app.input.lastActiveInput != domEl ) {
		
		app.input.lastActiveInput = domEl;
		
		var kbdTypeToShow = app.active.input.target.dataset['inputType'];
		
		if (kbdTypeToShow) {
			this.showKeyboard(kbdTypeToShow, domEl);		
		}
				
	}
	
	app.active.input.focus();
  app.active.input.target.setSelectionRange(app.active.input.target.value.length,app.active.input.target.value.length);
	
	
}

bg.ecard.InputManager.prototype.handleKeypress = function(event) {
	app.log( this, 'handleKeypress()', event.keyCode, event.charCode, String.fromCharCode(event.charCode) );
	
	//this.alertInputInProgress( String.fromCharCode(event.charCode) + '(' + event.keyCode +'-'+ event.charCode +')' );
	
	var processInput = true;
	
	if ( app.active.input ) {	// input is focused

		processInput = false;
		
		if ( app.active.input.target.dataset['virtkbonly'] === 'true' ) { // focused input accepts only virtual keyboard input
			event.preventDefault();
		}
		
		if ( app.active.input.target.dataset['captureinput'] === 'true' ) { // focused input captures all input (skip barcode reader actions)
		}
		
		if ( event.keyCode === 13 ) { // dirty patch to send OK button on ENTER pressed to input
			app.active.input.button({innerHTML: 'OK'});
		}
		
	}
	
	if ( (event.charCode == 0) && (event.keyCode != 13)) {
//		event.preventDefault();		
	}
		
	if (!processInput) {
		return;
	}
	
	app.events.trigger('input.activity');
	
	if (this.clearWait) {
		clearTimeout(this.clearWait);
	}
	
	this.clearWait = setTimeout(function() {
		
		if (app.input.inputInProgress) {
			if (app.input.inputInProgress.length >= 5) {
				app.input.processBarcodeInput( app.input.inputInProgress );
			}
			delete app.input.inputInProgress;
			clearTimeout(app.input.clearWait);
		}
		
	},500)
	
	if (!this.inputInProgress) {
		if (event.keyCode != 13) {
			if (event.charCode) {
				this.inputInProgress = String.fromCharCode(event.charCode);
			}
		}
	} else {
		if (event.keyCode === 13 ) { // ENTER is pressed / barcode scan complete
			
			this.processBarcodeInput( this.inputInProgress );
			delete this.inputInProgress;
			clearTimeout(this.clearWait);
			
		} else {	
			if (event.charCode) {
				this.inputInProgress += String.fromCharCode(event.charCode);
			}
		}
	}
	
}
/*
bg.ecard.InputManager.prototype.processBarcodeInput = function( inputInProgress ) {
	app.log( this, 'processBarcodeInput()', inputInProgress );
		
	//inputInProgress = inputInProgress.replace(/\W/g, '');
	//this.alertInputInProgress(inputInProgress);

	if ( inputInProgress.toUpperCase().charAt(0) === 'N' || inputInProgress.toUpperCase().charAt(0) === 'S' ) { // receipt
		
		app.events.trigger('barcode:newReceipt', inputInProgress.toUpperCase());
		
	} else if ( inputInProgress.toUpperCase().charAt(0) === 'X'  ) { // express talon
		
		app.events.trigger('scanner:newTalon', '7#'+inputInProgress.toUpperCase());
		
	} else if ( (inputInProgress.length === 10) && (inputInProgress.charAt(0) == '9') ) { // express talon
		
		app.events.trigger('scanner:newTalon', '7#'+inputInProgress.toUpperCase());
    
  } else if ( inputInProgress.charAt(0) === '0'  ) { // customer card
    
		//app.events.trigger('barcode:newCustomerCard', inputInProgress.toUpperCase());
    this.checkBarcodeType(inputInProgress);
		
	} else if ( parseInt(inputInProgress.charAt(0)) == inputInProgress.charAt(0) ) { // barcode starts w. number
    
    this.checkBarcodeType(inputInProgress);
    
    return;
//    
//		if (inputInProgress.length === 14 ) {
//			if ( parseInt(inputInProgress.toString().slice(0,2)) >= 80 ) {
//				app.events.trigger('barcode:newReceipt', inputInProgress.toUpperCase());
//			} else {
//				app.events.trigger('barcode:newTicket', inputInProgress.toUpperCase());	
//			}
//		} else if (inputInProgress.length >= 8) {
//			app.events.trigger('barcode:newTicket', inputInProgress.toUpperCase());
//		}
//    
    
		
	} else if ( inputInProgress.toLowerCase().indexOf('cl_') === 0 ) { // barcode scan login
		
		app.events.trigger('barcodeLogin', inputInProgress);
		
	}
	
}
*/		
bg.ecard.InputManager.prototype.clearKeypressInput = function() {
	app.log( this, 'clearKeypressInput()' );
	
	delete app.receipts.inputInProgress;
	
}

bg.ecard.InputManager.prototype.clearSelection = function() {
	app.log( this, 'clearSelection()');
	
	if (app.active.input) {
		app.active.input.blur();
		app.active.input.removeClass('state-active');
		delete app.active.input;
		delete app.input.lastActiveInput;
	}
	
	this.hideKeyboard();
  
  if (app.active.select) {
    this.hideSelect();
    this.clearScrollTarget();
    delete app.active.select;
  }
	
}

bg.ecard.InputManager.prototype.hideKeyboard = function() {
	app.log( this, 'hideKeyboard()' );
	
	if (app.active.keyboard) {
		app.active.keyboard.hide();
	}
	
}

bg.ecard.InputManager.prototype.updateMarker = function(event) {
	app.log( this, 'updateMarker()', event.clientX, event.clientY);
  
  if (!this.clickMarker.target) {
    return;
  }
	
	this.clickMarker.style.left = (event.clientX) + 'px';
	this.clickMarker.style.top = (event.clientY) + 'px';
	this.clickMarker.addClass('clicked');
	
	setTimeout( this.clearMarker, 500 );
	
}

bg.ecard.InputManager.prototype.clearMarker = function() {
	app.log( app.input, 'clearMarker()');
	
	app.input.clickMarker.removeClass('clicked');
	
}

bg.ecard.InputManager.prototype.clearInput = function() {
	app.log( this, 'clearInput()' );
	
	if (app.active.input) {
		app.active.input.setValue('');
	}
	this.clearSelection(); 
	
}

bg.ecard.InputManager.prototype.showKeyboard = function(kbdTypeToShow, domEl) {
	app.log( this, 'showKeyboard()', kbdTypeToShow);
	
	if (!this.keyboards[kbdTypeToShow]) {
		app.die({errorId:'Trying to show non-existent keyboard!', elementName: 'Keyboard type: ' + kbdTypeToShow});
		return;
	}
	
	domElDim = this.getDomElDimentions(domEl);
	
	if (app.active.keyboard) {
		app.active.keyboard.hide();
		app.active.keyboard.removeState('active');
	}
	
	app.active.keyboard = this.keyboards[kbdTypeToShow];

	app.active.keyboard.setState('active');
	app.active.keyboard.show();
	
  if (kbdTypeToShow != 'full') {
	 this.positionKeyboard(domElDim);	
  }
}

bg.ecard.InputManager.prototype.positionKeyboard = function(domElDim) {
	app.log( this, 'positionKeyboard()');
	
	if (app.active.keyboard.target.dataset && app.active.keyboard.target.dataset['position'] ) {
		if ( app.active.keyboard.target.dataset['position'] === 'static' ) {
			return;
		}
	}
	
	var scrollOffset = 0;
	
	if (this.scrollTarget && this.scrollTarget.target) {
		scrollOffset = this.scrollTarget.target.scrollTop;
	}
	
	var kbd = {
		h: app.active.keyboard.target.offsetHeight,
		w: app.active.keyboard.target.offsetWidth,
		x: domElDim.x + domElDim.w + this.params.kbdDisplayOffset,
		y: domElDim.y - scrollOffset
	}
	
	if (kbd.h + kbd.y > this.params.windowDim.h) {
		kbd.y -= kbd.h - domElDim.h; 
	}
	if (kbd.w + kbd.x > this.params.windowDim.w) {
		kbd.x -= domElDim.w + kbd.w + this.params.kbdDisplayOffset;
	}
	
	app.active.keyboard.css('left', kbd.x);
	app.active.keyboard.css('top', kbd.y);
	
}

bg.ecard.InputManager.prototype.getDomElDimentions = function(ele) {
	app.log( this, 'getDOMelDimentions');
	
	var w = ele.offsetWidth;
	var h = ele.offsetHeight;
	var x = 0;
	var y = 0;
	while ( true ) {
		x += ele.offsetLeft;
		y += ele.offsetTop;
		if ( ele.offsetParent === null ) {
			break;
		}
		ele = ele.offsetParent;
	}
	return {x: x, y: y, w: w, h: h};
}

bg.ecard.InputManager.prototype.alertInputInProgress = function( inputInProgress ) {
	app.log( this, 'alertInputInProgress()');
	
	if (!this.msgDiv) {
		this.msgDiv = document.createElement('div');
		this.msgDiv.style.textAlign = 'right';
		this.msgDiv.style.width = '9999em';
		this.msgDiv.style.pointerEvents = 'none';
		this.msgDiv.style.height = '1.4em';
		this.msgDiv.style.overflow = 'hidden';
		this.msgDiv.style.position = 'fixed';
		this.msgDiv.style.bottom = '2px';
		this.msgDiv.style.right = '5px';
		this.msgDiv.style.zIndex = '99999999';
	}
	
	document.querySelector('body').appendChild(this.msgDiv);
	
	this.msgDiv.innerHTML = inputInProgress;
	
}

bg.ecard.utils.registerJS('bg.ecard.InputManager.js');