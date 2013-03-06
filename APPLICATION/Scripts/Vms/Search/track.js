define(["ko", "pubSub", "Modules/dal", "Vms/Extensions/Routing", "Vms/Extensions/Tab"],
    function (ko, pubSub, dal, RoutingExtension, TabExtension) {

        $("#trackDetailsVm").on("mouseenter", '.albumBlock .cover', function () {
            $(this).find('.coverHover').animate({
                height: 'toggle',
                marginTop: -33
            }, 300);
        });

        $("#trackDetailsVm").on("mouseleave", '.albumBlock .cover', function () {
            $(this).find('.coverHover').animate({
                height: 'toggle',
                marginTop: -2
            }, 300);
        });

        function TrackVm() {
            var self = this;

            // Data
            RoutingExtension(self, "track", "Музыка");
            TabExtension(self);
            self.track = ko.observable();
            self.topFive = ko.observableArray();
            self.bottomTwenty = ko.observableArray();
            self.showAll = ko.observable();
            self.similars = ko.observableArray();

            // Behavior
            self.toggleShowAll = function () {
                self.showAll(!self.showAll());
                pubSub.pub("scroll.update");
            };

            self.playSimilars = function () {
                pubSub.pub("player.addToStart", self.track().similars);
            };

            self.playAlbum = function () {
                if (!self.track()) return;                
                self.track().loadAlbum(function (album) {
                    album.playTracks();
                });
            };

            self.appendAlbum = function() {
                if (!self.track()) return;                
                self.track().loadAlbum(function(album) {
                    album.appendTracks();
                });
            };

            self.openDetails = function (track) {
                self.navigate("/search/track?id=" + track.id);
            };

            // Events
            self.onShow = function (args) {
                if (!args) throw "track view can't be opened w/o args";
                if (!args.id) throw "id is mandatory parameter";

                if (args.clean == "true") {
                    self.track(null);
                    self.topFive.removeAll();
                    self.bottomTwenty.removeAll();
                    self.showAll(false);

                    pubSub.pub("scroll.reset");
                    pubSub.pub("scroll.update");
                }

                dal.trackInfo(args.id, function (track) {
                    self.track(track);

                    self.topFive.removeAll();
                    self.bottomTwenty.removeAll();
                    self.similars.removeAll();
                    var i, similars = track.similars;
                    for (i = 0; i < similars.length; i++) {
                        //if (i < 5)
                        //    self.topFive.push(similars[i]);
                        //else
                        //    self.bottomTwenty.push(similars[i]);

                        self.similars.push(similars[i]);
                    }

                    pubSub.pub("scroll.reset");
                    pubSub.pub("scroll.update");
                });
            };
        }

        return TrackVm;
    })