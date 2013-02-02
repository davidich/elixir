define(["ko"], function (ko) {

    // SEARCH_PARAM_OBJ:
    // query: string
    // [searchMode]: all, artist, title
    // [orderType]:  popular, interesting, new
    // [timerange]: all, year, month, week
    // [artistId]: int
    // [genreId]: int
    // [styleId]: int
    // [isHighQuality]: bool
    // [page]: int
    function TrackSearhParams() {
        var self = this;

        // Props
        self.query = ko.observable();
        self.searchMode = ko.observable("all");
        self.searchModes = ko.observableArray(["all", "artist", "title"]);
        self.orderType = ko.observable("popular");
        self.orderTypes = ko.observableArray(["popular", "interesting", "new"]);
        self.timerange = ko.observable("all");
        self.timeranges = ko.observableArray(["all", "year", "month", "week"]);
        self.artistId = ko.observable(0);
        self.genreId = ko.observable(0);
        self.styleId = ko.observable(0);
        self.isHighQuality = ko.observable(false);
        
        // Behavior
        self.toJS = function(page) {
            var unwraped = ko.mapping.toJS(self);
            unwraped.page = page || 1;

            delete unwraped.searchModes;
            delete unwraped.orderTypes;
            delete unwraped.timeranges;

            return unwraped;
        };
    }

    return TrackSearhParams;
})