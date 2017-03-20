'use strict';
bg.ecard.MegaJackpot.Game = function( params ) {

  this.params = params;
  this.params.id = 'game';
  this.params.type = 'bg.ecard.MegaJackpot.Core.Game';
  
  app.log(this, 'new bg.ecard.MegaJackpot.Game');
  
  this.req = new Object();
  this.active = new Object();
  
  this.gameData = new Object();
  
  app.events.bind('sphere:spinDone', this, 'processShpereDone');
  app.events.bind('button:startNewGame', this, 'restart');
  app.events.bind('button:showJackpotVideo', this, 'showJackpotWin');
  app.events.bind('button:debugWheelSpeedToggle', this, 'toggleWheelSpeed');
  
  setTimeout(function(){app.game.start()}, 0);

}

bg.ecard.MegaJackpot.Game.prototype.start = function(data) {
  app.log(this, 'start()');  
  
  app.interface.updateLabels({
    vipPointsMessage: '',
  });
  
  app.interface.labels.vipPointsMessage.revert();
  delete app.interface.labels.vipPoints;
  delete app.interface.labels.vipPointsForGame;
  
  app.interface.updateLabels({
    vipPoints: this.params.ticket_left_points,
    vipPointsForGame: this.params.game_points_required,
  });
  
  
//  this.processGameStepResult(this.params);
  
  app.interface.setState('game-acive');
  
  if (!app.config.userData) {
    app.sections.load(app.config.sections['GameStart']);
  } else {
//    app.sections.load(app.config.sections['GameWheel']);
  }
  
  
}

bg.ecard.MegaJackpot.Game.prototype.processGameStepResult = function(data) {
  app.log(this, 'processGameStepResult()');
  
//  for (var i in data) {
//    console.warn(i, data[i]);
//  };
//  
  if (data.want_step_number) {
    this.gameData.step = parseInt(data.want_step_number);
  }
  
  this.gameData.needUserIdentification = data.want_user_idetificator;
  
  if (data.want_step_number == 0) {
    this.gameData.jackpotPoints = data.RESULT.winning_points;
  };
  
  if (data.current_game_points) {
    if (!this.gameData.points) {
      this.gameData.points = new Number(0);
    }
    this.gameData.points = parseInt(data.current_game_points);
  };
  
  if (data.current_game_points_real) {
    if (!this.gameData.pointsReal) {
      this.gameData.pointsReal = new Number(0);
    }
    this.gameData.pointsReal = parseInt(data.current_game_points_real);
  };
  
  
  if (data.current_points_for_draw) {
    this.gameData.wonDrawTimes = parseInt(data.current_points_for_draw_real);
  };
  if (data.current_points_for_draw_real) {
    this.gameData.wonDrawTimes = parseInt(data.current_points_for_draw_real);
  };
  
  if (data.total_error_count) {
    this.gameData.errorsCount = parseInt(data.total_error_count);
  };
  
  var gameInfoObj = {
    gStep: this.gameData.step,
    gJackpot: this.gameData.jackpotPoints,
    gPoints: this.gameData.points,
    gPointsReal: this.gameData.pointsReal,
    gErrorsCount: this.gameData.errorsCount,
    gDrawsWon: this.gameData.wonDrawTimes,
  };
  
  app.interface.updateLabels(gameInfoObj);
  
  if (app.params.debugMode) {
    app.debugGame(gameInfoObj);
  };
  
}

/* game start */

bg.ecard.MegaJackpot.Game.prototype.submitGameStart = function() {
  app.log( this, 'submitGameStart()');
  
  this.req.gameStart = new app.network.Ajax({
    caller: this,
    url: app.config.url.barcodeSubmit,
    result: 'processGameStart',
    data: 'talon_id='+app.game.params.TALON_ID+'&start_game=1',
  });
  
}

bg.ecard.MegaJackpot.Game.prototype.processGameStart = function(data) {
  app.log(this, 'processGameStart()');
  
  if (data.FATAL_ERROR) {
    app.sections.load(app.config.sections['NetworkError']).interface.updateLabels({
      errorText: data.FATAL_ERROR,
      lastReqState: 0,
    });
    return;
  }
  
  
  app.game.params = data;
  app.game.processGameStepResult(data);
  
  
  app.game.goToWheel();
}



/* wheel */

bg.ecard.MegaJackpot.Game.prototype.goToWheel = function() {
  app.log(this, 'goToWheel()');
  
  this.started = true;
  app.sections.load(app.config.sections['GameWheel']);
  
}

bg.ecard.MegaJackpot.Game.prototype.startWheelSpin = function() {
  app.log(this, 'startWheelSpin()');
  
  app.sections.active.setState('spinning');
  
  this.req.login = new app.network.Ajax({
    caller: this,
    url: app.config.url.gameWheelSpin,
    result: 'processWheelSpin',
    data: 'json={"session_id":"'+this.params.session_id+'","step_number":"0"}',
  });
  
  
}

bg.ecard.MegaJackpot.Game.prototype.processWheelSpin = function(data) {
  app.log(this, 'processWheelSpin()');
  
  app.sections.active.processWheelResult(data.RESULT.winning_points, parseInt(data.RESULT.choosed_value));
  
  this.processGameStepResult(data);
//  this.gameData = data;
  return;
//  app.time.setTimeout(this, 'stopWheelSpin', app.config.defUItimeout, data.RESULT.winning_points);
}

