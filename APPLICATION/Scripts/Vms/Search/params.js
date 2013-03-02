define(["ko", "pubSub", "elixir", "Types/FancyDropItem", "Types/GenreSelector"], function (ko, pubSub, elixir, FancyDropItem, GenreSelector) {

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

    function paramsVm() {
        var self = this,
            i,
            triggers = ["artistId", "genreId", "styleId", "orderType", "timeRange", "isHighQuality"];

        // Props                
        self.timeRange = ko.observable("all");
        self.orderType = ko.observable("popular");
        self.artistId = ko.observable(0);
        self.genreId = ko.observable(0);
        self.styleId = ko.observable(0);
        self.isHighQuality = ko.observable(false);


        self.timeRanges = ko.observableArray(timeRanges);
        self.orderTypes = ko.observableArray(orderTypes);
        self.genreSelector = new GenreSelector(self);

        // Behavior
        self.toJS = function (page) {
            var unwraped = ko.mapping.toJS(self);
            unwraped.page = page || 1;

            delete unwraped.orderTypes;
            delete unwraped.timeranges;
            delete unwraped.genres;

            return unwraped;
        };

        // subscribe to param updates
        for (i = 0; i < triggers.length; i++) {
            var propName = triggers[i];
            self[propName].subscribe(function () {                
                pubSub.pub("search.changed", propName);
            });
        }
    }

    return new paramsVm();
})