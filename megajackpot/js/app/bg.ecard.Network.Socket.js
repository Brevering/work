'use strict';
bg.ecard.Network.prototype.Socket = function(params) {
	
	this.params = params;
	this.params.type = 'bg.ecard.Network.Socket';
	
	this.eventLog = {};
  this.msgCount = 0;
  this.sndCount = 0;
	this.state = {
		ponged: true
	};
	this.reconnectCount = 0;
	
	app.log(this, 'new bg.ecard.Network.prototype.Socket()');

	this.events = new bg.ecard.EventDispatcher();

	this.init();
		
}

bg.ecard.Network.prototype.Socket.prototype.init = function() {
	app.log(this, 'init()');

	if ( !this.params.fullUrl ) {
		if (this.params.ssl) { this.params.fullUrl = 'wss://'; } else { this.params.fullUrl = 'ws://' }
		this.params.fullUrl += this.params.host + ':' + this.params.port;
	}
	
	this.bindLocalEvents();
	
	this.createNativeSocket();
	
}

bg.ecard.Network.prototype.Socket.prototype.bindLocalEvents = function() {
	app.log( this, 'bindLocalEvents()');
	
	this.events.bind('socketConnectionLost', this, 'reconnect');
}

bg.ecard.Network.prototype.Socket.prototype.createNativeSocket = function() {
	app.log( this, 'createNativeSocket()', this.params.fullUrl);
  
  this.state.connecting = true;
//  this.state.reconnecting = true;
	
	if (this.websocket) {
		this.websocket.close();
		delete this.websocket;
    delete this.state.active;
	}
	
	this.websocket = new WebSocket( this.params.fullUrl );
	this.websocket.jsParent = this;
	
	this.websocket.onopen = function(evt) { if (this.jsParent) this.jsParent.onOpen(evt) };
	this.websocket.onclose = function(evt) { if (this.jsParent) this.jsParent.onClose(evt) };
	this.websocket.onmessage = function(evt) { if (this.jsParent) this.jsParent.onMessage(evt) };
	this.websocket.onerror = function(evt) { if (this.jsParent) this.jsParent.onError(evt) };
	
  this.params.parent.getSocketsState();
  
}

bg.ecard.Network.prototype.Socket.prototype.close = function() {
	app.log( this, 'close()' );
	
	if (this.websocket) {
		this.websocket.close();
    delete this.websocket;
	}
  
  delete this.state.active;
  this.params.parent.getSocketsState();
	
}

bg.ecard.Network.prototype.Socket.prototype.onOpen = function(event) {
	app.log(this, 'onOpen()');
	
//  console.log('WS onOpen()', this.params.id);
  this.params.parent.getSocketsState();
  
	this.state.active = true;
  delete this.state.reconnecting;
  delete this.state.connecting;
	this.reconnectCount = 0;
//	app.enableInterface();
	
	this.logEvent('open');

	app.events.trigger('net.Socket.'+this.params.id+'.open', event);
	this.events.trigger('open');

	// !!!! //
	this.ping();
  
  if ((this.params.id === 'Backend') && app.state.offline) {
    this.params.parent.goOnline();
  }
	
}

bg.ecard.Network.prototype.Socket.prototype.onClose = function(event) {
	app.log(this, 'onClose()', event.code);
	
//  console.log('WS onClose()', this.params.id);
  if (this.state.reconnecting || this.state.connecting || this.state.active) {
    this.reconnect();
  }
  
   delete this.state.reconnecting;
    delete this.state.connecting;

//  delete this.state.reconnecting;
//  delete this.state.connecting;
  delete this.state.active;
  
  
  
  this.params.parent.getSocketsState();
	
	this.logEvent('close');
	app.events.trigger('net.Socket.'+this.params.id+'.close', event);

}


bg.ecard.Network.prototype.Socket.prototype.onError = function(event) {
	app.log(this, 'onError()');
	
//  console.log('WS onError()', this.params.id, event);
  
  this.logEvent('lastError');
//  app.events.trigger('socketConnectionLost', this);
  
	app.events.trigger('net.Socket.'+this.params.id+'.error', event);
	delete this.state.active;
	
  if (!this.state.reconnecting) {
//    this.reconnect();
  }

}


