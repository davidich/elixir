define(["ko", "Vms/Extensions/Routing", "Vms/welcome", "Vms/search", "Vms/artistDetails"],
    function (ko, RoutingExtension, welcomeVm, searchVm, artistDetailsVm) {

        function RootVm() {
            var self = this;

            //$.extend(self, new BaseVm("root"));
            RoutingExtension(self, "root");

            // init
            self.addVm(searchVm);
            self.addVm(welcomeVm);
            self.addVm(new artistDetailsVm());


            // behavior
            self.goToWelcome = function () {
                self.navigate("/welcome");
            };

            self.goToMusic = function () {
                searchVm.artist(null);
                searchVm.user(null);
                self.navigate("/search/tracks");
            };

            self.goToPeople = function () {
                searchVm.artist(null);
                searchVm.user(null);
                self.navigate("/search/artists");
            };
        }

        // return singleton
        return new RootVm();
    })