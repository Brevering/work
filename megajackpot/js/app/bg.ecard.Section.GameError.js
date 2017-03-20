'use strict';
bg.ecard.Section.GameError = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.GameError';
  this.parent = parent;
  
  app.log( this, 'new bg.ecard.Section.GameError');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
  this.events.bind('button:continueGame', this, 'continueGame');
  this.events.bind('button:endGame', this, 'endGame');
 
  this.events.bind('display:afterShow', this, 'startTimer');
  this.timer.UItimeout = new app.time.Timer({
    id: this.params.id+'-UItimeout',
    caller: this,
    duration: 30,
    action: 'endGame',
    displayHolder: [
      new bg.ecard.DomTarget('#defTimerDisplay'),
      new bg.ecard.DomTarget(this.holder.main.find('.label-timeRemaining')),
    ],
  });
}

bg.ecard.Section.GameError.prototype.startTimer = function() {
  app.log(this, 'startTimer()');
  
  this.timer.UItimeout.start();
  
} 

bg.ecard.Section.GameError.prototype.continueGame = function() {
  app.log(this, 'continueGame()');
  
  this.timer.UItimeout.stop();
  app.game.continueGame();
}

bg.ecard.Section.GameError.prototype.endGame = function() {
  app.log(this, 'endGame()');
  
  this.timer.UItimeout.stop();
  app.game.endGame();
  
}


bg.ecard.utils.registerJS('bg.ecard.Section.GameError.js');