'use strict';
bg.ecard.Section.TalonHistory = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.TalonHistory';
  this.parent = parent;
  
  app.log( this, 'new bg.ecard.Section.TalonHistory');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
  this.holder.iframe = new bg.ecard.DomTarget( this.holder.main.find('iframe') );
  
  this.events.bind('button:closePopup', this, 'closePopup');
  this.events.bind('display:afterHide', this, 'clearIframe');
  
}

bg.ecard.Section.TalonHistory.prototype.displayHistory = function(data) {
  app.log(this, 'displayHistory()');
  
  this.holder.iframe.target.src = data;
}

bg.ecard.Section.TalonHistory.prototype.closePopup = function() {
  app.log(this, 'closePopup()');
  
  app.restartGame();
}

bg.ecard.Section.TalonHistory.prototype.clearIframe = function() {
  app.log(this, 'clearIframe()');
  
  this.holder.iframe.target.src = 'data:text/html;charset=utf-8,' + encodeURI('');
}

bg.ecard.utils.registerJS('bg.ecard.Section.TalonHistory.js');