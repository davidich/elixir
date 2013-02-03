define(["ko", "elixir"], function(ko, elixir) {
    function GenreSelector(searchParam) {
        var self = this;

        // Data
        self.id = ko.observable(genreData.id);
        self.name = ko.observable(genreData.name);
        self.styles = ko.observableArray($.getNamedArray(genreData, "styles"));
        
        // Behavior
        self.onGenreClick = function(genre) {
            searchParam.genreId(genre.id);
            searchParam.styleId(0);
        };
        
        self.onStyleClick = function (style) {            
            searchParam.styleId(style.id);
        };
    }    

    return Genre;
})