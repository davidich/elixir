define(["ko", "Types/FancyDropItem"], function (ko, FancyDropItem) {
    
    // Munu items
    var searchModes = [
            new FancyDropItem("all", "По всему"),
            new FancyDropItem("artist", "По исполнителю"),
            new FancyDropItem("title", "По треку")
    ];

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

    function TrackSearhParams() {
        var self = this;        

        // Props
        self.query = ko.observable();
        self.searchMode = ko.observable("all");
        self.searchModes = ko.observableArray(searchModes);
        self.timeRange = ko.observable("all");
        self.timeRanges = ko.observableArray(timeRanges);
        self.orderType = ko.observable("popular");
        self.orderTypes = ko.observableArray(orderTypes);
        self.artistId = ko.observable(0);
        self.genreId = ko.observable(0);
        self.styleId = ko.observable(0);
        self.isHighQuality = ko.observable(false);

        // Behavior
        self.toJS = function (page) {
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