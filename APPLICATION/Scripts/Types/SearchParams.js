define(["ko", "pubSub", "elixir", "Types/FancyDropItem", "Types/GenreSelector"], function (ko, pubSub, elixir, FancyDropItem, GenreSelector) {
    
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

    function SearhParams() {
        var self = this;        

        // Props
        self.query = ko.observable("");
        self.searchMode = ko.observable("all");
        self.timeRange = ko.observable("all");
        self.orderType = ko.observable("popular");
        self.artistId = ko.observable(0);
        self.genreId = ko.observable(0);        
        self.styleId = ko.observable(0);
        self.isHighQuality = ko.observable(false);
        
        self.searchModes = ko.observableArray(searchModes);
        self.timeRanges = ko.observableArray(timeRanges);
        self.orderTypes = ko.observableArray(orderTypes);
        self.genreSelector = new GenreSelector(self);

        // Behavior
        self.toJS = function (page) {
            var unwraped = ko.mapping.toJS(self);
            unwraped.page = page || 1;

            delete unwraped.searchModes;
            delete unwraped.orderTypes;
            delete unwraped.timeranges;
            delete unwraped.genres;

            return unwraped;
        };

        
        // Set up search triggers
        function onChange() { pubSub.pub("searchParams.onChange"); }
        
        var triggers = ["query", "searchMode", "timeRange", "orderType", "artistId", "genreId", "styleId", "isHighQuality"];
        for (var i = 0; i < triggers.length; i++) self[triggers[i]].subscribe(onChange);               
    }
    
    return SearhParams;
})