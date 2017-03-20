'use strict';
bg.ecard.Network = function(params, parent) {
  
	this.params = params;
  this.params.id = 'network';
  this.params.type = 'bg.ecard.Network';
	this.parent = parent;
  
	this.active = {
		socket: {},
    ajax: {}
	};
	
	this.req = {};
	
  app.log( this, 'new bg.ecard.Network');
  
	//app.events.bind('socketConnectionLost', this, 'socketConnectionLost');
	//app.events.bind('noSocketConnection', this, 'noSocketConnection');
	
	
	this.init();
  
//  app.events.trigger('networkReady');
	
}

bg.ecard.Network.prototype.init = function() {
	app.log(this, 'init()');
	
  this.createSockets();
  app.events.trigger('networkReady');
//	this.loadConfig();
	
}

bg.ecard.Network.prototype.loadConfig = function() {
	app.log( this, 'loadConfig()' );

	this.req.config = new this.ajax({
		url: _App.config.url.config,
		caller: this,
		result: 'processConfig'
	});
	
}

bg.ecard.Network.prototype.processConfig = function(data) {
	app.log( this, 'processConfig()' );
	

	app.events.trigger( 'net.configLoaded' );

}




bg.ecard.Network.prototype.createSockets = function() {
	app.log( this, 'createSockets()' );
  
		var socketCount = 0;
		for (var i in app.config.websocket) {			
			
			var socket = app.config.websocket[i];			
			
			if ( (socket.login_required && !app.user) || this.active.socket[i] ) {
				continue;
			}

			socketCount += 1;
			
			this.active.socket[i] = new this.Socket({
				socketCount: socketCount,
				id: i,
				pingInterval: socket.pingInterval,
				retryCount: socket.retryCount,
				reconnectTimeout: socket.reconnectTimeout,
				fullUrl : socket.fullUrl,
        parent: this,
			});
			
			
		}
		
}

bg.ecard.Network.prototype.closeSockets = function() {
	app.log( this, 'closeSockets()' );
	
//	this.setState('closeSockets');
	
	this.params.closeSockets = true;
	
	for (var i in this.active.socket) {
		this.active.socket[i].close();
	}
	
}


bg.ecard.Network.prototype.getSocketsState = function() {
//  app.log(this.params.id, 'getSocketsState()' );
          
  var socketsStr = '';        
  for (var i in this.active.socket) {
    var socket = this.active.socket[i];
    var cSocketState = '';
    for (var ii in socket.state) {
      cSocketState += ii + ',';
    }
    var cSocketStateWS = '--';
    if (socket.websocket) {
      cSocketStateWS = socket.websocket.readyState;
    }
    socketsStr += i +': '+ cSocketState +' ('+ cSocketStateWS + ') - ' + socket.msgCount + '/' + socket.sndCount + ' -- ' + socket.reconnectCount + '<br>';
  }
  
  if (app.interface) {
    app.interface.updateLabels({
      socketState: socketsStr
    });
  }
  
//  return socketsStr;
  
}

bg.ecard.utils.registerJS('bg.ecard.Network.js');
