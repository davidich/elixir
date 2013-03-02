define(["ko", "Vms/Extensions/Routing", "Vms/welcome", "Vms/search"], function (ko, RoutingExtension, welcomeVm, searchVm) {

    function RootVm() {
        var self = this;

        //$.extend(self, new BaseVm("root"));
        RoutingExtension(self, "root");

        // init
        self.addVm(searchVm);
        self.addVm(welcomeVm);
        

        // behavior
        self.goToWelcome = function() {
            self.navigate("/welcome");
        };
    }

    // return singleton
    return new RootVm();
})