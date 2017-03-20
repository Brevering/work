'use strict';
var bg = bg || new Object();
bg.ecard = bg.ecard || new Object();

bg.ecard.active = new Object();

bg.ecard.start = function(appToStart) {
	
	this.active.APP_NAME = appToStart.appName;
  this.active.APP_PARAMS = appToStart.appParams;

  this.filesToLoadCount = appToStart.js.length;
  this.loadedFilesCount = 0;
  for (var key in appToStart.js) {
    var fileName = appToStart.js[key];
    if(fileName.indexOf('merged_js_megajackpot') > -1) {
      bg.ecard.deactivateRegisterJs = true;
    }
  }
	
  if (this.active.APP_PARAMS.debugMode) {
    console.log('bg.ecard.start()', appToStart.appName);
  }
  
	bg.ecard.loadJSmodules(appToStart.js);
	
}

bg.ecard.loadJSmodules = function(jsModulesToLoad) {
  if (this.active && this.active.APP_PARAMS.debugMode) {
    console.log('bg.ecard.loadJSmodules()');
  }

	this.active.loadingJsList = jsModulesToLoad;
	this.active.loadingJsUrl = jsModulesToLoad[0];
	this.utils.includeJS(this.active.loadingJsUrl);
  
  this.active.loadJScountTotal = this.active.loadingJsList.length;
  this.active.loadJSdone = 0;
  
  this.active.DOMbody = document.querySelector('body');
  if (this.active.APP_PARAMS.debugMode) {
    this.active.DOMbody.className = 'app-state-debugMode';
  }
  this.active.DOMbody.setAttribute('data-app-debug-loading','зареждане на JavaScript ' + this.active.loadingJsUrl + ' (' + this.active.loadJSdone + '/' + this.active.loadJScountTotal + ')');
    
  this.active.DOMbody.setAttribute('data-app-jsLoadperc', 0 );
  
}

bg.ecard.loadNextJsModule = function() {
  
  if (bg.ecard.utils.UAParser && !window.browserEnv) {
    window.browserEnv = bg.ecard.utils.getEnvironment();
    if ( (window.browserEnv.browser.name == 'IE') && (parseInt(window.browserEnv.browser.major) < 9) ) {
      document.getElementsByTagName('body')[0].className = 'app-state-jsReady app-state-assetsReady app-state-assetsLoaded';
      document.getElementsByTagName('body')[0].innerHTML = '<div class="browser-not-supported-message"><p>Това приложение изисква актуална версия на уеб-браузъра Ви.<br>Вашата версия ('+window.browserEnv.browser.name+' - ' + window.browserEnv.browser.version + ') не се поддържа.<br>Моля, обновете уеб-браузъра, за да продължите.<p></div>';
      return;
    }
    
    
    if (document.location.href.indexOf('skipMobileCheck') < 0) {
      if (
        (window.browserEnv.device.type == 'mobile') || 
        (window.browserEnv.device.type == 'tablet') || 
        (window.browserEnv.ua.indexOf('mobile') >= 0) || 
        (window.browserEnv.ua.indexOf('Mobile') >= 0) 
      ) {
        document.getElementsByTagName('body')[0].className = 'app-state-jsReady app-state-assetsReady app-state-assetsLoaded';
        document.getElementsByTagName('body')[0].innerHTML = '<div class="browser-not-supported-message"><p>Извиняваме се,<br>но за момента това приложение не работи на мобилни устройства.<p>Ако не бъдете прехвърлени автоматично, моля, натиснете <a href="/mega_jackpot/mobile/">ТУК</a>.</div>';
        document.location.href = '/mega_jackpot/mobile/';
        return;
      }
    }
    
  }
  
  
  
	this.active.loadingJsList.splice(this.active.loadingJsId, 1);
	
	this.active.loadingJsUrl = this.active.loadingJsList[0];
	
	if (this.active.loadingJsUrl) {
		this.utils.includeJS(this.active.loadingJsUrl);
    this.active.loadJSdone++;
    this.active.DOMbody.setAttribute('data-app-debug-loading','зареждане на JavaScript ' + this.active.loadingJsUrl + ' (' + this.active.loadJSdone + '/' + this.active.loadJScountTotal + ')');
  
    
  } else {
    this.active.loadJSdone++;
    this.active.DOMbody.setAttribute('data-app-debug-loading','');
    this.active.DOMbody.className = this.active.DOMbody.className + ' app-state-jsReady';
//    console.clear();
    if (this.active.APP_PARAMS.debugMode) {
      console.info('\n\n -- '+this.active.APP_NAME+' start --\n\n');
    }
    // bg.ecard[this.active.APP_NAME].start(this.active.APP_PARAMS);
	}
	this.active.DOMbody.setAttribute('data-app-jsLoadperc', Math.round((this.active.loadJSdone / this.active.loadJScountTotal)*100) );
}

