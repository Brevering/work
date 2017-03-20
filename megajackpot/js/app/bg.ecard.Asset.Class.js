'use strict';
bg.ecard.Asset = {};

bg.ecard.Asset.Class = function(params, parent) {
  
  this.params = params;
  this.params.type = 'bg.ecard.Asset.Class';
  
}

bg.ecard.Asset.Class.prototype.params = {
  type: 'bg.ecard.Asset.Class'
}

bg.ecard.Asset.Class.prototype.initClass = function() {
  app.log(this, 'initClass()');
  
  this.state = new Object({
    loaded: false
  });
}

bg.ecard.Asset.Class.prototype.isLoaded = function() {
  //app.log(this, 'isLoaded()');
  
  if (!this.state.loaded && this.state.loading) {
    return false;
  } else if (this.state.loaded) {
    return true;
  }
  //return this.state.loaded;
  
}

bg.ecard.Asset.Class.prototype.setState = function(states) {
 // app.log(this, 'setState()');
  
  bg.ecard.utils.setState(this, states);
}

bg.ecard.Asset.Class.prototype.registerSprite = function(sprite) {
  
  
}


bg.ecard.utils.registerJS('bg.ecard.Asset.Class.js');