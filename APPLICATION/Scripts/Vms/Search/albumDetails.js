define(["ko", "pubSub", "Modules/dal", "Vms/Extensions/Routing", "Vms/Extensions/Tab"],
    function (ko, pubSub, dal, RoutingExtension, TabExtension) {
        function AlbumDetailsVm(options) {
            var self = this,
                $carousel,
                carouselSettings = {
                    circular: false,
                    width: 559,
                    height: 150,
                    infinite: false,
                    auto: false,
                    align: "left",
                    scroll: { items: 2, visible: 5 }
                    //prev: { key: "left", button: "#similarAlbumsCarousel_prev" },
                    //next: { key: "right", button: "#similarAlbumsCarousel_next" },
                    //prev: '.slider_prev', 
                    //next: '.slider_next',
                };


            $carousel = $("#" + options.containerId + " .sliderBlock");
            carouselSettings.prev = { key: "left", button: "#" + options.containerId + " .slider_prev" };
            carouselSettings.next = { key: "right", button: "#" + options.containerId + " .slider_next" };

            $("#" + options.containerId)
                    .on("mouseenter", '.albumCover', function () {
                        $(this).find('.albumLikeArea').fadeIn(300);
                        $(this).find('.albumCoverHover').animate({
                            'marginTop': '-31px'
                        }, 200);
                    })
                    .on("mouseleave", '.albumCover', function () {
                        $(this).find('.albumLikeArea').fadeOut(300);
                        $(this).find('.albumCoverHover').animate({
                            'marginTop': '60px'
                        });
                    });

            // Data
            RoutingExtension(self, options.vmId, "Музыка");
            TabExtension(self);
            self.album = ko.observable();
            self.similars = ko.observableArray();

            // Behavior
            self.toggleShowAll = function () {
                self.showAll(!self.showAll());
                pubSub.pub("scroll.update");
            };

            self.playAlbum = function () {
                if (!self.album()) return;
                self.album().playTracks();
            };

            self.appendAlbum = function () {
                if (!self.album()) return;
                self.album().appendTracks();
            };

            self.openDetails = function (item) {
                self.navigate(options.detailUrl + "?id=" + item.id);
            };

            // Events
            self.onShow = function (args) {
                if (!args) throw "detail view can't be opened w/o args";
                if (!args.id) throw "id is mandatory parameter";

                if (args.clean == "true") {
                    self.album(null);
                    pubSub.pub("scroll.reset");
                    pubSub.pub("scroll.update");
                }

                dal[options.dalMethod](args.id, function (album) {
                    self.album(album);

                    $carousel.trigger("destroy");
                    self.similars.removeAll();

                    $.each(album.similars, function () { self.similars.push(this); });
                    $carousel.carouFredSel(carouselSettings);

                    pubSub.pub("scroll.reset");
                    pubSub.pub("scroll.update");
                });
            };
        }

        return AlbumDetailsVm;
    })