'use strict';
bg.ecard.SoundManagerHowler = function(parent) {
  
  this.params = {
    type: 'bg.ecard.SoundManagerHowler',
    id: 'sound',
  }
  this.parent = parent;
  app.log(this, 'new bg.ecard.SoundManagerHowler');
  
  this.isHowlerAudio = true;
  
  this.active = new Object();
  this.sounds = new Object();
  
  this.events = new bg.ecard.EventDispatcher(this);
  
//  app.events.trigger('soundManagerReady');
  
  this.params.audioCodec = 'mp3';
 
//  this.myAudioContext = new (window.AudioContext || window.webkitAudioContext)();
//  this.myNodes = {};
  
  app.events.trigger('SoundManagerReady');
}

bg.ecard.SoundManagerHowler.prototype.register = function(soundAsset, event) {
  app.log(this, 'register()', soundAsset.params.id);
  
  
  this.sounds[soundAsset.params.id] = soundAsset;
  
  /*
  var request = event.target;
  var buffer = this.myAudioContext.createBuffer(request.response, false);
  this.sounds[soundAsset.params.id] = soundAsset;
  this.sounds[soundAsset.params.id].buffer = buffer;
*/
}

bg.ecard.SoundManagerHowler.prototype.play = function(soundId, caller, isLoop) {
  app.log(this, 'play()', soundId);
  
  if (!this.sounds['sound-'+soundId]) {
    return;
  }
  

  this.sounds['sound-'+soundId].sound.stop();
  this.sounds['sound-'+soundId].sound.play();
  
}

bg.ecard.SoundManagerHowler.prototype.stop = function(soundId, caller) {
  app.log(this, 'stop()', soundId);
  
  if (!this.sounds['sound-'+soundId]) {
    return;
  }
  
  this.sounds['sound-'+soundId].sound.stop();
  
  
}

bg.ecard.SoundManagerHowler.prototype.soundEnd = function(soundId) {
  app.log(this, 'soundEnd()', soundId.replace('sound-',''));
  
}

bg.ecard.SoundManagerHowler.prototype.loop = function(soundId, caller) {
  app.log(this, 'loop()', soundId);
  
  if (!this.sounds['sound-'+soundId]) {
    return;
  }
  
  this.sounds['sound-'+soundId].sound._loop = true;
  this.sounds['sound-'+soundId].sound.play();
  
  /*
  this.play(soundId, null, true);
  */
}

bg.ecard.SoundManagerHowler.prototype.stopAll = function() {
  app.log(this, 'stopAll()');
  
  for (var i in this.sounds) {
    this.sounds[i].sound.stop();
//    delete this.active[i];
  };
}

bg.ecard.SoundManagerHowler.prototype.muteSoundToggle = function() {
  app.log(this, 'muteSoundToggle()');
  
  if (this.soundsMuted) {
    this.unmute();
  } else {
    this.mute();
  }
  
}

bg.ecard.SoundManagerHowler.prototype.mute = function(soundId) {
  app.log(this, 'play()', soundId);

  for (var i in this.sounds) {
    this.sounds[i].sound._volume = 0;
  };

  this.soundsMuted = true;
  app.interface.setState('sound-muted');

}

bg.ecard.SoundManagerHowler.prototype.unmute = function(soundId) {
  app.log(this, 'play()', soundId);
  
  for (var i in this.sounds) {
    this.sounds[i].sound._volume = app.config.defSoundVolume || 1;
  };
  
  this.soundsMuted = false;
  app.interface.removeState('sound-muted');

}

bg.ecard.SoundManagerHowler.prototype.testMusic = function() {
  app.log(this, 'testMusic()');
  
  if (!this.params.audioCodec) {
    return;
  }
  
  if (this.active['sound-testMusic']) {
    app.sound.stop('testMusic');
  } else {
    app.sound.play('testMusic');
  }
  
}

bg.ecard.utils.registerJS('bg.ecard.SoundManagerHowler.js');