define(["pubSub", "ko"], function(pubSub, ko) {
    var viewBase = function() {
        var self = this;

        // Properties
        self.name = "noName";        
        self.isVisible = ko.observable();
        
        // behavior
        self.setName = function (name) {
            self.name = name;
        };

        self.activateView = function(viewName) {
            pubSub.pub("viewChanged", viewName);
        };
        
        pubSub.sub("viewChanged", function (viewName) {
            var visible = self.name == viewName;
            self.isVisible(visible);
        });
    };

    return viewBase;
})