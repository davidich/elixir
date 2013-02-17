define(["ko"], function (ko) {
    function MusicStyle(data, genre) {
        var self = this;

        // Data
        self.id = data.id;
        self.name = data.name;
        self.genre = genre;


        self.createKoObj = function (searchParams) {
            var copy = $.extend({}, self);

            copy.isVisible = ko.computed(function () {
                return searchParams.genreId() == copy.genre.id;
            });

            copy.isActive = ko.computed(function () {
                return searchParams.styleId() == copy.id;
            });

            // Behavior
            copy.onClick = function (style) {
                searchParams.genreSelector.onStyleClick(style);
            };            

            return copy;
        };        
    }

    return MusicStyle;
})