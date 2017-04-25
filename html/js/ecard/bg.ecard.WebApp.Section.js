'use strict';
bg.ecard.WebApp.Section = function (id, parent) {
    console.log('bg.ecard.WebApp.Section = function(id)');
    this.params = {
        id: id,
        elem: document.getElementById(id)
    };
    this.parent = parent;
    this.init();
};

bg.ecard.WebApp.Section.prototype.init = function () {
    console.log('bg.ecard.WebApp.Section.prototype.init = function()');

    this.params.initialVisibility = this.params.elem.style.visibility;
    this.hide();
};

bg.ecard.WebApp.Section.prototype.hide = function () {

    console.log('bg.ecard.WebApp.Section.prototype.hide = function()');

    this.params.elem.style.visibility = 'hidden';
};

bg.ecard.WebApp.Section.prototype.show = function () {

    console.log('bg.ecard.WebApp.Section.prototype.show = function()');

    this.params.elem.style.visibility = this.params.initialVisibility;
};
