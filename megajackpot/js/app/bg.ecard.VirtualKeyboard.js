'use strict';
bg.ecard.VirtualKeyboard = function(params) {
  this.params = params;
  this.params.type = 'bg.ecard.VirtualKeyboard';
  
  app.log(this, 'new bg.ecard.VirtualKeyboard');
  
  this.holder = {
    main: new bg.ecard.DomTarget('.app-keyboard'),
    display: new bg.ecard.DomTarget('.app-keyboard-display'),
  }
  
}

bg.ecard.VirtualKeyboard.prototype.show = function(inputTarget) {
  app.log(this, 'show()');
  
//  this.clearDisplay();
  
  this.holder.inputTarget = new bg.ecard.DomTarget(inputTarget);
  
  this.inputStr = new String(this.holder.inputTarget.getValue());
  
  app.interface.setState('kbd-active');
  
  this.holder.display.setAttribute('placeholder', this.holder.inputTarget.getAttribute('placeholder'));
  this.holder.display.setValue(this.inputStr);
  
  console.warn(this.holder.inputTarget.getAttribute('type'));
  this.holder.main.setState('kb-type-' + this.holder.inputTarget.getAttribute('type'));

  
  
  if (app.sections.active) {
    app.sections.active.events.trigger('keyboard:show');
  }
  
}

bg.ecard.VirtualKeyboard.prototype.hide = function() {
  app.log(this, 'hide()');
  
  this.holder.inputTarget.setValue(this.inputStr);
  
  app.interface.removeState('kbd-active');
  this.holder.main.removeStates('kb-type-');
  
}


bg.ecard.VirtualKeyboard.prototype.clearDisplay = function() {
  app.log(this, 'clearDisplay()');
  
  this.setDisplay('');
}

bg.ecard.VirtualKeyboard.prototype.setDisplay = function(valueToDisplay) {
  app.log(this, 'setDisplay', valueToDisplay);
  
  this.holder.display.setValue(valueToDisplay);
}

bg.ecard.VirtualKeyboard.prototype.button = function(domEl) {
  app.log(this, 'button()');
  
  var btnObj = new bg.ecard.DomTarget(domEl);
  var btnAction = btnObj.getData('kb-action');
  
  if (!btnAction) {
    this.inputStr += btnObj.getValue();  
  } else {
    
    if (btnAction === 'delete') {
      var currValue = this.inputStr;
      var currPos = this.inputStr.length;
      this.inputStr = currValue.slice(0, currPos - 1) + currValue.slice(currPos, currValue.length);
    } else if (btnAction === 'close') {
      this.hide();
    }
    
  }
  
  this.setDisplay(this.inputStr);
  
//  console.info(domEl, new bg.ecard.DomTarget(domEl).getValue());
}

bg.ecard.utils.registerJS('bg.ecard.VirtualKeyboard.js');