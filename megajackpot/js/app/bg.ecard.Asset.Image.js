'use strict';
bg.ecard.Asset.Image = function(params, parent) {
  
  this.params = params;
  this.params.type = 'bg.ecard.Asset.Image';
  this.parent = parent;
  
  app.log(this, 'new bg.ecard.Asset.Image', this.params.url);
  
  bg.ecard.utils.extendClass(bg.ecard.Asset.Class, this);
}

bg.ecard.Asset.Image.prototype.load = function() {
  app.log(this, 'load()', this.params.url);

  this.setState([{loading: true}]);
  
  this.imgObj = document.createElement('img');
  this.imgObj.parent = this;
  this.imgObj.addEventListener('load',function(event){
    this.parent.loadComplete(event);
  });
  this.imgObj.addEventListener('error',function(event){
    this.parent.loadError(event)
  });
  this.imgObj.src = app.config.assetsBaseUrl + '' + this.params.url;
  
}

bg.ecard.Asset.Image.prototype.loadComplete = function(event) {
  app.log(this,'loadComplete');
  
  this.setState([{loaded: true},{loading: false}]);
  
  if (this.isReload) {
    for (var i in this.reloadCallbacks) {
      this.reloadCallbacks[i][0].events.trigger(this.reloadCallbacks[0][1]);
    }
    this.reloadCallbacks = null;
    delete this.reloadCallbacks;
    return;
  }

  /*
  var preloadTag = document.createElement('DIV');
  preloadTag.style.background = 'url('+this.params.url+')';
  preloadTag.appendChild(this.imgObj);
  document.getElementById('imgPreload').appendChild(preloadTag);
  */
  this.parent.events.trigger('assetLoadComplete', this);
}

bg.ecard.Asset.Image.prototype.loadError = function(event) {
  app.log(this, 'loadError()');
  
  app.die('ERROR loading asset '+ this.imgObj.src);
}

bg.ecard.Asset.Image.prototype.reload = function(callback){
  app.log(this, 'reload');
  
  this.isReload = true;
  if (!this.reloadCallbacks) {
    this.reloadCallbacks = new Array();
  }
  this.reloadCallbacks.push(callback);
  this.load();
}

bg.ecard.utils.registerJS('bg.ecard.Asset.Image.js');