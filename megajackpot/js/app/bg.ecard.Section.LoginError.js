'use strict';
bg.ecard.Section.LoginError = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.LoginError';
//  this.params.id = 'Intro';
  this.parent = parent;
  
  app.log( this, 'new bg.ecard.Section.LoginError');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
  
  
  this.events.bind('display:afterShow', this, 'startTimer');
  this.events.bind('display:beforeHide', this, 'stopTimer');
  this.timer.UItimeout = new app.time.Timer({
    id: this.params.id+'-UItimeout',
    caller: app,
    duration: 30,
    action: 'restartGame',
    displayHolder: [new bg.ecard.DomTarget('#defTimerDisplay')],
  });
}

bg.ecard.Section.LoginError.prototype.startTimer = function() {
  app.log(this, 'startTimer()');
  
  this.interface.revertLabels();
  this.timer.UItimeout.start();
} 

bg.ecard.Section.LoginError.prototype.stopTimer = function() {
  app.log(this, 'stopTimer()');
  
  
  this.timer.UItimeout.stop();
} 

bg.ecard.utils.registerJS('bg.ecard.Section.LoginError.js');