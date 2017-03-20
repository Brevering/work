'use strict';
bg.ecard.SoundManager = function(parent) {
  
  this.params = {
    type: 'bg.ecard.SoundManager',
    id: 'sound',
  }
  this.parent = parent;
  app.log(this, 'new bg.ecard.SoundManager');
  
  this.active = new Object();
  this.sounds = new Object();
  
  this.events = new bg.ecard.EventDispatcher(this);
  
  app.events.trigger('soundManagerReady');
  
  this.params.audioCodec = 'mp3';
 
  app.events.trigger('SoundManagerReady');
}

bg.ecard.SoundManager.prototype.register = function(soundAsset) {
  app.log(this, 'register()', soundAsset.params.id);
  
  this.sounds[soundAsset.params.id] = soundAsset;
  soundAsset.domObj.addEventListener('ended', function _soundEnded(){
    app.sound.soundEnd(this.id);
  });
  soundAsset.domObj.volume = app.config.defSoundVolume;
  
}

bg.ecard.SoundManager.prototype.play = function(soundId, caller) {
  app.log(this, 'play()', soundId);
  
  if (!this.params.audioCodec) {
    return;
  }
  var soundAsset = this.sounds['sound-' + soundId];
  if (!soundAsset) {
    return;
  }
  
  if (!soundAsset.domObj.paused) {
    soundAsset.domObj.currentTime = 0;
  } else {
    soundAsset.domObj.play();
  }

}

bg.ecard.SoundManager.prototype.stop = function(soundId, caller) {
  app.log(this, 'stop()', soundId);
  
  if (!this.params.audioCodec) {
    return;
  }
  var soundAsset = this.sounds['sound-' + soundId];
  if (!soundAsset) {
    return;
  }
  
  soundAsset.domObj.pause();
  soundAsset.domObj.currentTime = 0;
  soundAsset.domObj.loop = false;
  delete soundAsset.domObj.loop;
  
}

bg.ecard.SoundManager.prototype.soundEnd = function(soundId) {
  app.log(this, 'soundEnd()', soundId.replace('sound-',''));
  
  var soundAsset = this.sounds[soundId];
  if (!soundAsset) {
    return;
  }
  
  soundAsset.domObj.pause();
  soundAsset.domObj.currentTime = 0;
  
}


bg.ecard.SoundManager.prototype.loop = function(soundId, caller) {
  app.log(this, 'loop()', soundId);
  
  if (!this.params.audioCodec) {
    return;
  }
  var soundAsset = this.sounds['sound-' + soundId];
  if (!soundAsset) {
    return;
  }
  
  soundAsset.domObj.loop = true;
  this.play(soundId);
  
}

bg.ecard.SoundManager.prototype.stopAll = function() {
  app.log(this, 'stopAll()');
    
  for (var i in this.sounds) {
    this.stop(i.replace('sound-',''));
  };
}

bg.ecard.SoundManager.prototype.muteSoundToggle = function() {
  app.log(this, 'muteSoundToggle()');
  
  if (this.soundsMuted) {
    this.unmute();
  } else {
    this.mute();
  }
  
}

bg.ecard.SoundManager.prototype.mute = function(soundId) {
  app.log(this, 'play()', soundId);
  
  for (var i in this.sounds) {
    this.sounds[i].sound._volume = 0;
  };

  this.soundsMuted = true;
  app.interface.setState('sound-muted');

}

bg.ecard.SoundManager.prototype.unmute = function(soundId) {
  app.log(this, 'play()', soundId);
  
  for (var i in this.sounds) {
    this.sounds[i].domObj.volume = app.config.defSoundVolume;
  };
  
  this.soundsMuted = false;
  app.interface.removeState('sound-muted');

}

bg.ecard.SoundManager.prototype.testMusic = function() {
  app.log(this, 'testMusic()');
  
  if (!this.params.audioCodec) {
    return;
  }
  
  app.sound.play('testMusic');
  
}

bg.ecard.utils.registerJS('bg.ecard.SoundManager.js');