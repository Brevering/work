'use strict';
var bg = bg || new Object();
bg.ecard = bg.ecard || new Object();

bg.ecard.WebApp = new Object();

bg.ecard.WebApp.core = function (params) {
    console.log('new bg.ecard.WebApp.core()');
    this.params = params;

    // task 2017-04-21 - секции
    this.sections = new bg.ecard.WebApp.SectionManager(this.params, this);
    this.events = new bg.ecard.WebApp.EventDispatcher(this);
    this.input = new bg.ecard.WebApp.InputManager(this);

    this.events.bind('button:toggleSection1', this, 'toggleSection1');
    this.events.bind('button:toggleSection2', this, 'toggleSection2');
    this.events.bind('button:toggleSection3', this, 'toggleSection3');
    this.events.bind('button:disableSection1', this, 'disableSection1');
    this.events.bind('button:enableSection1', this, 'enableSection1');

    // task 2017-05-10 - Ajax
    this.requests = {};
    this.config = {};
    this.loadConfig();

    // task 2017-05-12 - Forms
    this.events.bind('button:submitForm', this, 'submitForm');

};

bg.ecard.WebApp.core.prototype.getAppId = function () {
    console.log('bg.ecard.WebApp.core.prototype.getAppId()');
    return this.params.appId;
};

bg.ecard.WebApp.core.prototype.setAppId = function (newAppId) {
    console.log('bg.ecard.WebApp.core.prototype.setAppId()');
    if (typeof newAppId === 'string') {
        this.params.appId = newAppId;
    }
};

bg.ecard.WebApp.core.prototype.loadSection = function (sectionToLoad) {
    console.log('bg.ecard.WebApp.core.prototype.loadSection()');
    this.sections.load(sectionToLoad);
};

bg.ecard.WebApp.core.prototype.toggleSection1 = function () {
    console.log('bg.ecard.WebApp.core.prototype.toggleSection1()');
    this.loadSection('section1');
}

bg.ecard.WebApp.core.prototype.toggleSection2 = function () {
    console.log('bg.ecard.WebApp.core.prototype.toggleSection2()');
    this.loadSection('section2');
}

bg.ecard.WebApp.core.prototype.toggleSection3 = function () {
    console.log('bg.ecard.WebApp.core.prototype.toggleSection3()');
    this.loadSection('section3');
}

bg.ecard.WebApp.core.prototype.disableSection1 = function () {
    console.log('bg.ecard.WebApp.core.prototype.disableSection1()');
    this.events.disable('button:toggleSection1');
}

bg.ecard.WebApp.core.prototype.enableSection1 = function () {
    console.log('bg.ecard.WebApp.core.prototype.enableSection1()');
    this.events.enable('button:toggleSection1');
}

bg.ecard.WebApp.core.prototype.loadConfig = function () {
    console.log('bg.ecard.WebApp.core.prototype.loadConfig()');

    this.requests.loadConfig = new bg.ecard.WebApp.Ajax(this, {
        url: "config.json",
        caller: this,
        actionSuccess: "processConfig",
        data: "",
    });
}

bg.ecard.WebApp.core.prototype.processConfig = function (data) {
    console.log('bg.ecard.WebApp.core.prototype.processConfig()');

    this.requests.processConfig = new bg.ecard.WebApp.Ajax(this, {
        url: "loadConfig.php",
        caller: this,
        actionSuccess: "showConfig",
        data: `json=${JSON.stringify(data)}`,
    });
}

bg.ecard.WebApp.core.prototype.showConfig = function (data) {
    console.log('bg.ecard.WebApp.core.prototype.showConfig()');
    console.error("Config file successfully read!");
    this.config.params = data;

    for (var name in this.config.params) {
        if (this.params.hasOwnProperty(name)) {
            if (this.params[name] != this.config.params[name]) {
                this.params[name] = this.config.params[name];
                console.error(`Changing value of ${name}!`)
            }
        } else {
            this.params[name] = this.config.params[name];
            console.error(`Adding ${name} to app.params!`)
        }
    }
}

bg.ecard.WebApp.core.prototype.submitForm = function (btn_DOM_Object) {
    console.log('bg.ecard.WebApp.core.prototype.submitForm()');

    if (this.sections.params.activeSection.forms) {

        var activeFormId = btn_DOM_Object.parentNode.attributes.getNamedItem("form-id").nodeValue;

        var activeForm = this.sections.params.activeSection.forms.filter(function (el) {
            if (el.id === activeFormId) {
                return true;
            }
        })[0];

        if (!activeForm.updatedParams) {
            activeForm.updatedParams = {};
        }

        var timesSubmitted = activeForm.updatedParams.timesSubmitted || 0;
        timesSubmitted += 1;


        this.sections.params.activeSection.updateForm(activeFormId, {
            "timesSubmitted": timesSubmitted
        });

        var validity = activeForm.validate();
        if (validity) {
            var payload = {};
            for (var elem in activeForm.fields) {
                var obj = activeForm.fields[elem].contents.value;
                payload[elem] = obj.value || obj;
            }


            this.requests.submitForm = new bg.ecard.WebApp.Ajax(this, {
                url: "submitForm.php",
                caller: this,
                actionSuccess: "processFormSubmit",
                data: `json=${JSON.stringify(payload)}`,
            });
        }
    }
}

bg.ecard.WebApp.core.prototype.processFormSubmit = function (data) {
    console.log('bg.ecard.WebApp.core.prototype.processFormSubmit()');

    alert(data.result);
    if (data.user_logged) {
        this.params.user_logged = 1;
    }
}

bg.ecard.WebApp.core.prototype.extendClass = function (source, target, skipInitClass) {
    console.log('bg.ecard.WebApp.core.prototype.extendClass()');

    if (!source.prototype.params) {
        console.error("This class cannot be extended!")
    }

    for (var i in source.prototype) {
        if (!target[i]) {
            target[i] = source.prototype[i];
        }
    }

    if (!target.params.extendedFrom) {
        target.params.extendedFrom = new Array(source.prototype.params.type);
    }
    target.params.extendedFrom.push()

    if (!skipInitClass) {
        if (target.initClass) {
            target.initClass();
        }
    }

}
