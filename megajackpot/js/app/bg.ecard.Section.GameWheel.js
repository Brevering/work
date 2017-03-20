'use strict';
bg.ecard.Section.GameWheel = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.GameWheel';
//  this.params.id = 'Intro';
  this.parent = parent;
  
  app.log( this, 'new bg.ecard.Section.GameWheel');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
  this.animation = new Object();
  
  this.events.bind('button:spinWheel', this, 'spinWheel');
  
  this.holder.spinHandle = new bg.ecard.DomTarget( this.holder.main.find('.spin-here-text') );
  this.holder.spinWheel = new bg.ecard.DomTarget( this.holder.main.find('.wheel-spin') );
  this.holder.spinArrow = new bg.ecard.DomTarget( this.holder.main.find('.arrow-stop') );
  
  // SS
  this.holder.fullWheel = new bg.ecard.DomTarget( this.holder.main.find('.wheel-box') );
  var a =  this.holder.fullWheel.target;
  function init() { 
    TweenMax.from(a, 2, {autoAlpha: 0, scale:0});
  }
  init();
  // END SS


  this.events.bind('display:afterShow', this, 'startTimer');
  this.timer.UItimeout = new app.time.Timer({
    id: this.params.id+'-UItimeout',
    caller: app.game,
    duration: 30,
    action: 'endGame',
    displayHolder: [new bg.ecard.DomTarget('#defTimerDisplay')],
  });
  
  this.currWheelRotation = 0;
  
}

bg.ecard.Section.GameWheel.prototype.startTimer = function() {
  app.log(this, 'startTimer()');
  
  this.timer.UItimeout.start();
}

bg.ecard.Section.GameWheel.prototype.touchWheel = function(event) {
  app.log(this, 'touchWheel()');
  
  if (this.animation.spin) {
    return;
  }
  
  this.currWheelRotation = (event.start.y - event.current.y)/2 * -1;
  
//  console.log('this.currWheelRotation', this.currWheelRotation);
  
//  if (!this.animation.manualSpin) {
//    this.animation.manualSpin = TweenMax.to( this.holder.spinWheel.target , 1, {
//      rotation: rotationStart+'deg', ease: Power0.easeIn,
//    });
//  }
//  
  
  TweenMax.set( this.holder.spinWheel.target, {rotation: this.currWheelRotation + 'deg'});
  TweenMax.set( this.holder.spinHandle.target, {rotation: Math.round(this.currWheelRotation/4) + 'deg'});
//  this.holder.spinWheel.target.style.transform = 'rotate(' + this.currWheelRotation + 'deg)';
//  this.holder.spinHandle.target.style.transform = 'rotate(' + Math.round(this.currWheelRotation/4) + 'deg)';
  
}

bg.ecard.Section.GameWheel.prototype.spinWheel = function() {
  app.log(this, 'spinWheel()');
//  return;
  if (this.animation.spin) {
    return;
  }

    app.sound.play('wheelClick');
 
  this.timer.UItimeout.stop();
  
  var rotationStart = 360 + this.currWheelRotation;
  
  this.animation.spin = TweenMax.to( this.holder.spinWheel.target , 1, {
    rotation: rotationStart+'deg', 
    ease: Power0.easeIn,
    onUpdate: this.wheelSpinStep,
    onUpdateParams: ['{self}'],
    onUpdateScope: this,
    onComplete: this.wheelSingleSpinComplete,
    onCompleteScope: this,
  });
  
  this.animation.arrowIn = TweenMax.to( this.holder.spinArrow.target , 0.5, {top: '-25px', ease: Power0.easeIn});
  
  this.animation.handleReset = new TimelineMax();
  this.animation.handleReset.add(TweenMax.to( this.holder.spinHandle.target , 0.5, {rotation: '0deg', ease: Elastic.easeOut}));
  this.animation.handleReset.add(TweenMax.to( this.holder.spinHandle.target , 0.3, {opacity: '0', ease: Power0.easeOut}));
  
  
//  return;
  app.game.startWheelSpin();
}

