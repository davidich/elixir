define(["ko", "pubSub", "Vms/Extensions/Routing", "Types/Artist", "Types/User", "Vms/search"],
    function (ko, pubSub, RoutingExtension, Artist, User, searchVm) {

        function PersonDetailsVm(mode) {
            var self = this,
                carouselSelector,
                carouselSettings;

            if (mode == "artist") {
                carouselSelector = "#artistDetailsBlock .sliderBlock",
                carouselSettings = {
                    circular: false,
                    width: 559,
                    height: 150,
                    infinite: false,
                    auto: false,
                    align: "left",
                    scroll: { items: 2, visible: 5 },
                    prev: { key: "left", button: "#artistDetailsBlock .slider_prev" },
                    next: { key: "right", button: "#artistDetailsBlock .slider_next" }
                };
            }

            // Data
            self.isPlayerVisible = true;
            RoutingExtension(self, mode, "Люди");
            self.person = ko.observable();

            // Behavior            
            self.toggleInfo = function () {
            //    $("#artistDetailsBlock, #artistInfoBlock").toggle("slide", { direction: "left" }, 200);
            };


            self.openTracks = function () {
                self.navigate("/search/tracks");
            };

            self.openAlbums = function () {
                self.navigate("/search/albums");
            };

            self.openAlbum = function (album) {
                self.navigate("/search/album?clear=true&id=" + album.id);
            };

            self.openDetails = function (item) {
                self.navigate("/" + mode + "?id=" + item.id);
            };

            // Events
            self.onShow = function (args) {
                if (!args) throw "detail view can't be opened w/o args";
                if (!args.id) throw "id is mandatory parameter";

                //$("#artistDetailsBlock").show();
                //$("#artistInfoBlock").hide();

                if (args.clean == "true") {
                    self.artist(null);
                    pubSub.pub("scroll.reset");
                    pubSub.pub("scroll.update");
                }

                var Ctor = mode == "artist" ? Artist : User;

                Ctor.load(args.id, function (person) {
                    searchVm.artist(artist);

                    $(carouselSelector).trigger("destroy");
                    self.person(person);
                    $(carouselSelector).carouFredSel(carouselSettings);

                    pubSub.pub("scroll.reset");
                    pubSub.pub("scroll.update");
                });
            };
        }

        return PersonDetailsVm;
    })