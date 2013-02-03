define(["ko", "elixir"], function(ko, elixir) {
    function Genre(genreData) {
        var self = this;

        // Data
        self.id = genreData.id;
        self.name = genreData.name;
        self.isVisible = ko.observable(true);
        self.styles = $.getNamedArray(genreData, "styles");
    }    

    return Genre;
})