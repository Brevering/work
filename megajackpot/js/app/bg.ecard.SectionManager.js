'use strict';
bg.ecard.SectionManager = function(sections, parent) {
  
  this.params = {
    type: 'bg.ecard.SectionManager',
    id: 'sections',
  }
  this.parent = parent;
  
  this.params.sections = sections;
  
  app.log(this, 'new bg.ecard.SectionManager');
  
  this.loaded = new Object();
  this.active = null;
  
  
  this.init();  
}

bg.ecard.SectionManager.prototype.init = function() {
  app.log( this, 'init()');
  
//  console.log(this.params.sections.default);
//  return;
  
  this.load(this.params.sections[ this.params.sections.default ]);
  
  app.events.trigger('sectionsReady');
}


bg.ecard.SectionManager.prototype.load = function(sectionParams) {
  app.log( this, 'load()', sectionParams.id);
  
  if (this.active) {
    this.active.hide();
  }
  
  sectionParams.parent = this;
  
  if (!this.loaded[sectionParams.id]) {
    this.loaded[sectionParams.id] = new bg.ecard.Section[sectionParams.type](sectionParams, this);
  }
  
  this.loaded[sectionParams.id].show();
  this.active = this.loaded[sectionParams.id];
  
  if (app.params.debugMode) {
    app.debugInfo({Section: sectionParams.id});
  }
  
  return this.loaded[sectionParams.id];
  
}


bg.ecard.utils.registerJS('bg.ecard.SectionManager.js');