'use strict';
bg.ecard.WebApp.Section = function (id, parent) {
    console.log('bg.ecard.WebApp.Section()');
    this.params = {
        id: id,
        elem: document.getElementById(id),
    };
    this.params.type = "bg.ecard.WebApp.Section";

    this.parent = parent;
    this.init();
};

bg.ecard.WebApp.Section.prototype.params = {
    type: "bg.ecard.WebApp.Section"
};

bg.ecard.WebApp.Section.prototype.init = function () {
    console.log('bg.ecard.WebApp.Section.prototype.init()');

    this.params.initialDisplay = window.getComputedStyle(this.params.elem, null).getPropertyValue("display");
    this.hide();
};

bg.ecard.WebApp.Section.prototype.hide = function () {

    console.log('bg.ecard.WebApp.Section.prototype.hide()');

    this.params.elem.style.display = 'none';
};

bg.ecard.WebApp.Section.prototype.show = function () {

    console.log('bg.ecard.WebApp.Section.prototype.show()');

    this.params.elem.style.display = this.params.initialDisplay;
};

bg.ecard.WebApp.Section.prototype.createForm = function (data) {
    console.log('bg.ecard.WebApp.Section.prototype.createForm()');

    if (!this.forms) {
        this.forms = [];
    };
    var dataToPassToForm = {};

    //Do something with incoming parameters if necessary
    dataToPassToForm = data;

    this.forms.push(new bg.ecard.WebApp.Form(dataToPassToForm, this));
};

bg.ecard.WebApp.Section.prototype.updateForm = function (formId, data) {
    console.log('bg.ecard.Webapp.Section.prototype.updateForm()');

    if (this.forms) {

        var formToUpdate = this.forms.filter(function (el) {
            if (el.id === formId) {
                return true;
            }
        })[0];

        formToUpdate.updatedParams = data;

    }
}
