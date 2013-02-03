define(["ko", "Types/MusicStyle"], function(ko, MusicStyle) {
    function Genre(searchParams, data) {
        var self = this;

        // Data
        self.id = data.id;
        self.name = data.name;
        self.styles = [];
        self.isVisible = ko.computed(function() {
            return self.id == 0 || self.id == searchParams.genreId() || searchParams.genreId() == 0;
        });        
        self.isSelected = ko.computed(function() {
            return self.id == searchParams.genreId();
        });        
        self.isActive = ko.computed(function() {
            return searchParams.styleId() == 0 && self.isSelected();
        });               
        
        // Behavior
        self.onClick = function (genre) {
            searchParams.genreSelector.onGenreClick(genre);            
        };
        

        var rawStyles = $.getNamedArray(data, "styles");
        for (var i = 0; i < rawStyles.length; i++) {
            self.styles.push(new MusicStyle(rawStyles[i], self, searchParams));
        }
    }    

    return Genre;
})