bg.ecard.Network.prototype.Socket.prototype.onMessage = function(event) {
	app.log(this, 'onMessage()', app.formatStrExtConsole( event.data ) );
  
//  console.log('WS receive()', this.params.id, JSON.parse(event.data));
  this.msgCount++; 
  
  delete this.state.reconnecting;
  delete this.state.connecting;
  
  this.params.parent.getSocketsState();
  
  /*
	if (!this.state.active) {
		this.state.active = true;
		this.reconnectCount = 0;
		app.enableInterface();
		this.ping();
	}
  */
  
	this.logEvent('lastMessage');
	app.events.trigger('net.Socket.'+this.params.id+'.message', event.data, this.params.id);
	
	var eventDataObj = JSON.parse(event.data);
	
	if ( eventDataObj.PONG ) {
		this.state.ponged = true;
	}
	
}

bg.ecard.Network.prototype.Socket.prototype.send = function(dataToSend) {
	app.log(this, 'send()', app.formatStrExtConsole( dataToSend) );
  
//  console.log('WS send()', this.params.id, JSON.parse(dataToSend));
  
  if (this.params.msgPrefix) {
    dataToSend = JSON.parse(dataToSend);
    dataToSend._PREFIX = this.params.msgPrefix;
    dataToSend = JSON.stringify(dataToSend);
  }
  
  if (this.websocket.readyState === 1) {
    this.state.active = true;
  }
	
	if (!this.state.active) {
    if (!this.params.silentFail) {
		  app.die({errorId: 'Trying to send message on inactive socket', elementName: 'Socket: ' + this.params.id + ' ('+ this.websocket.readyState +')'});
    }
		return;
	}
  
  this.sndCount++;
	
	this.logEvent('lastSend');
	app.events.trigger('net.Socket.'+this.params.id+'.send', dataToSend);

	if (this.websocket) {
		if ( this.websocket.readyState === 1 ) {
			this.websocket.send(dataToSend);
		} else {
			if (!this.params.parent.params.closeSockets) {
		
//				app.events.trigger('socketConnectionLost', this);
//				this.events.trigger('socketConnectionLost');	
				
	//			this.reconnect();
//				app.die({errorId: 'Trying to send message on inactive socket', elementName: 'Socket: ' + this.params.id + ' ('+ this.websocket.readyState +')'});
			}
		}
	} else {
		app.die({errorId:'Websocket not created', elementName: ''+this.params.id})
	}
  
  this.params.parent.getSocketsState();
	
}

bg.ecard.Network.prototype.Socket.prototype.reconnect = function( lastMessage ) {
	app.log( this, 'reconnect()', this.reconnectCount );
	
  if (this.state.connecting) {
//    return;
  }
  
//  console.log('WS reconnect()', this.params.id);
  delete this.state.active;
//  app.events.trigger('socketConnectionLost', this);
  
  if (this.websocket) {
		this.websocket.close();
		delete this.websocket;
	}
  
	if ( lastMessage ) {
		this.lastMessage = lastMessage;
		this.events.bind('open', this, 'sendLastMessage', true);
	}
	
	if ( this.pingTimeout ) {
		this.clearPing();
//    this.state.active = false;
    
	}
	
	if (this.reconnectCount < this.params.retryCount) {
		
		this.reconnectCount++;
		if (!this.eventLog['open'] && !this.params.silentReconnect) {
			app.events.trigger('noSocketConnection', this);
		}
	   
    delete this.state.reconnecting;
    delete this.state.connecting;
		app.time.setTimeout(this, 'createNativeSocket', this.params.reconnectTimeout);
//    
		
	} else {
		
		delete this.state.active;
		delete this.state.reconnecting;
    delete this.state.connecting;
    delete this.state.active;
    this.state.aborted = true;
    
    if (!this.params.silentFail) {
      if (this.eventLog['open']) {
        app.events.trigger('socketConnectionLost', this);
      } else {
        app.events.trigger('noSocketConnection', this);
      }
    }
	}
  
  this.params.parent.getSocketsState();
	
}

bg.ecard.Network.prototype.Socket.prototype.logEvent = function(eventId, eventTime) {
//	app.log( this, 'logEvent', eventId, eventTime );
	
	if (!eventTime) {
    eventTime = new Date();
  }
	
	this.eventLog[eventId] = eventTime;
	
}

