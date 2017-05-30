'use strict';
bg.ecard.WebApp.Form = function (params, parent) {
    console.log('bg.ecard.WebApp.Form()');

    this.parent = parent;
    this.fields = {};
    this.params = params;
    this.params.type = "bg.ecard.WebApp.Form";
    this.init();
};

bg.ecard.WebApp.Form.prototype.init = function () {
    console.log('bg.ecard.WebApp.Form.prototype.init()');

    this.id = this.params.id;
    for (var prop in this.params.fields) {
        this.fields[prop] = this.params.fields[prop];
    }

    //Iterate over all DOM elements with a [formfield] attribute that are within an element with the supplied id
    var allFormFields = this.parent.params.elem.querySelectorAll(`[form-id=${this.id}] [formfield]`)
    var numberOfFormFields = allFormFields.length;

    if (numberOfFormFields) {

        for (var e = 0; e < numberOfFormFields; e++) {
            if (this.fields.hasOwnProperty(allFormFields[e].name)) { //if there is a field in the form that matches a DOMel's [name] 
                this.fields[allFormFields[e].name].contents = allFormFields[e];
            };
        };
    };
};

bg.ecard.WebApp.Form.prototype.validate = function () {
    console.log('bg.ecard.WebApp.Form.prototype.validate()');

    var checkField = function (dataToValidate, validationType) {
        var regex = ""
        switch (validationType) {
            case 'email':
                {
                    regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
                    return regex.test(dataToValidate);

                    break;
                }
            case 'password':
                {
                    regex = /(?=(.*[0-9]))(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{6,}/;
                    return regex.test(dataToValidate);

                    break;
                }
            case 'username':
                {
                    regex = /\b\w{4,}\b/;
                    return regex.test(dataToValidate);

                    break;
                }
            case 'noValidate':
                {

                    return true;

                    break;
                }
            default:
                {
                    //No such rule for validation, data cannot be validated
                    return false;
                    break;
                }
        }

    }


    for (var field in this.fields) {

        var obj = this.fields[field]

        if (!checkField(obj.contents.value, obj.validationType)) {
            alert(`The supplied ${field} is not in valid format!`);
            return false;

        }

    };

    return true;
};
