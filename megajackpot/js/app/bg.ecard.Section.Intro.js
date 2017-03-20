'use strict';
bg.ecard.Section.Intro = function(params, parent) {
  this.params = params;
  this.params.type = 'bg.ecard.Section.Intro';
//  this.params.id = 'Intro';
  this.parent = parent;
  
  app.log( this, 'new bg.ecard.Section.Intro');
  bg.ecard.utils.extendClass(bg.ecard.Section.Class, this);
  
  this.events.bind('button:simulateBarcode', this, 'simulateBarcode');
  
  /*
  document.querySelector('[data-action="simulateBarcode"]').addEventListener('click',function(){
    var elem = document.querySelector('body');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  })
  */
  
}

bg.ecard.Section.Intro.prototype.simulateBarcode = function() {
  app.log(this, 'simulateBarcode()');
  
  app.barcodeManager.processMessage('{"TICKET_ID":"0000000000"}');
  
}

bg.ecard.utils.registerJS('bg.ecard.Section.Intro.js');