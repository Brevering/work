'use strict';
bg.ecard.MegaJackpot.BarcodeManager = function() {
  this.params = {
    type: 'bg.ecard.MegaJackpot.BarcodeManager',
    id: 'barcodeManager'
  }
  
  this.req = {};
  
  
  app.log( this, 'new bg.ecard.MegaJackpot.BarcodeManager');
  
  app.events.bind('net.Socket.Barcode.message', this, 'processMessage');
  
  app.events.trigger('barcodeManagerReady');
  
}

bg.ecard.MegaJackpot.BarcodeManager.prototype.processMessage = function(message) {
  app.log(this, 'processMessage()', message);
  
  var barcode = new String();
  barcode = JSON.parse(message);
  barcode = barcode.TICKET_ID;

  if (!barcode) {
    return;
  }
    
  if ((app.game && app.game.started) || (this.req.login && this.req.login.inProgress)) {
    return false;
  }
  
  if (app.game) {
    app.restartGame();
  }
  
  app.time.clearTimers();
  
  app.sections.load(app.config.sections['BarcodeWorking']);
  
  this.req.login = new app.network.Ajax({
    caller: this,
    url: app.config.url.barcodeSubmit,
    result: 'processLogin',
    data: 'talon_id='+barcode+'',
  });
}

bg.ecard.MegaJackpot.BarcodeManager.prototype.processLogin = function(data) {
  app.log(this, 'processLogin()');

  
  if ( (data.can_play_games >= 1) && (!data.LOGIN_REQUIRED) ) {
    app.startGame(data);
  } else if (data.LOGIN_REQUIRED) {
    app.sections.load(app.config.sections['Login']).setLoginType(data.LOGIN_FIELD, data.TALON_ID);
  } else if (data.HTML) {
    app.sections.load(app.config.sections['TalonHistory']).displayHistory(data.HTML);
  } else {
    if (data.can_play_games_error_text) {
      app.sections.load(app.config.sections['LoginError']).interface.updateLabels({
        errorText: data.can_play_games_error_text,
      });
    } else {
      app.sections.load(app.config.sections['LoginError']);
    }
  }
  
  
}


bg.ecard.utils.registerJS('bg.ecard.MegaJackpot.BarcodeManager.js');