'use strict';
bg.ecard.Section.IntroWeb = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.IntroWeb';
//  this.params.id = 'Intro';
  this.parent = parent;
  
  app.log( this, 'new bg.ecard.Section.IntroWeb');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
  this.events.bind('button:startGame', this, 'startGame');
 
  
  
  this.initUserData();
  
}

bg.ecard.Section.IntroWeb.prototype.initUserData = function() {
  app.log(this, 'initUserData()');
  
  app.interface.updateLabels({
    vipPoints: app.config.userData.ticket_left_points,
    gamesPlayCount: app.config.userData.can_play_games,
  });
  
  if (app.config.userData.can_play_games == 0) {
    app.interface.setState('play-disabled');
  }
  
  app.startGame(app.config.userData);
  
  setTimeout(function(){
    app.sections.loaded.IntroWeb.startGame();  
  }, 10);
  
  
//  app.barcodeManager.processMessage('{"TICKET_ID":"0000000000"}');
  
}

bg.ecard.Section.IntroWeb.prototype.startGame = function() {
  app.log(this, 'startGame()');
  
//  app.sections.load(app.config.sections['GameStart']).hide().submitGameStart();
  app.sections.load(app.config.sections['GameStart']);
  
//  app.game.goToWheel();
}

bg.ecard.utils.registerJS('bg.ecard.Section.IntroWeb.js');