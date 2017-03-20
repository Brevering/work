'use strict';
bg.ecard.Section.GameStart = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.GameStart';
  this.parent = parent;
  
  this.req = new Object();
  
  app.log( this, 'new bg.ecard.Section.GameStart');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
  this.events.bind('button:startGame', this, 'submitGameStart');
  this.events.bind('display:afterShow', this, 'updateMessage');
  
  
}

bg.ecard.Section.GameStart.prototype.startTimer = function() {
  app.log(this, 'startTimer()');
  
  this.timer.UItimeout.start();
}

bg.ecard.Section.GameStart.prototype.submitGameStart = function() {
  app.log(this, 'submitGameStart()');
  
    app.sound.play('wheelClick');
  
  if (app.game.params.session_id) {
    app.game.goToWheel();
    return;
  }
  
  app.game.submitGameStart();
  
}

bg.ecard.Section.GameStart.prototype.updateMessage = function() {
  app.log(this, 'updateMessage()');
  
  if (app.interface.labels.vipPointsMessage) {
    app.interface.labels.vipPointsMessage.revert();
  }
  
  if (app.game.params && app.game.params.custom_vip_points_message) {
    app.interface.updateLabels({
      vipPointsMessage: app.game.params.custom_vip_points_message
    });
  }
  
}

/*
bg.ecard.Section.GameStart.prototype.processGameStart = function(data) {
  app.log(this, 'processGameStart()');
  
  app.game.params = data;
  app.game.goToWheel();
  
}
*/

bg.ecard.utils.registerJS('bg.ecard.Section.GameStart.js');