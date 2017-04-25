'use strict';
var bg = bg || new Object();
bg.ecard = bg.ecard || new Object();

bg.ecard.WebApp = new Object();

bg.ecard.WebApp.core = function (params) {
    console.log('new bg.ecard.WebApp.core()');
    this.params = params;

    this.sections = new bg.ecard.WebApp.SectionManager(this.params, this);

    // task 2017-04-21 - секции

    // task 2017-04-21 - секции  
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
