'use strict';
bg.ecard.MegaJackpot.Sphere = function(params, parent) {
  
  this.params = params;
  this.params.type = 'bg.ecard.MegaJackpot.Sphere';
  
  if (parent) {
    this.params.parent = parent;
  }
  
  this.animation = new Object();
  
  app.log( this, 'new bg.ecard.MegaJackpot.Sphere');
  bg.ecard.utils.extendClass(bg.ecard.DisplayElement.Class, this);
  
  if (this.params.points === '###JACKPOT###') {
    this.params.points = app.game.gameData.jackpotPoints;
  }
  
  this.holder.wordInd = new bg.ecard.DomTarget('.letter.letter-' + (this.params.id+1) );
  this.holder.main.attachedState.push(this.holder.wordInd);
  
  this.updateLabels({
    points: this.params.points,
  });
  
  this.active = new Object();
  
//  
//  this.active.numbers = new Array();
//  for (var i=1; i<=50; i++) {
//    this.active.numbers.push(i);
//  }
//  
  if (this.params.parent) {
    if (this.params.parent.spheres && this.params.parent.spheres[this.params.id-1]) {
      this.active.prevSphere = this.params.parent.spheres[this.params.id-1];
    }
  }
  
  this.removeState('done');
  this.removeState('active');
  this.removeState('numberDone');
  this.removeState('error');
  this.removeState('success');
  
  this.holder.spinNum1 = new bg.ecard.DomTarget( this.holder.main.find('.spinAnimNum1') );
  this.holder.spinNum1.html('');
  
}

bg.ecard.MegaJackpot.Sphere.prototype.startSpin = function() {
  app.log(this, 'startSpin()');
  
  if (this.state.error) {
    this.removeState('error');
  }
  
  this.setState('active');
  
  app.sections.active.removeState('sphere-stopping');
  this.removeState('numberDone');
  delete this.params.number;
  delete this.params.numberResult;
  
  if (!this.holder.spinNum1) {
    this.holder.spinNum1 = new bg.ecard.DomTarget( this.holder.main.find('.spinAnimNum1') );
//    this.holder.spinNum2 = new bg.ecard.DomTarget( this.holder.main.find('.spinAnimNum2') );
  }
  
  this.holder.spinNum1.target.style.top = '-100%';
  this.holder.spinNum1.html(this.getRandNum());

  this.animation.spin = TweenMax.to( this.holder.spinNum1.target , 0.2, {
    top: '100%', ease: Power0.easeNone, repeat: 0,
    onComplete: this.setSpinRandNum,
    onCompleteScope: this,
  });
  
  app.sections.active.setState('sphere-spinning');
}

bg.ecard.MegaJackpot.Sphere.prototype.setSpinRandNum = function() {
//  app.log(this, 'setSpinRandNum()');
  
  if (this.state.numberDone) {
    this.holder.spinNum1.html(this.params.number);
    this.animation.spin.restart();
    this.animation.spin.kill();
    
    this.animation.spin = TweenMax.to( this.holder.spinNum1.target , 0.5, {
      top: '0%', ease: Elastic.easeOut, repeat: 0,
      onCompleteScope: this,
      onComplete: this.spinDone(),
    });
    
  } else {
    this.holder.spinNum1.html(this.getRandNum());
    this.animation.spin.restart();
  }
  
}

bg.ecard.MegaJackpot.Sphere.prototype.getRandNum = function() {
//  app.log(this, 'getRandNum()');
  
  var randNum = Math.round(1 + Math.random() * (50 - 1));
  if (this.active.prevSphere) {
    while (randNum == this.active.prevSphere.params.number) {
      randNum = Math.round(1 + Math.random() * (50 - 1));
    }
  }
  return randNum;
  
}

bg.ecard.MegaJackpot.Sphere.prototype.selectGuess = function(guess) {
  app.log(this, 'selectGuess()', guess);
  
  this.params.guess = guess;
  
}

bg.ecard.MegaJackpot.Sphere.prototype.stopSpin = function() {
  app.log(this, 'stopSpin()');
  
  app.game.stopSphere(this);
  app.sections.active.setState('sphere-stopping');
  
  
//  app.sections.active.removeState('sphere-spinning');
  
}

bg.ecard.MegaJackpot.Sphere.prototype.spinDone = function() {
  app.log(this, 'spinDone()');
  
  this.animation.spin.kill();
  this.setState(this.params.numberResult);
  this.removeState('active');
  
  app.sections.active.removeState('sphere-spinning');
  app.events.trigger('sphere:spinDone', this);
  
  setTimeout(function(){
    app.sound.play('sphereStop');
  },10);
  
}

bg.ecard.MegaJackpot.Sphere.prototype.spinResultSuccess = function(number, resultStatus) {
  app.log(this, 'spinResultSuccess()', number, resultStatus);
  
  /*
  this.updateLabels({
    number: number,
  });
  */
  this.params.number = parseInt(number);
  this.params.numberResult = resultStatus;
  this.setState('numberDone');
  
//  this.setState(resultStatus);
//  this.removeState('active');
}

bg.ecard.MegaJackpot.Sphere.prototype.setDone = function() {
  app.log(this, 'setDone()');
  
  this.setState('done');
  
}

bg.ecard.utils.registerJS('bg.ecard.MegaJackpot.Sphere.js');