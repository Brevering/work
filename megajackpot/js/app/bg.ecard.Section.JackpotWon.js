'use strict';
bg.ecard.Section.JackpotWon = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.JackpotWon';
  this.parent = parent;
  
  app.log( this, 'new bg.ecard.Section.JackpotWon');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
 
  this.events.bind('display:afterShow', this, 'startVideo');
  this.events.bind('button:close', this, 'videoEnd');
  
  this.holder.video = new bg.ecard.DomTarget( this.holder.main.find('video') );
  
}

bg.ecard.Section.JackpotWon.prototype.startVideo = function() {
  app.log(this, 'startVideo()');
  
  this.holder.video.target.jsTarget = this;
  this.holder.video.target.onended = function() {
    this.jsTarget.videoEnd();
  }
  this.holder.video.target.volume = app.config.defSoundVolume;
  if (app.sound.soundsMuted) {
    this.holder.video.target.volume = 0;
  }
  this.holder.video.target.play();
}

bg.ecard.Section.JackpotWon.prototype.videoEnd = function() {
  app.log(this, 'videoEnd()');
  
  app.game.endGame();
  
  this.holder.video.target.pause();
  this.holder.video.target.currentTime = 0;
   
}

bg.ecard.utils.registerJS('bg.ecard.Section.JackpotWon.js');