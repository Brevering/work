'use strict';
bg.ecard.Console = function() {
	this.params = {
		id: 'console',
		type: 'bg.ecard.Console',
		def: {logLevel:0},
		active: {},
		prev: {}
	};
	
	this.history = [];
	
	app.log = this.log;
	this.logLevel = 7;
	
//  this.alertModule = ['bg.ecard.SoundManager','bg.ecard.SoundManagerWebAudio','bg.ecard.SoundManagerHowler','bg.ecard.Asset.Sound'];
//  this.filterModule = ['bg.ecard.Time','bg.ecard.Time.Timeout','bg.ecard.Time.Timer' ];
	this.filterModule = false;
//  this.filterModule = ['bg.ecard.SoundManager','bg.ecard.SoundManagerWebAudio','bg.ecard.Asset.Sound'];
//	this.filterModule = ['bg.ecard.SoundManager'];
  this.blackListFunctions = ['processTimeouts()','trigger()','bind()','unbind()'];
//		this.filterId = ['_App.core.eventDispatcher'];
	this.externalLog = {type:'net.socket', id:'Printer'};

}

bg.ecard.Console.prototype.setLogLevel = function( logLevel ) {
	this.logLevel = logLevel;
	
}

bg.ecard.Console.prototype.log = function() {
	
	//console.log( '--this', this.params, arguments);
	
	//return;
	if (!app.params.debugMode) {
		return;
	}
	
	if (!app.params.debugMode) {
		if (arguments[0].params.type != app.console.externalLog.type) {
			return;
		}
	}

	
	var now = [];
	
	//app.console.history.push( now.concat( Array.prototype.slice.call(arguments) ) );
	if (app.console.filterModule) {
		var shouldLog = false;
	} else {
		var shouldLog = true;
	}

	var strToLog = new String();
	
	if (app.console.filterModule) strToLog += '[f] ';
	
	var prefix = ' ';
	var elemLogLevel = 0;	
	
	for (var i=0; i < arguments.length; i++) {
		if (i == 0) {
			if (arguments[i].params) {
							
				if (app.console.filterModule) {
					if (app.console.filterModule.indexOf(arguments[i].params.type) >= 0) shouldLog = true;
					
					if (arguments[i].parent) {
						if (app.console.filterModule.indexOf(arguments[i].parent.params.type) >= 0) shouldLog = true;				
						prefix += '.';
						elemLogLevel++;
						if (arguments[i].parent.parent) {
							if (app.console.filterModule.indexOf(arguments[i].parent.parent.params.type) >= 0) shouldLog = true;				
							prefix += '.';
							elemLogLevel++;
							if (arguments[i].parent.parent.parent) {
								if (app.console.filterModule.indexOf(arguments[i].parent.parent.parent.params.type) >= 0) shouldLog = true;				
								prefix += '.';
								elemLogLevel++;
								if (arguments[i].parent.parent.parent.parent) {
									if (app.console.filterModule.indexOf(arguments[i].parent.parent.parent.parent.params.type) >= 0) shouldLog = true;				
									prefix += '.';
									elemLogLevel++;
									if (arguments[i].parent.parent.parent.parent.parent) {
										if (app.console.filterModule.indexOf(arguments[i].parent.parent.parent.parent.parent.params.type) >= 0) shouldLog = true;				
										prefix += '.';
										elemLogLevel++;
										if (arguments[i].parent.parent.parent.parent.parent.parent) {
											if (app.console.filterModule.indexOf(arguments[i].parent.parent.parent.parent.parent.parent.params.type) >= 0) shouldLog = true;				
											prefix += '.';
											elemLogLevel++;
											if (arguments[i].parent.parent.parent.parent.parent.parent.parent) {
												if (app.console.filterModule.indexOf(arguments[i].parent.parent.parent.parent.parent.parent.parent.params.type) >= 0) shouldLog = true;				
												prefix += '.';
												elemLogLevel++;
											}
										}
									}
								}
							}
						}
					}
					
				} else {
          if (arguments[i].parent) {
						prefix += '.';
						elemLogLevel++;
						if (arguments[i].parent.parent) {
							prefix += '.';
							elemLogLevel++;
							if (arguments[i].parent.parent.parent) {
								prefix += '.';
								elemLogLevel++;
								if (arguments[i].parent.parent.parent.parent) {
									prefix += '.';
									elemLogLevel++;
									if (arguments[i].parent.parent.parent.parent.parent) {
										prefix += '.';
										elemLogLevel++;
										if (arguments[i].parent.parent.parent.parent.parent.parent) {
											prefix += '.';
											elemLogLevel++;
											if (arguments[i].parent.parent.parent.parent.parent.parent.parent) {
												prefix += '.';
												elemLogLevel++;
											}
										}
									}
								}
							}
						}
					}
        }
				
				if (app.console.filterId) {
					if (app.console.filterId.indexOf(arguments[i].params.id) >= 0) {
						shouldLog = true;
					} else {
						shouldLog = false;
					}
				}
				
				if (app.console.blackListFunctions) {
					if (app.console.blackListFunctions.indexOf(arguments[1]) >= 0 ) {
						shouldLog = false;
					}
					
				}
				
//this.logLevel
				if (elemLogLevel > app.console.logLevel) {
					shouldLog = false;
					break;
				}

				
				if (app.time) if (app.time.now) strToLog += ' ' + app.time.toBasic( app.time.now() );
				strToLog += ' ' + prefix;
				strToLog += ' ';
				strToLog += '[ ' + arguments[i].params.type;
				if (arguments[i].params.id != undefined) strToLog += ' #' + arguments[i].params.id;
				strToLog += ' ] -- ';
			}
		} else {
			strToLog += arguments[i];
			if (i < arguments.length-1) {
				strToLog += ' :: ';
			}
		}
	}
	
	/*
	if (arguments[0].params.type === app.console.externalLog.type) {
		if ( (arguments[0].params.type === app.console.externalLog.type) && (arguments[0].params.id === app.console.externalLog.id) ) {
			document.getElementById('extConsoleLog').innerHTML = strToLog + '<br>' + document.getElementById('extConsoleLog').innerHTML;
		}
	}
	*/
	if (app.params.debugMode) {
		if (shouldLog) {
		  if (app.console.alertModule && arguments[0].params && app.console.alertModule.indexOf(arguments[0].params.type) >= 0) {
        console.info( strToLog );
      } else {
		    console.log( strToLog );
      }
		}
	}

}

bg.ecard.utils.registerJS('bg.ecard.Console.js');