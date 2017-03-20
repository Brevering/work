'use strict';
bg.ecard.Section.Login = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.Login';
  this.parent = parent;
  
  this.req = new Object();
  
  app.log( this, 'new bg.ecard.Section.Login');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
  this.holder.form = new bg.ecard.DomTarget( this.holder.main.find('[name="reg-input-form"]'));

  this.events.bind('button:submitReg', this, 'submitlogin');
  this.events.bind('display:beforeShow', this, 'clearForm');

}

bg.ecard.Section.Login.prototype.setLoginType = function(loginType, talonId) {
  app.log(this, 'setLoginType()', loginType);
  
  this.params.loginType = loginType;
  this.params.talonId = talonId;
  this.setState('login-' + loginType);
  
}

bg.ecard.Section.Login.prototype.submitlogin = function() {
  app.log(this, 'submitlogin()');
  
  this.req.req = new app.network.Ajax({
    caller: this,
    url: app.config.url.barcodeSubmit,
    result: 'processReg',
    data: 'user_authenticator='+this.holder.form.getValues()['reg-input-' + this.params.loginType ]+'&talon_id='+this.params.talonId+'&start_game=1',
  });
  
}

bg.ecard.Section.Login.prototype.processReg = function(data) {
  app.log(this, 'processReg()');

  if (data.can_play_games) {
    app.barcodeManager.processLogin(data);
  } else if (data.FATAL_ERROR) {
    this.setState('error');
    this.interface.updateLabels({
      loginError: data.FATAL_ERROR,
    });
  }
  
}


bg.ecard.Section.Login.prototype.clearForm = function() {
  app.log(this, 'clearForm()');
  
  this.removeState('error');
  this.interface.revertLabels();
  this.holder.form.clear();
}



bg.ecard.utils.registerJS('bg.ecard.Section.Login.js');