'use strict';

bg.ecard.WebApp.InputManager = function (parent) {
    console.log('bg.ecard.WebApp.InputManager(params, parent)');

    this.parent = parent;
    this.params = {
        type: "bg.ecard.WebApp.InputManager"
    };
    this.init();

};


bg.ecard.WebApp.InputManager.prototype.init = function () {
    console.log('bg.ecard.WebApp.InputManager.prototype.init()');

    window.addEventListener('click', this.uiEventClick);

};

bg.ecard.WebApp.InputManager.prototype.uiEventClick = function (event) {
    console.log('bg.ecard.WebApp.InputManager.prototype.uiEventClick()');

    event.preventDefault();

    var domEl = event.target;

    if (domEl.dataset.type === 'btn') {

        if (domEl.dataset.target === 'app') {

            if (typeof app[domEl.dataset.action] === 'function') {
                app.events.trigger('button:' + domEl.dataset.action, domEl)
            }
        }
    };
};
