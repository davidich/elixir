define(["ko", "pubSub", "Vms/Extensions/Routing", "Types/Artist", "Vms/search"],
    function (ko, pubSub, RoutingExtension, Artist, searchVm) {

        var carouselSelector = "#artistDetailsBlock .sliderBlock",
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
        
        function ArtistDetailsVm() {
            var self = this;

            // Data
            self.isPlayerVisible = true;
            RoutingExtension(self, "artist", "Люди");
            self.artist = ko.observable();

            // Behavior            
            self.toggleInfo = function () {
                $("#artistDetailsBlock, #artistInfoBlock").toggle("slide", { direction: "left" }, 200);
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

            self.openArtist = function (item) {
                self.navigate("/artist" + "?id=" + item.id);
            };

            // Events
            self.onShow = function (args) {
                if (!args) throw "detail view can't be opened w/o args";
                if (!args.id) throw "id is mandatory parameter";

                if (args.clean == "true") {
                    self.artist(null);
                    pubSub.pub("scroll.reset");
                    pubSub.pub("scroll.update");
                }

                Artist.load(args.id, function (artist) {
                    searchVm.artist(artist);
                    
                    $(carouselSelector).trigger("destroy");
                    self.artist(artist);                   
                    $(carouselSelector).carouFredSel(carouselSettings);

                    pubSub.pub("scroll.reset");
                    pubSub.pub("scroll.update");
                });
            };
        }

        return ArtistDetailsVm;
    })