bg.ecard.Network.prototype.Socket.prototype.ping = function() {
//	app.log( this, 'ping()' );

	if (!this.params.pingInterval) {
		return;
	}

	if ( this.state.ponged ) {
    
//		this.state.ponged = false;
    delete this.state.ponged;
		if (this.websocket) {
			this.send('{"MSG":"PING"}');
		}

		this.pingTimeout = app.time.setTimeout(this, 'ping', this.params.pingInterval);
		
	} else {
		
		this.state.ponged = true;
    
    console.log('WS ping fail', this.params.id);
    
		app.events.trigger('socketConnectionLost', this);
		this.events.trigger('socketConnectionLost');
	
	}
  
  this.params.parent.getSocketsState();
	
}

bg.ecard.Network.prototype.Socket.prototype.clearPing = function() {
	app.log( this, 'clearPing()' );
	
	app.time.clearTimeout(this.pingTimeout);
	this.state.ponged = true;
		
}

bg.ecard.Network.prototype.Socket.prototype.sendLastMessage = function() {
	app.log( this, 'sendLastMessage()', this.lastMessage);
	//console.log( 'sendLastMessage()', this.lastMessage);
	
	if (this.lastMessage) {
		this.send( this.lastMessage );
		delete this.lastMessage;
	}
	
	
}




