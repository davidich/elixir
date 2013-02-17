define(["ko", "Types/MusicStyle"], function(ko, MusicStyle) {
    function Genre(data) {
        var self = this,
            i;
            
        // Data               
        self.id = data.id;
        self.name = data.name;        
        self.styles = [];
        self.styleDict = {};
        self.searchParams = ko.observable();
        
        // init styles
        var rawStyles = $.getNamedArray(data, "styles");
        for (i = 0; i < rawStyles.length; i++) {
            var style = new MusicStyle(rawStyles[i], self);

            self.styleDict[style.id] = style;
            self.styles.push(style);
        }
        
        // KO Factory
        self.createKoObj = function(searchParams) {
            var copy = $.extend(true, {}, self);
            
            // Props
            copy.isVisible = ko.computed(function () {
                return copy.id == 0 || copy.id == searchParams.genreId() || searchParams.genreId() == 0;
            });
            copy.isSelected = ko.computed(function () {
                return copy.id == searchParams.genreId();
            });
            copy.isActive = ko.computed(function () {
                return searchParams.styleId() == 0 && copy.isSelected();
            });

            // Behavior
            copy.onClick = function (genre) {
                searchParams.genreSelector.onGenreClick(genre);
            };

            // init styles
            var styles = self.styles;
            copy.styles.length = 0;
            for (i = 0; i < styles.length; i++)
                copy.styles.push(styles[i].createKoObj(searchParams));

            return copy;
        };              
    }

    return Genre;
})