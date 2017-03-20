'use strict';
bg.ecard.Section.GameWheelResult = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.GameWheelResult';
  this.parent = parent;
  
  app.log( this, 'new bg.ecard.Section.GameWheelResult');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
  this.events.bind('button:startSpheres', this, 'startSpheres');
  
}

bg.ecard.Section.GameWheelResult.prototype.startSpheres = function() {
  app.log(this, 'startSpheres()');
  
  app.game.showSpheres();
  
}

bg.ecard.utils.registerJS('bg.ecard.Section.GameWheelResult.js');