'use strict';
bg.ecard.Network.prototype.Ajax = function(params) {
	this.params = params;
	this.params.type = '_App.core.net.ajax';
	this.params.id = this.params.url.url;
	this.params.sync = this.params.sync;
	
	this.inProgress = false;
	this.reconnectCount = 0;
  this.retryCount = new Number(0);

	app.log(this, 'new ajax');
	
	this.init();
	
}

bg.ecard.Network.prototype.Ajax.prototype.init = function() {
	app.log(this, 'init()');
	var _this = this;
	
	if (this.params.domEl) {
		this.params.domEl.classList.add('state-working');
	}
	
	if (this.req) {
		delete this.req;
	}
  
  
	
	this.req = new XMLHttpRequest();

	this.req.addEventListener('readystatechange', _this.processResult);
	this.req.jsTarget = this;
	
	if (!this.params.data) {
		this.params.data = 'is_ajax=1';
	} else {
		this.params.data += '&is_ajax=1';
	}

	var request_url = this.params.url.url;

// 	console.log("REQUEST URL: " + request_url);

	var clean_url = request_url.split('?',1);

// 	console.log("CLEAN: " + clean_url);

	var query = request_url.replace(clean_url, '');

	if ( !query || typeof query === 'undefined' ) {

		query = '';
	}

// 	console.log("QUERY: " + query);
 	query = query.replace(/^\?/,'');
//  	console.log("QUERY: " + query);

// 	console.log("R: " + request_url + ", clean: " + clean_url + ", q: " + query);
	var query_string = {};

	var vars = query.split("&");
	if ( !vars || typeof vars === 'undefined' ) {

		vars = '';
	}

	for (var i=0;i<vars.length;i++) {

		var pair = vars[i].split("=");
		if ( pair[0] && typeof pair[0] !== 'undefined' ) {

			this.params.data += '&' + pair[0] + '=' + decodeURIComponent(pair[1]);

			// If first entry with this name
			if (typeof query_string[pair[0]] === "undefined") {

				query_string[pair[0]] = decodeURIComponent(pair[1]);
				// If second entry with this name
			} else if (typeof query_string[pair[0]] === "string") {

				var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
				query_string[pair[0]] = arr;
				// If third or later entry with this name
			} else {

				query_string[pair[0]].push(decodeURIComponent(pair[1]));
			}
		}
	}

	this.req.open('post', clean_url + '?ts=' + new Date().getTime(), true);

	this.req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");	
	this.inProgress = true;
	app.interface.setState('ajax-active');
	this.req.send( this.params.data );
	
	app.log( this, 'send()', app.formatStrExtConsole( this.params.data ) );
  if (app.params.debugMode) {
    app.debugLoading({Ajax: this.params.url.url});
  }
	
}

bg.ecard.Network.prototype.Ajax.prototype.resend = function() {
	app.log( this, 'resend()' );
	
	if (this.retryCount < this.params.url.retryCount) {
//		app.warn({errorId:'', elementName:'AJAX returned error '+this.req.status+', resend() triggered'});
		this.retryCount++;
		app.time.setTimeout(this, 'init', this.params.url.retryTimeout);
	} else {
    app.sections.load(app.config.sections['NetworkError']).interface.updateLabels(this.params.url);
//		app.clearWarn();
//		this.processError();
	}

}

bg.ecard.Network.prototype.Ajax.prototype.processResult = function() {
//	app.log( this.jsTarget, 'processResult()', this.readyState );
	
	if (this.readyState === 4) {
		if ( (this.status === 200) || (this.status === 302) ) {
			this.jsTarget.processSuccess();
		} else {
			this.jsTarget.processError();
		}		
	}
	
}

bg.ecard.Network.prototype.Ajax.prototype.processError = function() {
	app.log( this, 'processError()' );
	
  console.log(this.params.id, 'ERROR', this.params.url.retryCount);
  if (app.params.debugMode) {
    app.debugLoading({Ajax: this.params.url.url + ' ERROR: ' + this.req.status + ' (' + this.retryCount + ')'});
  }
  
  //app.die({errorId: 'network error ' + this.req.status , elementName: this.params.url});
  this.inProgress = false;
  app.interface.removeState('ajax-active');
  
  this.params.url.lastReqState = this.req.status;
  this.resend();
  
}

bg.ecard.Network.prototype.Ajax.prototype.processSuccess = function() {
	app.log( this, 'processSuccess()', app.formatStrExtConsole( this.req.responseText ) );
//	app.log( this, 'processSuccess()', this.req.responseText );
	
	var responseObj = JSON.parse( this.req.responseText );
	this.responseObj = responseObj;
	
	if (!responseObj) {
		app.die({errorId: 'JSON parse error'});
	}
  
  if (app.config.is_web_game == 1) {
    if (responseObj.CONSTANT_PARAMS && (responseObj.CONSTANT_PARAMS.IS_LOGGED == 0)) {
      app.restartGame();    
    }
  }
	
  if (responseObj.FATAL_ERROR) {
//    app.die({errorName: 'NETWORK RESPONCE - FATAL ERROR' ,errorId: responseObj.FATAL_ERROR});
    app.debugLoading({
      AjaxError: responseObj.FATAL_ERROR,
    })
  }
  
  this.inProgress = false;
  
  if (responseObj.REQUIRE_LOGIN || responseObj.REDIRECT_URL) {
    app.sections.load(app.config.sections['NetworkError']).interface.updateLabels({
      errorTitle: 'Изтекла сесия',
      errorText: 'Поради проблем с връзката към сървъра, сесията Ви изтече.',
      lastReqState: 'session_expired',
    });
  } else {
    this.params.caller[this.params.result]( responseObj );
  }
  
  if (app.params.debugMode) {
    app.debugLoading({Ajax: ''});
  }
  
  app.interface.removeState('ajax-active');
}

bg.ecard.utils.registerJS('bg.ecard.Network.Ajax.js');