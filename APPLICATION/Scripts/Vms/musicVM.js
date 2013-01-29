define(["jqueryui", "ko", "Vms/viewBase"], function (jqueryui, ko, viewBase) {
       
    function MusicVM(viewName) {
        var self = this;

        self.setName(viewName);

        // Properties
        // nothing yet
        
        
        // Behavior
        self.goToMain = function() {
            self.activateView("main");
        };
    };

    MusicVM.prototype = new viewBase();
        
    return MusicVM;
})