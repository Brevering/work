'use strict';
bg.ecard.MegaJackpot.Core = function( config ) {

  this.params = new Object({
    id: 'app',
    type: 'bg.ecard.MegaJackpot.Core',
//    debugMode: true,
    inputMode: 'web',
  });
  
  if (config.debugMode) {
    this.params.debugMode = true;
  }
  
  this.holder = {
    main: new bg.ecard.DomTarget(bg.ecard.active.DOMbody),
  };
  
  if (this.params.debugMode) {
    this.holder.main.target.classList.add('app-state-debugMode');
  }
  
  this.config = config;

  this.active = new Object();
  this.active.sprites = new Array();
  
  this.settings = new Object();
  
  this.active.scaleRatio = 1;
  
  setTimeout(bg.ecard.MegaJackpot.initCore,0);

}

bg.ecard.MegaJackpot.Core.prototype.init = function() {
  
  window.onerror = function(error) {
//		console.log( error );
		app.die({errorId:'JAVASCRIPT RUNTIME ERROR', elementName:error});
	};
  
  window.onbeforeunload = function() {};
  
  // start console
  this.console = new bg.ecard.Console();
  app.log(this, 'new bg.ecard.MegaJackpot.Core');
  app.log(this.console, 'new bg.ecard.Console');

  app.log(this, 'init()');
  
  this.params.env = bg.ecard.utils.getEnvironment();

  // init time
  this.time = new bg.ecard.Time(this);

  // start events
  this.events = new bg.ecard.EventDispatcher(this);
  
  // start input
  this.input = new bg.ecard.InputManager(this);
  
  // start interface
  this.interface = new bg.ecard.Interface({parent: this});
  
  //app.events.bind('resolutionChanged', this, 'resolutionChanged');

  this.startNetwork();

}

bg.ecard.MegaJackpot.Core.prototype.startDisplays = function() {
  app.log( this, 'startDisplays()');
  
  // init displays
//  this.events.bind('displaysReady', this, 'startNetwork', true);
//  this.displays = new bg.ecard.DisplayManager(this.config.engine.display, this.config.displays, this);
  
}

bg.ecard.MegaJackpot.Core.prototype.startNetwork = function() {
  app.log(this, 'startNetwork()');
  
  //start network IO
  this.events.bind('networkReady', this, 'startAssets', true);
  this.network = new bg.ecard.Network({}, this);
  
}

bg.ecard.MegaJackpot.Core.prototype.startBarcodeManager = function() {
  app.log( this, 'startBarcodeManager()');
  
  this.events.bind('barcodeManagerReady', this, 'startSections', true);
  this.barcodeManager = new bg.ecard.MegaJackpot.BarcodeManager();
  //startBarcodeManager
}

bg.ecard.MegaJackpot.Core.prototype.startAssets = function() {
  app.log(this, 'startAssets()');
  
//  alert('startAssets()');
  
  this.events.bind('assetsLoadComplete', this, 'startBarcodeManager', true);
  this.events.bind('SoundManagerReady', this, 'loadAssests', true);
  /*
  if (window.webkitAudioContext && app.params.env.browser.name !== 'Chrome') {
    this.sound = new bg.ecard.SoundManagerWebAudio(this);
  } else {
    this.sound = new bg.ecard.SoundManager(this);
  }
  */
  this.assets = new bg.ecard.AssetManager(this);
  
  if (app.params.env.browser.name == 'Firefox') {
    this.sound = new bg.ecard.SoundManager(this);
  } else {
    this.sound = new bg.ecard.SoundManagerHowler(this);
  }
  
  
  

  
}

bg.ecard.MegaJackpot.Core.prototype.loadAssests = function() {
  app.log(this, 'loadAssests()');
  
  setTimeout(function(){
    app.assets.load(app.config.assets, app);
  }, 0);
  //SoundManagerReady
}

bg.ecard.MegaJackpot.Core.prototype.startSections = function() {
 
  setTimeout(function(){app.startSectionsDo()},0);
  
}

bg.ecard.MegaJackpot.Core.prototype.startSectionsDo = function() {
  app.log(this, 'startSections()');
  
  //start sectionManager
  this.sections = new bg.ecard.SectionManager(this.config.sections, this);
  
  this.events.bind('button:debugTimersToggle', app.time, 'disableTimersToggle');
  this.events.bind('button:debugSoundToggle', app.sound, 'muteSoundToggle');
  this.events.bind('button:testMusic', app.sound, 'testMusic');
  this.events.bind('button:restartGame', this, 'restartGame');
  this.events.bind('button:startNewGame', this, 'restartGame');
  this.events.bind('button:restartApp', this, 'restart');
//   app.events.unbind('button:restartGame', this, 'restartGame');
  
}

bg.ecard.MegaJackpot.Core.prototype.startScreens = function() {
  app.log(this, 'startScreens()');
  
  //start screenManager
  this.screens = new bg.ecard.ScreenManager();
}

bg.ecard.MegaJackpot.Core.prototype.die = function() {
  alert("APP FATAL ERRROR:\n\n" + JSON.stringify(arguments));
  
}

bg.ecard.MegaJackpot.Core.prototype.startGame = function(gameData) {
  app.log( this, 'startGame()');
  
  if (this.game && this.game.started) {
    app.die({elementName: 'previous game not finished!'});
    return;
  }
  
//  this.restartGame();
  
  app.game = new bg.ecard.MegaJackpot.Game(gameData);
  
}

bg.ecard.MegaJackpot.Core.prototype.formatStrExtConsole = function(str) {
  
  return bg.ecard.utils.formatStrExtConsole(str);
  
}

bg.ecard.MegaJackpot.Core.prototype.debugInfo = function(debugParams) {
  debugParams.debugType = 'info';
  bg.ecard.utils.showDebugInfo(debugParams);
}

bg.ecard.MegaJackpot.Core.prototype.debugLoading = function(debugParams) {
  debugParams.debugType = 'loading';
  bg.ecard.utils.showDebugInfo(debugParams);
}

bg.ecard.MegaJackpot.Core.prototype.debugGame = function(debugParams) {
  debugParams.debugType = 'game';
  bg.ecard.utils.showDebugInfo(debugParams);
}

bg.ecard.MegaJackpot.Core.prototype.restartGame = function() {
  app.log(this, 'restartGame');
  
  if (app.config.is_web_game == 1) {
    this.restart();
    return;
  }
  
  app.sound.stopAll();
  
  app.sections.active.hide();
  
  app.time.clearTimers();
  
  app.interface.removeState('has-game-error');
  app.interface.removeState('game-acive');
  
  if (app.game) {
    delete app.game.active.sphere;
  }
  
  for (var i in app.sections.loaded) {
    if (app.sections.loaded[i].reinit) {
      app.sections.loaded[i].reinit();
    }
  }
  
  if (app.game) {
    app.events.unbind('sphere:spinDone', app.game, 'processShpereDone');
    app.events.unbind('button:startNewGame', app.game, 'restart');
    app.events.unbind('button:showJackpotVideo', app.game, 'showJackpotWin');
    app.events.unbind('button:debugWheelSpeedToggle', app.game, 'toggleWheelSpeed');

    delete app.game;
  }
  
  if (app.params.debugMode) {
    app.debugGame({});
  };
//  return;
  app.sections.load(app.config.sections[app.config.sections.default]);
}

bg.ecard.MegaJackpot.Core.prototype.restart = function() {
  app.log(this, 'restart()');
  
  document.location.reload(false);
}

bg.ecard.utils.registerJS('bg.ecard.MegaJackpot.Core.js');