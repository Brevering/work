'use strict';

bg.ecard.WebApp.SectionManager = function (sectionsObj, parent) {
    console.log('bg.ecard.WebApp.SectionManager(sections)');

    this.parent = parent;
    this.elements = {};
    this.params = {
        inputParam: sectionsObj,
        activeSection: {}
    };
    this.params.type = "bg.ecard.WebApp.SectionManager";

    this.init();

};

bg.ecard.WebApp.SectionManager.prototype.init = function () {
    console.log('bg.ecard.WebApp.SectionManager.prototype.init()');

    for (var i in this.params.inputParam.sections) {

        var key = this.params.inputParam.sections[i];

        //TODO: Fix this hardcoded section init. Flag in the HTML?
        if (key === "section2") {
            this.elements[key] = new bg.ecard.WebApp.SectionLogin(key, this);
        }
        if (!this.elements[key]) {
            this.elements[key] = new bg.ecard.WebApp.Section(key, this);

        }
    }
    var defSectionId = this.elements[this.params.inputParam.defSection].params.id

    this.params.activeSection = this.elements[this.params.inputParam.defSection];
    this.showSection(this.params.activeSection);
}

bg.ecard.WebApp.SectionManager.prototype.load = function (sectionToLoadId) {
    console.log('bg.ecard.WebApp.SectionManager.prototype.load()');

    var sectionToLoad = this.getSectionById(sectionToLoadId);
    if (sectionToLoad && (sectionToLoad !== this.params.activeSection)) {
        this.hideSection(this.params.activeSection);
        this.params.activeSection = sectionToLoad;
        this.showSection(sectionToLoad);
    }
}

bg.ecard.WebApp.SectionManager.prototype.getSectionById = function (id) {
    console.log('bg.ecard.WebApp.SectionManager.prototype.getSectionById()');
    return this.elements[id] || 0;
}

bg.ecard.WebApp.SectionManager.prototype.showSection = function (sectionToShow) {
    console.log('bg.ecard.WebApp.SectionManager.prototype.showSection()');

    sectionToShow.show();
}

bg.ecard.WebApp.SectionManager.prototype.hideSection = function (sectionToHide) {
    console.log('bg.ecard.WebApp.SectionManager.prototype.hideSection()');

    sectionToHide.hide();
}
