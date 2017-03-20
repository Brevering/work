'use strict';
bg.ecard.AssetManager = function(parent) {
  
  this.params = {
    type: 'bg.ecard.AssetManager',
    id: 'assets',
    parallelDownloads: 6
  }
  this.parent = parent;
  app.log(this, 'new bg.ecard.AssetManager');
  
  this.active = new Object();
  
  this.state = new Object({
    parallelDownloads: 0
  });
  this.assetsList = new Object();
  this.assetsListToLoad = new Array();
  
  this.events = new bg.ecard.EventDispatcher(this);
  this.events.bind('assetLoadComplete', this, 'assetLoadComplete');
  
  app.events.bind('assets.loadAll', this, 'loadAllAssets');
  
  app.events.trigger('assetsManagerReady');
  app.interface.setState('assetsReady');
}

bg.ecard.AssetManager.prototype.load = function(assetsToLoad, target) {
  app.log(this, 'load()');
  
  this.active.loadTarget = target;
  
  if (assetsToLoad.length === 0) {
    this.active.loadTarget.events.trigger('assetsLoadComplete');
    app.holder.main.setState('assetsLoaded');
    return;
  }
  
  for (var i=0; i<assetsToLoad.length; i++) {
    var currAsset = new bg.ecard.Asset[assetsToLoad[i].assetType](assetsToLoad[i], this);
    this.assetsList[assetsToLoad[i].id] = currAsset;
    this.assetsListToLoad.push(currAsset);
  }
  
  this.startLoading();
  
}

bg.ecard.AssetManager.prototype.assetLoadComplete = function(asset) {
  app.log(this, 'assetLoadComplete()', asset.params.id);
  
  for (var i in this.assetsListToLoad) {
    if (this.assetsListToLoad[i].params.id === asset.params.id) {
      this.assetsListToLoad.splice(i, 1);
      break;
    }
  }
  
  this.active.assetsLoadedCount++;
  this.state.parallelDownloads--;
  if (this.assetsListToLoad.length) {
    this.startLoading();
  } else {
    this.active.loadTarget.events.trigger('assetsLoadComplete');
    this.active.loadTarget = null;
    delete this.active.loadTarget;
    
//    app.displays.params.mainWindow.setData('app-debug-loading', '');
    app.debugLoading({Assets: 'done'});
    app.holder.main.setState('assetsLoaded');
    //console.log('assetsLoaded', this.active.loadTarget);
  }
  app.holder.main.setData({'app-assetsloadperc': Math.round((this.active.assetsLoadedCount / this.active.assetsToLoadTotal)*100) });
}

bg.ecard.AssetManager.prototype.startLoading = function() {
  app.log(this, 'startLoading()', this.state.parallelDownloads);
  
  //this.state.parallelDownloads = 0;
  if (!this.active.assetsToLoadTotal) {
    this.active.assetsLoadedCount = 0;
    this.active.assetsToLoadTotal = this.assetsListToLoad.length;
  }
  
  for (var i in this.assetsListToLoad) {    
    
    if (!this.assetsListToLoad[i].state.loaded && !this.assetsListToLoad[i].state.loading) {
      this.assetsListToLoad[i].load();
      this.state.parallelDownloads++;
    }
        
    if (this.state.parallelDownloads === this.params.parallelDownloads) {
      break;
    }
    
  }
  
  app.debugLoading({Assets: ' | зареждане на ресурси (' + this.active.assetsLoadedCount + '/' + this.active.assetsToLoadTotal + ')'});
  app.holder.main.setData({'app-assetsloadperc': '0' });

//  app.displays.params.mainWindow.setData('app-debug-loading', ' | зареждане на ресурси (' + this.active.assetsLoadedCount + '/' + this.active.assetsToLoadTotal + ')');
  
  
}

bg.ecard.AssetManager.prototype.get = function(assetId) {
  app.log(this, 'get()', assetId);
  
  //console.log(this.params.id, 'get()', assetId);
  if (this.assetsList[assetId]) {
    return this.assetsList[assetId];
  } else {
    app.die('Trying to get missing asset : '+assetId);
  }
    
}

bg.ecard.AssetManager.prototype.updateAssetsResolution = function() {
  app.log(this, 'updateAssetsResolution()');
  
  for (var i in app.active.sprites) {
   app.active.sprites[i].reloadAsset();    
  }
  
}

bg.ecard.utils.registerJS('bg.ecard.AssetManager.js');