bg.ecard.MegaJackpot.Game.prototype.stopWheelSpin = function(result) {
  app.log(this, 'stopWheelSpin()');
  
  app.sections.active.stopWheel(result);
  
//  app.time.setTimeout(this, 'showWheelResultScreen', app.config.defUItimeout, result.winning_points);
  
//  app.sections.active.removeState('spinning');
//  app.sections.active.setState('wheelDone');

  
}

bg.ecard.MegaJackpot.Game.prototype.showWheelResultScreen = function(resultPoints) {
  app.log(this, 'showWheelResultScreen()');
  
  app.sections.load(app.config.sections['GameWheelResult']).interface.updateLabels({
    wheelResult: this.gameData.jackpotPoints,
  });
  
}

/* spheres */

bg.ecard.MegaJackpot.Game.prototype.showSpheres = function() {
  app.log(this, 'showSpheres()');
  
  app.sections.load(app.config.sections['Spheres']);
  
}

bg.ecard.MegaJackpot.Game.prototype.activeteSphere = function(sphereId) {
  app.log(this, 'activeteSphere()', sphereId);
  
  this.active.sphere = app.sections.active.spheres[sphereId];
  
  app.sections.active.startSphere(sphereId);
  
  app.interface.updateLabels({
    gCurrSpherePoints: this.active.sphere.params.points,
  });
  
}

bg.ecard.MegaJackpot.Game.prototype.stopSphere = function(sphereObj) {
  app.log(this, 'stopSphere()', sphereObj.params.id); 
  
  this.req.sphere = new app.network.Ajax({
    caller: this,
    url: app.config.url.gameSphereSpin,
    result: 'processStopSphere',
    data: 'json={"session_id":"'+this.params.session_id+'","step_number":"'+sphereObj.params.id+'","user_choosed":"'+sphereObj.params.guess+'"}',
  });
  
}

bg.ecard.MegaJackpot.Game.prototype.processStopSphere = function(data) {
  app.log(this, 'processStopSphere()');
  
  if (data.RESULT.user_choosed_value == data.RESULT.valid_selection) {
    var spinResult = 'success';
  } else {
    var spinResult = 'error';
  }
  
  this.active.resultData = data;
  
  this.active.sphere.spinResultSuccess(data.RESULT.choosed_value, spinResult);
  
  this.processGameStepResult(data);

}

bg.ecard.MegaJackpot.Game.prototype.processShpereDone = function(sphere) {
  app.log(this, 'processShpereDone()', sphere.params.id);
  
  //sphere:spinDone
  
  var data = this.active.resultData;
  
  if (data.RESULT.user_choosed_value == data.RESULT.valid_selection) {
    if (data.RESULT.next_step_number === 'finished') {
      app.time.setTimeout(this, 'showJackpotWin', app.config.defUItimeout);
    } else {
      app.time.setTimeout(this, 'activeteSphere', app.config.defUItimeout, this.active.sphere.params.id+1);
    }
  } else {
    if (data.total_error_count == 1) {
      app.time.setTimeout(this, 'processWrongGuess', app.config.defUItimeout, data);
    } else {
      app.time.setTimeout(this, 'endGame', app.config.defUItimeout);
    }
  }
  
}

bg.ecard.MegaJackpot.Game.prototype.processWrongGuess = function(data) {
  app.log(this, 'processWrongGuess()');
 
  if (this.gameData.errorsCount == 1) {
    app.sound.stop('spheresBack', this);
    app.sound.loop('spheresBackAfterError', this);
  }
  app.sections.load(app.config.sections['GameError']);
  
}

bg.ecard.MegaJackpot.Game.prototype.continueGame = function() {
  app.log(this, 'continueGame()');
  
  app.sections.load(app.config.sections['Spheres']);
  
  
  if (this.gameData.errorsCount > 0) {
    app.interface.setState('has-game-error');
  }
  
  app.time.setTimeout(app.sections.active, 'startSphere', app.config.defUItimeout, this.active.sphere.params.id);

}

bg.ecard.MegaJackpot.Game.prototype.endGame = function() {
  app.log(this, 'endGame()');
  
  app.sound.stop('spheresBackAfterError');
  app.sound.loop('regBack', this);
  
  if (!this.gameData.needUserIdentification) {
    app.sections.load(app.config.sections['RegistrationSuccess']);
  } else {
    app.sections.load(app.config.sections['Registration']);
  }
}

bg.ecard.MegaJackpot.Game.prototype.showJackpotWin = function() {
  app.log(this, 'showJackpotWin()');
  
  app.sound.stop('spheresBack');
  app.sound.stop('spheresBackAfterError');
  
  app.sections.load(app.config.sections['JackpotWon']);
//  app.sections.load(app.config.sections['Registration']);
  
}

bg.ecard.MegaJackpot.Game.prototype.regDone = function() {
  app.log(this, 'regDone()');
  
  this.restart();
//  document.location.reload(false);
//  app.sections.load(app.config.sections['default']);
  
  
}

bg.ecard.MegaJackpot.Game.prototype.restart = function() {
  app.log(this, 'restart()');
  
//  document.location.reload(false);
  
  app.restartGame();
  
  
  
  
}



bg.ecard.MegaJackpot.Game.prototype.toggleWheelSpeed = function() {
  app.log(this, 'toggleWheelSpeed()');
  
  if (!app.config.wheelRotationTime) {
    app.config.wheelRotationTime = 2;
    app.interface.setState('fast-wheel-spin');
  } else {
    delete app.config.wheelRotationTime;
    app.interface.removeState('fast-wheel-spin');
  }
  
  
}


bg.ecard.utils.registerJS('bg.ecard.MegaJackpot.Game.js');