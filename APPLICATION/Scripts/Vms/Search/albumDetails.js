define(["ko", "pubSub", "Modules/dal", "Vms/Extensions/Routing", "Vms/Extensions/Tab"],
    function (ko, pubSub, dal, RoutingExtension, TabExtension) {
        var $carousel = $("#similarAlbumsCarousel"),
            carouselSettings = {
                circular: false,
                width: 559,
                height: 150,
                infinite: false,
                auto: false,
                prev: {
                    button: "#similarAlbumsCarousel_prev",
                    key: "left"
                },
                next: {
                    button: "#similarAlbumsCarousel_next",
                    key: "right"
                },
                //prev: '.slider_prev',
                //next: '.slider_next',
                align: "left",
                scroll: {
                    items: 2,
                    visible: 5
                }
            };
        

        var uiInited = false;
        function initUi() {
            if (uiInited) return;
            
            //$('.sliderBlock').carouFredSel();
            
            //$('.albumCover').hover(function () {
            //    $(this).find('.albumLikeArea').fadeIn(300);
            //    $(this).find('.albumCoverHover').animate({
            //        'marginTop': '-31px'
            //    });
            //}, function () {
            //    $(this).find('.albumLikeArea').fadeOut(300);
            //    $(this).find('.albumCoverHover').animate({
            //        'marginTop': '60px'
            //    }, 200);
            //});
            
            $("#albumDetailsVm").on("mouseenter", '.albumCover', function () {
                $(this).find('.albumLikeArea').fadeIn(300);
                $(this).find('.albumCoverHover').animate({
                    'marginTop': '-31px'
                }, 200);
            });

            $("#albumDetailsVm").on("mouseleave", '.albumCover', function () {
                $(this).find('.albumLikeArea').fadeOut(300);
                $(this).find('.albumCoverHover').animate({
                    'marginTop': '60px'
                });
            });
        }
        

        function AlbumDetailsVm() {
            var self = this;

            // Data
            RoutingExtension(self, "album", "������");
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

            self.appendAlbum = function() {
                if (!self.album()) return;
                self.album().appendTracks();
            };

            self.openDetails = function (album) {
                self.navigate("/search/album?id=" + album.id);
            };

            // Events
            self.onShow = function (args) {
                if (!args) throw "track view can't be opened w/o args";
                if (!args.id) throw "id is mandatory parameter";

                initUi();
                
                if (args.clean == "true") {
                    self.album(null);
                    pubSub.pub("scroll.reset");
                    pubSub.pub("scroll.update");
                }

                dal.loadAlbum(args.id, function (album) {
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