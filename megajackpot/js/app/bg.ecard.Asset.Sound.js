'use strict';
bg.ecard.Asset.Sound = function(params, parent) {
  
  this.params = params;
  this.params.type = 'bg.ecard.Asset.Sound';
  this.parent = parent;
  
  app.log(this, 'new bg.ecard.Asset.Sound', this.params.url);
  
  bg.ecard.utils.extendClass(bg.ecard.Asset.Class, this);
}

bg.ecard.Asset.Sound.prototype.load = function() {
  app.log(this, 'load()', this.params.url, app.sound.params.audioCodec);
  
  this.setState([{loading: true}]);
  
  this.params.fullUrl = app.config.assetsBaseUrl + '' + this.params.url;
  
  
  if (this.parent.parent.sound.isWebAudio) {
    
    this.request = new XMLHttpRequest();
    
    this.request._soundName = this.params.id;
    this.request.parent = this;
    this.request.open('GET', this.params.fullUrl + '.mp3', true);
    this.request.responseType = 'arraybuffer';
    this.request.addEventListener('load', function(event){
      if ( (this.status === 200) || (this.status === 302) ) {
        this.parent.loadComplete(event);
      } else {
        this.parent.loadError();
      }
    }, false);
    this.request.addEventListener('error', function(event){
//      this.parent.loadError();
    }, false);
    this.request.send();

  } else if (this.parent.parent.sound.isHowlerAudio) {
    
    var _this = this;
    
    this.sound = new Howl({
      assetObj: this,
      src: [this.params.fullUrl+'.mp3', this.params.fullUrl+'.ogg'],
      onload: function() {_this.loadComplete();},
      onloaderror: function() {_this.loadError();}
    });
  
  } else {
  
    this.domObj = document.createElement('audio');
    this.domObj.id  = this.params.id;
    this.domObj.preload  = 'auto';
    this.domObj.parent = this;
    this.domObj.addEventListener('canplay', function _loadComplete() {
  //    this.parent.loadComplete();
      this.removeEventListener('canplay', _loadComplete);
    });
    this.domObj.addEventListener('error',function(event){
      this.parent.loadError(event);
    });
  //  this.domObj.src = app.config.assetsBaseUrl + '' + this.params.url + '.' + app.sound.params.audioCodec + '?c=' + new Date().getTime();
  //  this.domObj.src = app.config.assetsBaseUrl + '' + this.params.url + '.' + app.sound.params.audioCodec;
  //  this.params.fullUrl = app.config.assetsBaseUrl + '' + this.params.url + '?c=' + new Date().getTime();
    
    this.domObj.innerHTML = '<source src="'+this.params.fullUrl+'.mp3" type="audio/mpeg"><source src="'+this.params.fullUrl+'.ogg" type="audio/ogg">';
    
    this.loadComplete();
    
  }
  
}

bg.ecard.Asset.Sound.prototype.loadComplete = function(event) {
  app.log(this,'loadComplete');
  
  this.setState([{loaded: true},{loading: false}]);
  /*
  if (this.isReload) {
    for (var i in this.reloadCallbacks) {
      this.reloadCallbacks[i][0].events.trigger(this.reloadCallbacks[0][1]);
    }
    this.reloadCallbacks = null;
    delete this.reloadCallbacks;
    return;
  }
  */
  app.sound.register(this, event);
  this.parent.events.trigger('assetLoadComplete', this);
}

bg.ecard.Asset.Sound.prototype.loadError = function(event) {
  app.log(this, 'loadError()');
  
//  app.die('ERROR loading asset '+ this.params.url);
   this.parent.events.trigger('assetLoadComplete', this);
}

bg.ecard.utils.registerJS('bg.ecard.Asset.Sound.js');