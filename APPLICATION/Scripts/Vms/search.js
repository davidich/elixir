define(["ko", "pubSub", "Vms/Extensions/Routing", "Types/FancyDropItem", "Types/GenreSelector",
        "Vms/Search/tracks", "Vms/Search/track",
        "Vms/Search/searchAlbums", "Vms/Search/albumDetails",
        "Vms/Search/searchPersons"],
    function (ko, pubSub, RoutingExtension, FancyDropItem, GenreSelector,
        SearchTracksVm, TrackDetailsVm,
        SearchAlbumsVm, AlbumDetailsVm,
        SearchPersonsVm) {

        // Munu items  
        var timeRanges = [
            new FancyDropItem("all", "За все время"),
            new FancyDropItem("year", "За год"),
            new FancyDropItem("month", "За месяц"),
            new FancyDropItem("week", "За неделю")
        ];

        var orderTypes = [
            new FancyDropItem("popular", "Популярное", /*cssClass*/"popular"),
            new FancyDropItem("interesting", "Рекомендации", /*cssClass*/"recomenadation"),
            new FancyDropItem("new", "Новинки", /*cssClass*/"new")
        ];

        var albumSearchModes = [
            new FancyDropItem("all", "По всему"),
            new FancyDropItem("album_name", "По альбому"),
            new FancyDropItem("artist_name", "По исполнителю")
        ];

        var playlistSearchModes = [
            new FancyDropItem("all", "По всему"),
            new FancyDropItem("playlist_name", "По плейлисту"),
            new FancyDropItem("artist_name", "По исполнителю")
        ];

        function setupVms(self) {
            // Tracks
            self.addVm(new SearchTracksVm(self));
            self.addVm(new TrackDetailsVm(self));

            // Albums
            var searchAlbumVm = new SearchAlbumsVm(self, {
                containerId: "searchAlbumsVm",
                vmId: "albums",
                searchModes: albumSearchModes,
                detailUrl: "/search/album",
                searchResultSuffix: " альбомов"
            });
            var albumDetailVm = new AlbumDetailsVm(self, {
                containerId: "albumDetailsVm",
                vmId: "album",
                detailUrl: "/search/album"
            });
            self.addVm(searchAlbumVm);
            self.addVm(albumDetailVm);

            // Playlists
            var searchPlaylistVm = new SearchAlbumsVm(self, {
                containerId: "playlistAlbumsVm",
                vmId: "playlists",
                searchModes: playlistSearchModes,
                detailUrl: "/search/playlist",
                searchResultSuffix: " плейлистов"
            });
            var playlistDetailVm = new AlbumDetailsVm(self, {
                containerId: "playlistDetailsVm",
                vmId: "playlist",
                detailUrl: "/search/playlist"
            });
            self.addVm(searchPlaylistVm);
            self.addVm(playlistDetailVm);

            // People
            self.addVm(new SearchPersonsVm(self, "artist"));
            self.addVm(new SearchPersonsVm(self, "user"));
        }

        function SearchVm() {
            var self = this;

            RoutingExtension(self, "search");
            setupVms(self);

            // DATA
            // Search params
            self.timeRange = ko.observable("all");
            self.orderType = ko.observable("popular");
            self.genreId = ko.observable(0);
            self.styleId = ko.observable(0);
            self.isHighQuality = ko.observable(false);

            self.artist = ko.observable();
            self.user = ko.observable();
            self.genreSelector =  global.genreSelector = new GenreSelector(self);            
            self.timeRanges = ko.observableArray(timeRanges);
            self.orderTypes = ko.observableArray(orderTypes);
            self.location = ko.computed(function () {
                var person = self.artist() || self.user();
                return person
                    ? person.name
                    : self.activeSubVm() && self.activeSubVm().friendlyName;
            });

            // subscribe to param updates
            var searchParams = ["genreId", "styleId", "orderType", "timeRange", "isHighQuality"];
            $.each(searchParams, function (i, propName) {
                self[propName].subscribe(function() {
                     pubSub.pub("search.changed", propName);
                });
            });

            self.getParams = function () {
                var params = {};

                $.each(searchParams, function (i, propName) {
                    params[propName] = self[propName]();
                });

                params["artist"] = self.artist() ? self.artist().id : 0;
                params["user"] = self.user() ? self.user().id : 0;

                return params;
            };
        }

        return new SearchVm();
    })