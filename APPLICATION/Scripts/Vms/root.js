define(["ko", "pubSub", "Vms/Extensions/Routing", "Vms/welcome", "Vms/search", "Vms/personDetails", "Vms/Search/player"],
    function (ko, pubSub, RoutingExtension, welcomeVm, searchVm, PersonDetailsVm, playerVm) {


        $("#rootVm")
            .on("mouseenter", '.hiddenPanelContainer', function () {
                var $slidePanel = $(this).find(".slidePanel");
                $slidePanel.animate({ marginTop: 0 }, 300);
                
                $(this).find(".fadePanel").fadeIn(300);
            })
            .on("mouseleave", '.hiddenPanelContainer', function () {
                var $slidePanel = $(this).find(".slidePanel");
                $slidePanel.animate({ marginTop: $slidePanel.height() }, 300);
                
                $(this).find(".fadePanel").fadeOut(300);
            });



        function RootVm() {
            var self = this;

            //$.extend(self, new BaseVm("root"));
            RoutingExtension(self, "root");

            // init
            self.addVm(searchVm);
            self.addVm(welcomeVm);
            self.addVm(new PersonDetailsVm("artist"));
            self.addVm(new PersonDetailsVm("user"));
            self.player = window.player = playerVm; // make player global to have access to its properties from some vms

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

            // deal with scroll
            var rollbar = $("#scrolledContent").rollbar({
                minThumbSize: '25%',
                pathPadding: '3px',
                zIndex: 100,
                onScroll: function (scrollState) {
                    pubSub.pub("scroll.moved", scrollState);
                }
            });

            pubSub.sub("scroll.reset", function () {
                rollbar.reset();
            });
            pubSub.sub("scroll.update", function () {
                rollbar.update();
            });
        }

        // return singleton
        return new RootVm();
    })