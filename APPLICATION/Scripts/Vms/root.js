define(["ko", "Vms/base", "Vms/welcome", "Vms/search"], function (ko, BaseVm, WelcomeVm, SearchVm) {

    function RootVm() {
        var self = this;

        $.extend(self, new BaseVm("root"));

        // init
        self.addVm(new SearchVm());
        self.addVm(new WelcomeVm());
        

        // behavior
        self.goToWelcome = function() {
            self.navigate("welcome");
        };
    }

    // return singleton
    return new RootVm();
})