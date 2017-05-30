'use strict';
bg.ecard.WebApp.Event = function (parent, params) {

    console.log('bg.ecard.WebApp.Event()');

    this.parent = parent;
    this.params = params;
    this.params.type = "bg.ecard.WebApp.Event";
}

bg.ecard.WebApp.Event.prototype.trigger = function (eventParam1) {
    console.log('bg.ecard.WebApp.Event.prototype.trigger()');

    if (typeof (this.params.caller[this.params.action]) === 'function') {

        this.params.caller[this.params.action](eventParam1);
    }
}
