'use strict';
bg.ecard.Time = function(parent) {
	this.params = {
		type: 'bg.ecard.Time',
		id: 'time'
	}
	this.parent = parent;
	app.log(this, 'new bg.ecard.Time()');
	
	this.ticks = 0;
	this.timeouts = new Array();
  this.timers = new Array();
  this.nativeTimeouts =  new Array();

  setTimeout(function(){
    app.time.initTimer();
  },10);

	//this.clockHolder = new _App.dom.domTarget('#clock');
		
	//app.setTimeout = this.setTimeout;
}


bg.ecard.Time.prototype.now = function() {
	return new Date();

}

bg.ecard.Time.prototype.nowSrv = function() {

	if (this.timeNow) {
		return this.timeNow;
	} else {
		return new Date();
	}
	
}

bg.ecard.Time.prototype.toBasic = function(dateToFormat) {
			
	return 'h:m:s:ms'.replace('h', (function(){ var h=dateToFormat.getHours(); return h<10? '0'+h:h;})())
									 .replace('m', (function() {var m = dateToFormat.getMinutes(); return m < 10 ? '0'+m : m;})()   )
									 .replace('s', (function() {var s = dateToFormat.getSeconds(); return s < 10 ? '0'+s : s;})()   )
									 .replace('ms', (function() {var ms = dateToFormat.getMilliseconds(); if (ms < 10) {return '00'+ms;} else if (ms < 100) { return '0'+ms; } else {return ms;}})())
	
}

bg.ecard.Time.prototype.toHMS = function(dateToFormat) {
	
	return 'h:m:s'.replace('h', (function(){ var h=dateToFormat.getHours(); return h<10? '0'+h:h;})())
								 .replace('m', (function() {var m = dateToFormat.getMinutes(); return m < 10 ? '0'+m : m;})()   )
								 .replace('s', (function() {var s = dateToFormat.getSeconds(); return s < 10 ? '0'+s : s;})()   )
	
}

bg.ecard.Time.prototype.toHM = function(dateToFormat) {
	return 'h:m'.replace('h', (function(){ var h=dateToFormat.getHours(); return h<10? '0'+h:h;})())
								.replace('m', (function() {var m = dateToFormat.getMinutes(); return m < 10 ? '0'+m : m;})()   )
}

bg.ecard.Time.prototype.initTimer = function() {
		
	this.tickInterval = setInterval(function(){app.time.tick();}, 1000);
	
}

bg.ecard.Time.prototype.tick = function() {
	
  this.ticks++;

	app.events.trigger('timer.1s');
	
	if (this.serverTimeSyncStart) {
		this.timeNow = new Date( this.serverTimeSyncStart );
		this.timeNow = new Date( this.timeNow.setSeconds(this.serverTimeSyncStart.getSeconds() + this.ticks) );
	}
	
	if (this.timeouts.length) {
		this.processTimeouts();
	}
	
}

bg.ecard.Time.prototype.syncClock = function(dataStr) {
	
	
//	if ( !this.serverTimeSyncStart || dataStr.indexOf('PONG') >= 0 ) {
	if ( !this.serverTimeSyncStart ) {

//		console.log( '!! syncClock()', dataStr );
		var dataObj = JSON.parse(dataStr);
	
		if (dataObj.server_time) {
			app.log( this, 'syncClock()' );
			
			this.serverTimeSyncStart = dataObj.server_time;
			var localDate = new Date();
			this.localOffset = localDate.getTimezoneOffset() * 60000;
			
			this.serverTimeSyncStart = new Date( ( ( parseInt(this.serverTimeSyncStart) ) * 1000 ) + this.localOffset  );	
			
		}
	}
	
	//	app.events.bind('timeSync', this, syncClock);

	
}

bg.ecard.Time.prototype.secondsToTime = function(secs) {
    var hours = Math.floor(secs / (60 * 60));
		if (hours < 10) hours = '0'+hours;
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
		if (minutes < 10) minutes = '0'+minutes;
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
		if (seconds < 10) seconds = '0'+seconds;

//    return hours+':'+minutes+':'+seconds;
    return minutes+':'+seconds;
}





bg.ecard.Time.prototype.setTimeout = function(caller, actionName, seconds, data) {
	app.log( this, 'setTimeout()', caller.params.type+'#'+caller.params.id, actionName, seconds );

	this.timeouts.push( new this.Timeout({id: this.timeouts.length, caller:caller, actionName:actionName, duration:seconds, data:data}) );
  var timeoutId = this.timeouts.length-1;
//  this.nativeTimeouts.push(
//    setTimeout(function(){if (app.time.timeouts[timeoutId]) {app.time.timeouts[timeoutId].trigger()};}, seconds*1000)
//  );
//  app.time.timeouts[timeoutId].nativeTimeout = setTimeout(function(){if (app.time.timeouts[timeoutId]) {app.time.timeouts[timeoutId].trigger()};}, seconds*1000);
  return timeoutId;
	
}

bg.ecard.Time.prototype.getTimeout = function(timeoutId) {
	app.log( this, 'getTimeout', timeoutId);
	
	return this.timeouts[timeoutId];	
	
}

bg.ecard.Time.prototype.clearTimeout = function( timeoutId ) {
	app.log( this, 'clearTimeout()', timeoutId);
	
	for (var i=0; i<this.timeouts.length; i++) {
		if (this.timeouts[i]) {
			if (this.timeouts[i].params.id == timeoutId) {
        clearTimeout(this.timeouts[i].nativeTimeout);
				delete this.timeouts[i];
			}
		}
	}

}

