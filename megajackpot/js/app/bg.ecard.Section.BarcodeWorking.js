'use strict';
bg.ecard.Section.BarcodeWorking = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.BarcodeWorking';
  this.parent = parent;
  
  app.log( this, 'new bg.ecard.Section.BarcodeWorking');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
}

bg.ecard.utils.registerJS('bg.ecard.Section.BarcodeWorking.js');