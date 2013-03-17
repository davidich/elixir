define(["ko", "pubSub", "Vms/Extensions/Routing", "Vms/Extensions/Tabs", "Types/Artist"],
    function (ko, pubSub, RoutingExtension, TabsExtension, Artist) {
        function ArtistDetailsVm() {
            var self = this;

            //var $carousel,
            //    carouselSettings = {
            //        circular: false,
            //        width: 559,
            //        height: 150,
            //        infinite: false,
            //        auto: false,
            //        align: "left",
            //        scroll: { items: 2, visible: 5 }
            //        //prev: { key: "left", button: "#similarAlbumsCarousel_prev" },
            //        //next: { key: "right", button: "#similarAlbumsCarousel_next" },
            //        //prev: '.slider_prev', 
            //        //next: '.slider_next',
            //    };


            //$carousel = $("#" + options.containerId + " .sliderBlock");
            //carouselSettings.prev = { key: "left", button: "#" + options.containerId + " .slider_prev" };
            //carouselSettings.next = { key: "right", button: "#" + options.containerId + " .slider_next" };

            //$("#" + options.containerId)
            //        .on("mouseenter", '.albumCover', function () {
            //            $(this).find('.albumLikeArea').fadeIn(300);
            //            $(this).find('.albumCoverHover').animate({
            //                'marginTop': '-31px'
            //            }, 200);
            //        })
            //        .on("mouseleave", '.albumCover', function () {
            //            $(this).find('.albumLikeArea').fadeOut(300);
            //            $(this).find('.albumCoverHover').animate({
            //                'marginTop': '60px'
            //            });
            //        });

            // Data
            RoutingExtension(self, "artist", "Люди");
            TabsExtension(self, "people");
            self.artist = ko.observable();
            self.tracks = ko.observableArray();
            self.albums = ko.observableArray();
            self.similars = ko.observableArray();
            

            // Behavior
            //self.playAlbum = function () {
            //    if (!self.album()) return;
            //    self.album().play();
            //};

            //self.appendAlbum = function () {
            //    if (!self.album()) return;
            //    self.album().append();
            //};

            self.openDetails = function (item) {
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
                    self.artist(artist);

                    self.tracks.removeAll();
                    $.each(artist.albums, function () { self.albums.push(this); });
                    
                    self.albums.removeAll();
                    $.each(artist.tracks, function () { self.tracks.push(this); });

                    //$carousel.trigger("destroy");
                    self.similars.removeAll();
                    $.each(artist.similars, function () { self.similars.push(this); });
                    //$carousel.carouFredSel(carouselSettings);
                   

                    pubSub.pub("scroll.reset");
                    pubSub.pub("scroll.update");
                });
            };
        }

        return ArtistDetailsVm;
    })