bg.ecard.utils = new Object();

bg.ecard.utils.extendClass = function( source, target, skipInitClass ) {
	//console.log('bg.ecard.classExted()', source.prototype.params.type, target.params.type);
  if (app) {
    app.log( this, 'bg.ecard.classExted()', target.params.type, 'extends', source.prototype.params.type);
  }
	
  for (var i in source.prototype) {
    if (!target[i]) {
      target[i] = source.prototype[i];
    }
  }
  
  if (!target.params.extendedFrom) {
    target.params.extendedFrom = new Array(source.prototype.params.type);
  }
  target.params.extendedFrom.push()
  
  if (!skipInitClass) {
    if (target.initClass) {
      target.initClass();
    }
  }
  
}

bg.ecard.utils.includeJS = function( jsUrl ) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  document.getElementsByTagName('body')[0].appendChild(script);
  script.onload = function () {
    bg.ecard.loadedFilesCount++;
    if(bg.ecard.loadedFilesCount === bg.ecard.filesToLoadCount) {
      bg.ecard.active.DOMbody.setAttribute('data-app-debug-loading','');
      bg.ecard.active.DOMbody.className = bg.ecard.active.DOMbody.className + ' app-state-jsReady';
      if (bg.ecard.active.APP_PARAMS.debugMode) {
        console.info('\n\n -- '+bg.ecard.active.APP_NAME+' start --\n\n');
      }
      bg.ecard[bg.ecard.active.APP_NAME].start(bg.ecard.active.APP_PARAMS);
    }
  }
  script.src = jsUrl;  

	
}

bg.ecard.utils.registerJS = function( jsUrl ) {
  if(bg.ecard.deactivateRegisterJs && jsUrl.indexOf('ua-parser') === -1) {
    return;
  }
    
  if (bg.ecard.active && bg.ecard.active.APP_PARAMS.debugMode) {
	 console.log('bg.ecard.registerJS()', jsUrl);
  }
	
	bg.ecard.loadNextJsModule();
	
}

bg.ecard.utils.setState = function(target, states) {
  
  for (var i in states) {
    var state = states[i];
    for (var ii in state) {
      target.state[ii] = state[ii];
      //console.log('state' , ii, state[ii]);
    }
  }
  
}

bg.ecard.utils.getEnvironment = function() {
  
  var env = bg.ecard.utils.UAParser();
  
  env.screen = {
    res: window.screen.availWidth + 'x' + window.screen.availHeight 
  }
  
  return env;
}

bg.ecard.utils.formatStrExtConsole = function(logStr) {
	
	return decodeURIComponent(logStr).replace(/:/g,': ').replace(/,/g,', ').replace(/(\r\n|\n|\r)/gm,'').replace(/\s\s+/g, ' ');
	
}

bg.ecard.utils.showDebugInfo = function(debugParams) {
    
  var debugStr = new String();
  
  if (typeof debugParams === 'object') {
    for (var i in debugParams) {
      if (i !== 'debugType') {
        debugStr += i + ': ' + debugParams[i] + ' :: ';
      }
    }
  } else {
    debugStr = debugParams;
  }
  
  bg.ecard.active.DOMbody.setAttribute('data-app-debug-'+debugParams.debugType, debugStr);
  
}

Number.prototype.formatCurrency = function(c, d, t){
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};