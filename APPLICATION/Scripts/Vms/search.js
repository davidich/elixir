define(["ko", "pubSub", "Vms/Extensions/Routing", "Vms/Search/track", "Vms/Search/tracks", "Vms/Search/searchAlbums", "Vms/Search/albumDetails", "Vms/Search/player", "Types/FancyDropItem", "Types/GenreSelector"],
    function (ko, pubSub, RoutingExtension, TrackDetailsVm, SearchTracksVm, SearchAlbumsVm, AlbumDetailsVm, playerVm, FancyDropItem, GenreSelector) {

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
            self.addVm(new TrackDetailsVm());

            // Albums
            var searchAlbumVm = new SearchAlbumsVm(self, {
                containerId: "searchAlbumsVm",
                vmId: "albums",
                searchModes: albumSearchModes,
                detailUrl: "/search/album",
                dalMethod: "searchAlbums",
                searchResultSuffix: " альбомов"
            });
            var albumDetailVm = new AlbumDetailsVm({
                containerId: "albumDetailsVm",
                vmId: "album",
                detailUrl: "/search/album",
                dalMethod: "loadAlbum",
            });
            self.addVm(searchAlbumVm);
            self.addVm(albumDetailVm);

            // Playlists
            var searchPlaylistVm = new SearchAlbumsVm(self, {
                containerId: "playlistAlbumsVm",
                vmId: "playlists",
                searchModes: playlistSearchModes,
                detailUrl: "/search/playlist",
                dalMethod: "searchAlbums",
                searchResultSuffix: " плейлистов"
            });
            var playlistDetailVm = new AlbumDetailsVm({
                containerId: "playlistDetailsVm",
                vmId: "playlist",
                detailUrl: "/search/playlist",
                dalMethod: "loadAlbum",
            });
            self.addVm(searchPlaylistVm);
            self.addVm(playlistDetailVm);
        }

        function SearchVm() {
            var self = this;

            //$.extend(self, new BaseVm("search"));
            RoutingExtension(self, "search");
            setupVms(self);
            
            // Data
            self.location = ko.computed(function () { return self.activeSubVm() && self.activeSubVm().friendlyName; });
            self.player = window.player = playerVm; // make player global to have access to its properties from some vms        
            self.timeRanges = ko.observableArray(timeRanges);
            self.orderTypes = ko.observableArray(orderTypes);

            // Search params
            self.timeRange = ko.observable("all");
            self.orderType = ko.observable("popular");
            self.artistId = ko.observable(0);
            self.genreId = ko.observable(0);
            self.styleId = ko.observable(0);
            self.isHighQuality = ko.observable(false);

            // create genre selector only after all pros are added
            self.genreSelector = new GenreSelector(self);


            // subscribe to param updates
            var searchParams = ["artistId", "genreId", "styleId", "orderType", "timeRange", "isHighQuality"];
            $.each(searchParams, function (i, propName) {
                self[propName].subscribe(function () { pubSub.pub("search.changed", propName); });
            });

            self.getParams = function () {
                var params = {};
                $.each(searchParams, function (i, propName) { params[propName] = self[propName](); });
                return params;
            };

            // deal with scroll
            var rollbar = $("#searchVm").rollbar({
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

        return new SearchVm();
    })