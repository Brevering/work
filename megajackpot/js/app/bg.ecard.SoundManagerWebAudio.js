'use strict';
bg.ecard.SoundManagerWebAudio = function(parent) {
  
  this.params = {
    type: 'bg.ecard.SoundManagerWebAudio',
    id: 'sound',
  }
  this.parent = parent;
  app.log(this, 'new bg.ecard.SoundManagerWebAudio');
  
  this.isWebAudio = true;
  
  this.active = new Object();
  this.sounds = new Object();
  
  this.events = new bg.ecard.EventDispatcher(this);
  
//  app.events.trigger('soundManagerReady');
  
  this.params.audioCodec = 'mp3';
 
  this.myAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  this.myNodes = {};
  
  app.events.trigger('SoundManagerReady');
}

bg.ecard.SoundManagerWebAudio.prototype.register = function(soundAsset, event) {
  app.log(this, 'register()', soundAsset.params.id);
  
  var request = event.target;
  var buffer = this.myAudioContext.createBuffer(request.response, false);
  this.sounds[soundAsset.params.id] = soundAsset;
  this.sounds[soundAsset.params.id].buffer = buffer;

}

bg.ecard.SoundManagerWebAudio.prototype.routeSound = function(source) {
  app.log(this, 'routeSound()');
  this.myNodes.volume = this.myAudioContext.createGainNode();
  source.connect(this.myNodes.volume);
  this.myNodes.volume.connect(this.myAudioContext.destination);

  return source;
}

bg.ecard.SoundManagerWebAudio.prototype.play = function(soundId, caller, isLoop) {
  app.log(this, 'play()', soundId);
  
  if (!this.sounds['sound-'+soundId]) {
    return;
  }
  
  if (this.active['sound-'+soundId]) {
    this.stop(soundId);
  }
  
  var source = this.myAudioContext.createBufferSource();
  source.buffer = this.sounds['sound-'+soundId].buffer;
  if (isLoop) {
    source.loop = true;
  }
  source = this.routeSound(source);
  source.noteOn(0);
  this.active['sound-'+soundId] = source;

}

bg.ecard.SoundManagerWebAudio.prototype.stop = function(soundId, caller) {
  app.log(this, 'stop()', soundId);
  
  if (this.active['sound-'+soundId]) {
    this.active['sound-'+soundId].noteOff(0);
    delete this.active['sound-'+soundId];
  }
  
  
}

bg.ecard.SoundManagerWebAudio.prototype.soundEnd = function(soundId) {
  app.log(this, 'soundEnd()', soundId.replace('sound-',''));
  
  /*
  var soundAsset = this.sounds[soundId];
  if (!soundAsset) {
    return;
  }
  
  soundAsset.domObj.pause();
  soundAsset.domObj.currentTime = 0;
  */
}

bg.ecard.SoundManagerWebAudio.prototype.loop = function(soundId, caller) {
  app.log(this, 'loop()', soundId);
  
  this.play(soundId, null, true);
  
}

bg.ecard.SoundManagerWebAudio.prototype.stopAll = function() {
  app.log(this, 'stopAll()');
  
  for (var i in this.active) {
    this.active[i].noteOff(0);
    delete this.active[i];
  };
}

bg.ecard.SoundManagerWebAudio.prototype.muteSoundToggle = function() {
  app.log(this, 'muteSoundToggle()');
  
  if (this.soundsMuted) {
    this.unmute();
  } else {
    this.mute();
  }
  
}

bg.ecard.SoundManagerWebAudio.prototype.mute = function(soundId) {
  app.log(this, 'play()', soundId);
  
  this.soundsMuted = true;
  app.interface.setState('sound-muted');

}

bg.ecard.SoundManagerWebAudio.prototype.unmute = function(soundId) {
  app.log(this, 'play()', soundId);
  
  this.soundsMuted = false;
  app.interface.removeState('sound-muted');

}

bg.ecard.SoundManagerWebAudio.prototype.testMusic = function() {
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

bg.ecard.utils.registerJS('bg.ecard.SoundManagerWebAudio.js');