/*

bg.ecard.Network.prototype.Socket = function(params) {
	
	this.params = params;
	this.params.type = 'bg.ecard.Network.Socket';
	
	this.eventLog = {};
	this.state = {
		ponged: true
	};
	this.reconnectCount = 0;
	
	app.log(this, 'new bg.ecard.Network.prototype.Socket()');

	this.events = new bg.ecard.EventDispatcher();

	this.init();
		
}

bg.ecard.Network.prototype.Socket.prototype.init = function() {
	app.log(this, 'init()');

	if ( !this.params.fullUrl ) {
		if (this.params.ssl) { this.params.fullUrl = 'wss://'; } else { this.params.fullUrl = 'ws://' }
		this.params.fullUrl += this.params.host + ':' + this.params.port;
	}
	
	this.bindLocalEvents();
	
	this.createNativeSocket();
	
}

bg.ecard.Network.prototype.Socket.prototype.bindLocalEvents = function() {
	app.log( this, 'bindLocalEvents()');
	
	this.events.bind('socketConnectionLost', this, 'reconnect');
}

bg.ecard.Network.prototype.Socket.prototype.createNativeSocket = function() {
	
	app.log( this, 'createNativeSocket()', this.params.fullUrl);
	
	if (this.websocket) {
		this.websocket.close();
		delete this.websocket;
	}
	
	this.websocket = new WebSocket( this.params.fullUrl );
	this.websocket.jsParent = this;
	
	this.websocket.onopen = function(evt) { if (this.jsParent) this.jsParent.onOpen(evt) };
	this.websocket.onclose = function(evt) { if (this.jsParent) this.jsParent.onClose(evt) };
	this.websocket.onmessage = function(evt) { if (this.jsParent) this.jsParent.onMessage(evt) };
	this.websocket.onerror = function(evt) { if (this.jsParent) this.jsParent.onError(evt) };
	
}

bg.ecard.Network.prototype.Socket.prototype.close = function() {
	app.log( this, 'close()' );
	
	if (this.websocket) {
		this.websocket.close();
	}
	
}

bg.ecard.Network.prototype.Socket.prototype.onOpen = function(event) {
	app.log(this, 'onOpen()');
	
	this.state.active = true;
	this.reconnectCount = 0;
//	app.enableInterface();
	
	this.logEvent('open');

	app.events.trigger('net.Socket.'+this.params.id+'.open', event);
	this.events.trigger('open')

	// !!!! //
	this.ping();
	
}

bg.ecard.Network.prototype.Socket.prototype.onClose = function(event) {
	app.log(this, 'onClose()', event.code);
	console.log(this.params.id, 'onClose()', event.code);
	
	this.logEvent('close');
	app.events.trigger('net.Socket.'+this.params.id+'.close', event);

//	this.reconnect();

}

bg.ecard.Network.prototype.Socket.prototype.onMessage = function(event) {
	app.log(this, 'onMessage()', app.formatStrExtConsole( event.data ) );

	if (!this.state.active) {
		this.state.active = true;
		this.reconnectCount = 0;
//		app.enableInterface();
		this.ping();
	}

	this.logEvent('lastMessage');
	app.events.trigger('net.Socket.'+this.params.id+'.message', event.data, this.params.id);
	
	var eventDataObj = JSON.parse(event.data);
	
	if ( eventDataObj.PONG ) {
		this.state.ponged = true;
	}
	
}

bg.ecard.Network.prototype.Socket.prototype.onError = function(event) {
	app.log(this, 'onError()');
	
	app.events.trigger('net.Socket.'+this.params.id+'.error', event);
	this.state.active = false;
	
	this.reconnect();

}

bg.ecard.Network.prototype.Socket.prototype.send = function(dataToSend) {
	app.log(this, 'send()', app.formatStrExtConsole( dataToSend) );
	
	if (!this.state.active) {
		app.die({errorId: 'Trying to send message on inactive socket', elementName: 'Socket: ' + this.params.id + ' ('+ this.websocket.readyState +')'});
		return;
	}
	
	this.logEvent('lastSend');
	app.events.trigger('net.Socket.'+this.params.id+'.send', dataToSend);

	if (this.websocket) {
		if ( this.websocket.readyState === 1 ) {
			this.websocket.send(dataToSend);
		} else {
			if (!app.network.params.closeSockets) {
		
//				app.events.trigger('socketConnectionLost', this);
//				this.events.trigger('socketConnectionLost');	
				
	//			this.reconnect();
//				app.die({errorId: 'Trying to send message on inactive socket', elementName: 'Socket: ' + this.params.id + ' ('+ this.websocket.readyState +')'});
			}
		}
	} else {
		app.die({errorId:'Websocket not created', elementName: ''+this.params.id})
	}
	
}

bg.ecard.Network.prototype.Socket.prototype.reconnect = function( lastMessage ) {
	app.log( this, 'reconnect()', this.reconnectCount );
	
	if ( lastMessage ) {
		this.lastMessage = lastMessage;
		this.events.bind('open', this, 'sendLastMessage', true);
	}
	
	if ( this.pingTimeout ) {
		this.clearPing();
	}
	
	if (this.reconnectCount < this.params.retryCount) {
		
		this.reconnectCount++;
		if (!this.eventLog['open']) {
			app.events.trigger('noSocketConnection', this);
		}
	
		app.time.setTimeout(this, 'createNativeSocket', this.params.reconnectTimeout);		
		
	} else {
		
		this.state.active = false;
		
		if (this.eventLog['open']) {
			app.events.trigger('socketConnectionLost', this);
		} else {
			app.events.trigger('noSocketConnection', this);
		}
	}
	
}

bg.ecard.Network.prototype.Socket.prototype.logEvent = function(eventId, eventTime) {
//	app.log( this, 'logEvent', eventId, eventTime );
	
	if (!eventTime) eventTime = new Date();
	
	this.eventLog[eventId] = eventTime;
	
}

bg.ecard.Network.prototype.Socket.prototype.ping = function() {
//	app.log( this, 'ping()' );

	if (!this.params.pingInterval) {
		return;
	}

	if ( this.state.ponged ) {	
		this.state.ponged = false;
		if (this.websocket) {
			this.send('{"MSG":"PING"}');
		}

		this.pingTimeout = app.time.setTimeout(this, 'ping', this.params.pingInterval);
		
	} else {
		
		this.state.ponged = true;
		app.events.trigger('socketConnectionLost', this);
		this.events.trigger('socketConnectionLost');
	
	}
	
}

bg.ecard.Network.prototype.Socket.prototype.clearPing = function() {
	app.log( this, 'clearPing()' );
	
	app.time.clearTimeout(this.pingTimeout);
	this.state.ponged = true;
		
}

bg.ecard.Network.prototype.Socket.prototype.sendLastMessage = function() {
	app.log( this, 'sendLastMessage()', this.lastMessage);
	console.log( 'sendLastMessage()', this.lastMessage);
	
	if (this.lastMessage) {
		this.send( this.lastMessage );
		delete this.lastMessage;
	}
	
	
}
*/

bg.ecard.utils.registerJS('bg.ecard.Network.Socket.js');