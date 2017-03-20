'use strict';
bg.ecard.Section.Spheres = function (params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.Spheres';
  this.parent = parent;

  this.active = new Object();

  app.log(this, 'new bg.ecard.Section.Spheres');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);

  this.events.bind('display:beforeShow', this, 'startIntroAnimation');
  this.events.bind('display:afterHide', this, 'stopSounds');
  this.holder.spheres = new bg.ecard.DomTarget(this.holder.main.find('.spheres-box'))

  this.events.bind('button:goToEndOfIntroAnimation', this, 'goToEndOfIntroAnimation');
  this.events.bind('button:stop', this, 'stopSphere');
  this.events.bind('button:selectDown', this, 'selectDown');
  this.events.bind('button:selectUp', this, 'selectUp');

  this.events.bind('button:endGame', app.game, 'endGame');

  this.initSpheres();

  this.timer.UItimeout = new app.time.Timer({
    id: this.params.id + '-UItimeout',
    caller: app.game,
    duration: 30,
    action: 'endGame',
    displayHolder: [
      new bg.ecard.DomTarget('#defTimerDisplay'),
      new bg.ecard.DomTarget(this.holder.main.find('.label-timeRemaining'))
    ],
  });

}

bg.ecard.Section.Spheres.prototype.startIntroAnimation = function () {
  app.log(this, 'startIntroAnimation()');

  if (this.state.introDone) {
    return;
  }

  if (app.config.spheresIntroDuration) {
    var duration = app.config.spheresIntroDuration;
  } else {
    var duration = 13;
  }

  //  duration = 1;
  // SS 
  var img1 = this.holder.spheres.target,
      tl1 = new TimelineMax({ paused: true });

  TweenMax.set(img1, { transformOrigin: 'center -250%', transformPerspective: 800 });
  tl1
    .from(img1, 5, { top: '-100px', ease: Power1.easeOut, repeat: 0 })
    .to(img1, 1, { rotationX: -10, ease: Power1.easeInOut, immediateRender: false })
    .fromTo(img1, 1, { rotationX: -10, ease: Power1.easeInOut, immediateRender: false }, { rotationX: 10, ease: Power1.easeInOut, repeat:4, yoyo:true})
    .to(img1, 2, { rotationX: 0, ease: Bounce.easeOut, onComplete: this.endIntroAnimation, onCompleteScope: this});

  this.animation.spheresDrop = tl1.play(0);
  // END SS

  // this.animation.spheresDrop = TweenMax.from( this.holder.spheres.target , duration, {
  //   top: '-100px', ease: Power1.easeOut, repeat: 0,
  //   onComplete: this.endIntroAnimation,
  //   onCompleteScope: this,
  // });


  app.sound.play('spheresIntro', this);
}

bg.ecard.Section.Spheres.prototype.endIntroAnimation = function () {
  app.log(this, 'endIntroAnimation()');

  this.setState('introDone');
  app.sound.loop('spheresBack', this);
  app.game.activeteSphere(1);
}

bg.ecard.Section.Spheres.prototype.goToEndOfIntroAnimation = function () {
  app.log(this, 'goToEndOfIntroAnimation()');

  this.animation.spheresDrop.progress(1, false);
  app.sound.stop('spheresIntro', this);

}

bg.ecard.Section.Spheres.prototype.initSpheres = function () {
  app.log(this, 'initSpheres()');

  if (!app.game || !app.game.params.koef) {
    return;
  }

  if (this.spheres) {
    for (var i in this.spheres) {
      if (this.spheres[i].animation.spin) {
        this.spheres[i].animation.spin.restart().kill();
      }
      delete this.spheres[i];
    }
    delete this.spheres;
    this.removeState('introDone');
    this.removeStates('selected-');
  }

  this.spheres = new Object();

  for (var i in app.game.params.koef.spheres) {
    //  for (var i=1; i<3; i++) {
    app.game.params.koef.spheres[i].id = parseInt(i);
    app.game.params.koef.spheres[i].holder = '.sphere-box-' + i;
    this.spheres[i] = new bg.ecard.MegaJackpot.Sphere(app.game.params.koef.spheres[i], this);
  };

}

bg.ecard.Section.Spheres.prototype.startSphere = function (sphereId) {
  app.log(this, 'startSphere()', sphereId);

  if (this.active.sphere && this.active.sphere.params.id !== this.spheres[sphereId].params.id) {
    this.active.sphere.setDone();
  }

  if (sphereId > 1) {
    this.timer.UItimeout.start(30);
  } else {
    this.timer.UItimeout.start(30);
  }

  this.active.sphere = this.spheres[sphereId];
  this.spheres[sphereId].startSpin();

  this.removeStates('sphereActive-');
  this.removeStates('selected-');

  this.setState('sphereActive-' + sphereId);

  if (sphereId === 1) {
    this.setState('stopBtnActive');
  }



}

bg.ecard.Section.Spheres.prototype.stopSphere = function () {
  app.log(this, 'stopSphere()');

  this.timer.UItimeout.stop();

  this.removeState('stopBtnActive');
  //  this.removeStates('selected-');

  this.active.sphere.stopSpin();


}

bg.ecard.Section.Spheres.prototype.selectDown = function () {
  app.log(this, 'selectDown()');

  app.game.active.sphere.selectGuess('down');

  this.removeStates('selected-');

  this.setState('selected-down');
  this.setState('stopBtnActive');

}

bg.ecard.Section.Spheres.prototype.selectUp = function () {
  app.log(this, 'selectUp()');

  app.game.active.sphere.selectGuess('up');

  this.removeStates('selected-');

  this.setState('selected-up');
  this.setState('stopBtnActive');

}

bg.ecard.Section.Spheres.prototype.updateJackpot = function (jackpotNum) {
  app.log(this, 'updateJackpot()', jackpotNum);

  this.spheres[10].params.points = parseInt(jackpotNum);
  this.spheres[10].updateLabels({
    points: parseInt(jackpotNum),
  })
}

bg.ecard.Section.Spheres.prototype.stopSounds = function () {
  app.log(this, 'stopSounds()');

  if (this.active.sphere && this.active.sphere.animation.spin) {
    this.active.sphere.animation.spin.progress(0.5).kill()
  }

  app.sound.stop('spheresIntro', this);
  app.sound.stop('spheresBack', this);
}

bg.ecard.Section.Spheres.prototype.reinit = function () {
  app.log(this, 'reinit()');

  delete this.active.sphere;
  this.removeState('introDone');
  this.removeStates('sphereActive-');
  //  delete this.params.guess;

  this.initSpheres();

}

bg.ecard.utils.registerJS('bg.ecard.Section.Spheres.js');