bg.ecard.Time.prototype.processTimeouts = function() {
	app.log( this, 'processTimeouts()' );
	
//  return;
  
	var hasActiveTimeout = false;
	
	for (var i=0; i<this.timeouts.length; i++) {
		if (this.timeouts[i]) {
			this.timeouts[i].setCurrTime(this.ticks);	
			hasActiveTimeout = true;
		}
	}	
	
	if (!hasActiveTimeout) {
		this.timeouts = [];
//    this.nativeTimeouts = [];
	}
	
}

bg.ecard.Time.prototype.disableTimersToggle = function() {
  app.log(this, 'disableTimersToggle()');
  
  if (this.timersDisabled) {
    this.enableTimers();
  } else {
    this.disableTimers();
  }
  
}

bg.ecard.Time.prototype.disableTimers = function() {
  app.log(this, 'disableTimers()');
  
  for (var i in this.timers) {
    this.timers[i].stop();
  }
  app.interface.setState('timersDisabled');
  this.timersDisabled = true;
}

bg.ecard.Time.prototype.enableTimers = function() {
  app.log(this, 'enableTimers()');
  
  app.interface.removeState('timersDisabled');
  this.timersDisabled = false;
  
}

bg.ecard.Time.prototype.clearTimers = function() {
  app.log(this, 'clearTimers()');

  for (var i in this.timers) {
    this.timers[i].stop();
  }

}





bg.ecard.Time.prototype.Timeout = function( params ) {
	
	this.params = params;
	this.params.type = 'bg.ecard.Time.Timeout';
//	this.params.id = params.caller.params.type+'#'+params.caller.params.id+'-'+params.actionName;
	
	this.params.startT = parseInt(app.time.ticks);
  
  this.toGo = parseFloat(params.duration) * -1;
	
	app.log( this, 'new bg.ecard.Time.prototype.Timeout()' );
  
  if (this.params.duration === 0) {
    this.trigger();
  }
	
  if (this.params.caller.params.type === 'bg.ecard.Time.Timer') {
    this.params.caller.updateTime(this.toGo);
  }
  var _timeoutId = this.params.id;
  this.nativeTimeout = setTimeout(
    function(){
      if (app.time.timeouts[_timeoutId]) {
        app.time.timeouts[_timeoutId].trigger();
      }
    },
  params.duration*1000);
	
}

bg.ecard.Time.prototype.Timeout.prototype.setCurrTime = function( currT ) {
//	app.log( this, 'setCurrTime()', currT);
	
	this.toGo = (currT-this.params.startT) - this.params.duration;
  
  if (this.params.caller.params.type === 'bg.ecard.Time.Timer') {
    this.params.caller.updateTime(this.toGo);
  }
  
	/*if (this.toGo === 0) { this.trigger(); }*/

}

bg.ecard.Time.prototype.Timeout.prototype.trigger = function() {
	app.log( this, 'trigger()' );

  this.params.caller[this.params.actionName](this.params.data);
	this.delete();
}

bg.ecard.Time.prototype.Timeout.prototype.delete = function() {
	app.log( this, 'delete()' );
	
	app.time.clearTimeout( this.params.id );

}

bg.ecard.Time.prototype.Timeout.prototype.getToGo = function() {
	app.log( this, 'getToGo()' );
	
	return this.toGo * -1;
	
}






bg.ecard.Time.prototype.Timer = function(params) {
  this.params = params;
  this.params.type = 'bg.ecard.Time.Timer';
  
  app.log(this, 'new bg.ecard.Time.Timer');
  
  app.time.timers.push(this);
  
}

bg.ecard.Time.prototype.Timer.prototype.start = function(duration) {
  app.log(this, 'start()');
  
  if (app.time.timersDisabled) {
    return;
  }
  
  if (duration) {
    this.params.duration = duration;
  }
  
  this.stop();
  
  this.timeout = app.time.setTimeout(this, 'finish', this.params.duration);
}

bg.ecard.Time.prototype.Timer.prototype.restart = function(duration) {
  app.log(this, 'restart()');
  
}

bg.ecard.Time.prototype.Timer.prototype.updateTime = function(sectondToGo) {
//  app.log(this, 'updateTime()', sectondToGo, this.params.duration);
  
  var percRem = Math.round( (sectondToGo*-1 / this.params.duration) * 100); 
  
  if (this.params.displayHolder) {
    for (var i in this.params.displayHolder) {
      if (sectondToGo) {
        this.params.displayHolder[i].html(app.time.secondsToTime(sectondToGo * -1));
        if (percRem <= 50) {
          this.params.displayHolder[i].setState('timer-50');
        }
        if (percRem <= 25) {
          this.params.displayHolder[i].removeState('timer-50');
          this.params.displayHolder[i].setState('timer-25');
        }
      } else {
        this.params.displayHolder[i].removeStates('timer-');
        this.params.displayHolder[i].html('');
      }
    }
  }
  
}

bg.ecard.Time.prototype.Timer.prototype.clearDisplay = function() {
  app.log(this, 'clearDisplay()');
  
  this.updateTime('');
}

bg.ecard.Time.prototype.Timer.prototype.finish = function() {
  app.log(this, 'finish()');
  
  this.params.caller[this.params.action]();
  
  if (this.params.displayHolder) {
    this.clearDisplay();
  }
}

bg.ecard.Time.prototype.Timer.prototype.stop = function() {
  app.log(this, 'stop()');
  
  if (this.timeout != null) {
    if (app.time.timeouts[this.timeout]) {
      app.time.timeouts[this.timeout].delete();
    }
    delete this.timeout;
  }
  if (this.params.displayHolder) {
    this.clearDisplay();
  }
}

bg.ecard.utils.registerJS('bg.ecard.Time.js');