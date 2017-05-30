'use strict';
bg.ecard.WebApp.SectionLogin = function (id, parent) {
    console.log('bg.ecard.WebApp.SectionLogin()');

    this.params = {
        id: id,
        elem: document.getElementById(id),
    };
    this.params.type = "bg.ecard.WebApp.SectionLogin";
    this.parent = parent;

    this.requests = {};

    bg.ecard.WebApp.core.prototype.extendClass(bg.ecard.WebApp.Section, this);

    this.init();
    this.initForms();

}




bg.ecard.WebApp.SectionLogin.prototype.initForms = function () {
    console.log('bg.ecard.WebApp.SectionLogin.prototype.prepareForms()');

    //Look for elements with a [is-form] attribute in the DOM and create a form for each
    var formsInElement = this.params.elem.querySelectorAll("[form-id]"); //Array of all forms
    for (var e = 0; e < formsInElement.length; e++) {

        var fieldArr = formsInElement[e].querySelectorAll("[formfield]"); //Array of all fields in form
        var formData = {};
        formData.fields = {};

        for (var i = 0; i < fieldArr.length; i++) {
            formData.fields[fieldArr[i].name] = {
                validationType: `${fieldArr[i].name}` // set validation type for every field
            }
        }

        formData.id = formsInElement[e].attributes.getNamedItem("form-id").nodeValue;

        formData.fields.secretString = {
            validationType: "noValidate",
            contents: {
                value: "This is my secret string"
            }
        };

        this.createForm(formData);
    }
}
