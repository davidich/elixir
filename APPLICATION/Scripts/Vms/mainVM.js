define(["ko", "Vms/viewBase", "pubSub"], function (ko, viewBase, pubSub) {
       
    function MainVM(viewName) {
        var self = this;

        self.setName(viewName);

        // Properties
        // nothing yet
        
        
        // Behavior
        self.goToMusic = function() {
            self.activateView("music");
        };
    };

    MainVM.prototype = new viewBase();           
        
    return MainVM;
})