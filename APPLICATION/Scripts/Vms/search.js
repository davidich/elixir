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

    function SearchVm() {
        var self = this;

        //$.extend(self, new BaseVm("search"));
        RoutingExtension(self, "search");
        
        // Data
        self.location = ko.computed(function () { return self.activeSubVm() && self.activeSubVm().friendlyName; });
        self.addVm(new SearchTracksVm(self));
        self.addVm(new TrackDetailsVm());
        self.addVm(new SearchAlbumsVm(self));
        self.addVm(new AlbumDetailsVm());
        //self.addVm(new PlaylistVm());
        //self.addVm(new PlaylistsVm());        
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