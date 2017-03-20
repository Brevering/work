'use strict';
bg.ecard.Section.NetworkError = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.NetworkError';
  this.parent = parent;
  
  app.log( this, 'new bg.ecard.Section.NetworkError');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
}

bg.ecard.utils.registerJS('bg.ecard.Section.NetworkError.js');