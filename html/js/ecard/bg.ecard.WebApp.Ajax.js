'use strict';
bg.ecard.WebApp.Ajax = function (parent, params) {
    console.log('bg.ecard.WebApp.Ajax()');

    this.parent = parent;
    this.params = params;
    this.params.type = "bg.ecard.WebApp.Ajax";
    this.responseObj = {};

    this.init();

}

bg.ecard.WebApp.Ajax.prototype.init = function () {
    console.log('bg.ecard.WebApp.Ajax.prototype.init()');

    if (this.req) {
        delete this.req;
    }

    this.req = new XMLHttpRequest();
    this.req.addEventListener('readystatechange', this.processResult);
    this.req.JsTarget = this;

    var request_url = this.params.url;

    this.req.open('POST', request_url, true);
    this.req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    this.req.send(this.params.data);

}

bg.ecard.WebApp.Ajax.prototype.processResult = function () {
    console.log('bg.ecard.WebApp.Ajax.prototype.processResult()');

    if (this.readyState === 4) {
        if (this.status === 200) {
            this.JsTarget.processSuccess();
        } else {
            this.JsTarget.processError();
        }
    }
}

bg.ecard.WebApp.Ajax.prototype.processSuccess = function () {
    console.log('bg.ecard.WebApp.Ajax.prototype.processSuccess()');

    var responseObj = false;
    try {
        responseObj = JSON.parse(this.req.responseText);

    } catch (err) {
        console.error('JSON parse error: ' + err);
    }

    this.responseObj = responseObj;
    if (this.params.actionSuccess && this.responseObj) {
        this.params.caller[this.params.actionSuccess](this.responseObj);
    }
}

bg.ecard.WebApp.Ajax.prototype.processError = function () {
    console.log('bg.ecard.WebApp.Ajax.prototype.processError()');
    console.error('Error with Ajax, readyState: ' + this.req.readyState + ' status: ' + this.req.status);
}