bg.ecard.Section.GameWheel.prototype.wheelSpinStep = function(tween) {
//  app.log(this, 'wheelSpinStep()');
  
  if (typeof tween === 'number') {
    var currRotation = tween;
  } else {
    var currRotation = Math.round(tween._propLookup.rotation.t._transform.rotation);
  }
  
  if (!this.sectiorsDone) {
    this.sectiorsDone = 0;
  }
  var currRotSector = Math.floor(currRotation/37);
    
  if (currRotSector != this.sectiorsDone) {
    
    this.sectiorsDone = Math.floor(currRotation/37); // SS - or this.sectiorsDone = currRotSector; ?
    
 
    app.sound.play('wheelClick');
    
    
    
    if (this.animation.arrow) {
      this.animation.arrow.restart();
    } else {
      
//      this.animation.arrow.kill();
      this.animation.arrow = new TimelineMax();
      this.animation.arrow.add( 
        TweenMax.to( this.holder.spinArrow.target , 0.1, {
          rotation: '-40deg', ease: Power0.easeOut,
        })
      );
      this.animation.arrow.add( 
        TweenMax.to( this.holder.spinArrow.target , 0.1, {
          rotation: '20deg', ease: Power0.easeIn
        })
      );
      this.animation.arrow.add( 
        TweenMax.to( this.holder.spinArrow.target , 0.2, {
          rotation: '0deg', ease: Elastic.easeOut
        })
      );
 
    }
  }
}

bg.ecard.Section.GameWheel.prototype.wheelSingleSpinComplete = function() {
  app.log(this, 'wheelSpinComplete()');
  
  if (this.params.sectiorId) {
  
    var sectorId = this.params.sectiorId + 4;
    var sectorWheelOffset = -4;
    var sectorWheelDeg = (360 * 3) + (sectorId * 36) + sectorWheelOffset;
    var rotationTime = 8;
//    var rotationTime = 2;
    if (app.config.wheelRotationTime) {
      rotationTime = app.config.wheelRotationTime;
    }

    this.animation.spin.restart().kill();
    this.animation.spin = TweenMax.to( this.holder.spinWheel.target , rotationTime, {
      rotation: sectorWheelDeg + 'deg', ease: Power1.easeOut,
      onUpdate: this.wheelSpinStep,
      onUpdateParams: ['{self}'],
      onUpdateScope: this,
      onComplete: this.displayWheelResult,
      onCompleteScope: this,
    });
    
  } else {
    this.animation.spin.restart();
  }
  
}
 
bg.ecard.Section.GameWheel.prototype.stopWheel = function(wheelResult) {
  app.log(this, 'stopWheel()', wheelResult);
  
  
  
//  this.removeState('spinning');
//  this.setState('wheelDone');
  
}

bg.ecard.Section.GameWheel.prototype.processWheelResult = function(number, sectorId) {
  app.log(this, 'displayWheelResult()');
  
  this.params.number = number;
  this.params.sectiorId = sectorId;
}

bg.ecard.Section.GameWheel.prototype.displayWheelResult = function() {
  app.log(this, 'displayWheelResult()');
  
  this.interface.updateLabels({wheelResult: this.params.number});
  this.setState('wheelDone');
  
  if (app.sections.loaded.Spheres) {
    app.sections.loaded.Spheres.updateJackpot(this.params.number);
  }
  
//  this.animation.spin.restart().kill();
//  delete this.animation.spin;
  
  app.time.setTimeout(app.game, 'showWheelResultScreen', app.config.defUItimeout, this.params.number);
  
}

bg.ecard.Section.GameWheel.prototype.reinit = function() {
  app.log(this, 'reinit()');
  
  if (this.animation.spin) {
    this.animation.spin.restart().kill();
  }
  if (this.animation.arrowIn) {
    this.animation.arrowIn.restart().kill();
  }
  
  if (this.animation.handleReset) {
    this.animation.handleReset.restart().kill();
    this.holder.spinHandle.target.style.transform = '';
    this.holder.spinHandle.target.style.opacity = '1';
  }
  
  this.currWheelRotation = 0;
  if (this.holder.spinWheel) {
    this.holder.spinWheel.target.style.transform = '';
  }
  
  
  delete this.animation.spin;
  
}

bg.ecard.utils.registerJS('bg.ecard.Section.GameWheel.js');