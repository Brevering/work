/*global bg, console, document*/
'use strict';

bg.ecard.WebApp.InputManager = function (params, parent) {
    console.log('bg.ecard.WebApp.InputManager(params, parent)');

    this.parent = parent;
    this.elements = {};
    this.params = params;

    this.init();

};

bg.ecard.WebApp.InputManager.prototype.attachBrowserEvents = function () {
    console.log('bg.ecard.WebApp.InputManager.prototype.attachBrowserEvents()');

    window.addEventListener('mousedown', this.uiEventDown);
    window.addEventListener('mousemove', this.uiEventMove);
    window.addEventListener('mouseup', this.uiEventUp);
};

bg.ecard.WebApp.InputManager.prototype.uiEventDown = function (event) {
    console.log(this, 'uiEventDown()');

};

bg.ecard.WebApp.InputManager.prototype.uiEventMove = function (event) {
    console.log(this, 'uiEventMove()');

    event.preventDefault();
};

bg.ecard.WebApp.InputManager.prototype.uiEventUp = function (event) {
    console.log(this, 'uiEventUp()');

    event.preventDefault();
};
