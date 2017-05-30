'use strict';
bg.ecard.WebApp.EventDispatcher = function (parent) {

    console.log('bg.ecard.WebApp.EventDispatcher()');

    this.parent = parent;
    this.params = {
        type: "bg.ecard.WebApp.EventDispatcher"
    };
    this.elements = {};
    this.disabledEvents = {};

}

bg.ecard.WebApp.EventDispatcher.prototype.bind = function (eventType, caller, action) {
    console.log('bg.ecard.WebApp.EventDispatcher.prototype.bind()');
    if (!this.elements[eventType]) {
        this.elements[eventType] = [];
    }

    this.elements[eventType].push(new bg.ecard.WebApp.Event(this, {
        'eventType': eventType,
        'caller': caller,
        'action': action
    }));

}

bg.ecard.WebApp.EventDispatcher.prototype.unbind = function (eventType, caller, action) {
    console.log('bg.ecard.WebApp.EventDispatcher.prototype.unbind()');

    if (this.elements[eventType]) {
        var elementsCount = this.elements[eventType].length;
        for (var i = 0; i < elementsCount; i++) {
            var eventi = this.elements[eventType][i];
            if ((eventi.params.caller === caller) && (eventi.params.action === action)) {
                this.elements[eventType].splice(i, 1);
            }
        }
    }
}

bg.ecard.WebApp.EventDispatcher.prototype.trigger = function (eventType, eventParam1) {
    console.log('bg.ecard.WebApp.EventDispatcher.prototype.trigger()');

    if (this.elements[eventType]) {
        if (this.disabledEvents[eventType]) {
            //if disabled - do nothing
        } else {
            var elementsCount = this.elements[eventType].length;
            for (var i = 0; i < elementsCount; i++) {
                this.elements[eventType][i].trigger(eventParam1);
            }
        }
    }
}

bg.ecard.WebApp.EventDispatcher.prototype.disable = function (eventType) {
    console.log('bg.ecard.WebApp.EventDispatcher.prototype.disable()');

    this.disabledEvents[eventType] = true;
}

bg.ecard.WebApp.EventDispatcher.prototype.enable = function (eventType) {
    console.log('bg.ecard.WebApp.EventDispatcher.prototype.enable()');

    this.disabledEvents[eventType] = false;
}
