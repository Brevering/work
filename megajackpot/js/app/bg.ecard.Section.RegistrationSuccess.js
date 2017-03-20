'use strict';
bg.ecard.Section.RegistrationSuccess = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.RegistrationSuccess';
//  this.params.id = 'Intro';
  this.parent = parent;
  
  app.log( this, 'new bg.ecard.Section.RegistrationSuccess');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
 
  this.events.bind('button:closePopup', this, 'closePopup');
  this.events.bind('display:afterShow', this, 'startTimer');
  
  this.timer.UItimeout = new app.time.Timer({
    id: this.params.id+'-UItimeout',
    caller: app.game,
    duration: 60,
    action: 'restart',
    displayHolder: [new bg.ecard.DomTarget('#defTimerDisplay')],
  });
}

bg.ecard.Section.RegistrationSuccess.prototype.startTimer = function() {
  app.log(this, 'startTimer()');
  

  this.timer.UItimeout.start();
} 
bg.ecard.Section.RegistrationSuccess.prototype.stopTimer = function() {
  app.log(this, 'stopTimer()');
  

  this.timer.UItimeout.stop();
} 

bg.ecard.Section.RegistrationSuccess.prototype.closePopup = function() {
  app.log(this, 'closePopup()');
  
  this.stopTimer();
  app.game.regDone();
}

bg.ecard.utils.registerJS('bg.ecard.Section.RegistrationSuccess.js');