'use strict';
bg.ecard.Section.Registration = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.Registration';
//  this.params.id = 'Intro';
  this.parent = parent;
  
  this.req = new Object();
  
  app.log( this, 'new bg.ecard.Section.Registration');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
  this.holder.form = new bg.ecard.DomTarget( this.holder.main.find('[name="reg-input-form"]'));

  this.events.bind('button:submitReg', this, 'submitReg');
  this.events.bind('display:beforeShow', this, 'clearForm');
  
  this.events.bind('display:afterShow', this, 'startTimer');
  this.events.bind('keyboard:show', this, 'stopTimer');
  this.timer.UItimeout = new app.time.Timer({
    id: this.params.id+'-UItimeout',
    caller: app.game,
    duration: 60,
    action: 'restart',
    displayHolder: [new bg.ecard.DomTarget('#defTimerDisplay')],
  });
}

bg.ecard.Section.Registration.prototype.startTimer = function() {
  app.log(this, 'startTimer()');
  
//  this.timer.UItimeout.restart();
  this.timer.UItimeout.start();
} 

bg.ecard.Section.Registration.prototype.stopTimer = function() {
  app.log(this, 'startTimer()');
  
  this.timer.UItimeout.stop();
} 

bg.ecard.Section.Registration.prototype.submitReg = function() {
  app.log(this, 'submitReg()');
  
//  console.log(this.holder.form.serialize(), JSON.stringify(this.holder.form.getValues()) );
  
  this.stopTimer();
  
  this.req.req = new app.network.Ajax({
    caller: this,
    url: app.config.url.gameResultReg,
    result: 'processReg',
    data: 'json={"session_id": "'+app.game.params.session_id+'", "user_phone": "'+this.holder.form.getValues()['reg-input-phone']+'", "user_email": "'+this.holder.form.getValues()['reg-input-email']+'"}',
  });
  
}

bg.ecard.Section.Registration.prototype.processReg = function(data) {
  app.log(this, 'processReg()');
  
  if (!data.RESULT) {
    this.setState('error');
    this.interface.updateLabels({
      regResult: 'Възникна грешка, моля, опитайте отново.',
    })
  } else if (data.RESULT.success === 1) {
    app.sections.load(app.config.sections['RegistrationSuccess']);
  } else {
    this.setState('error');
    this.interface.updateLabels({
      regResult: data.RESULT.error_text,
    });
  }
}

bg.ecard.Section.Registration.prototype.clearForm = function() {
  app.log(this, 'clearForm()');
  
  this.removeState('error');
  this.interface.revertLabels();
  this.holder.form.clear();
}


bg.ecard.utils.registerJS('bg.ecard.Section.Registration.js');