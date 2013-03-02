define(["ko", "elixir", "Types/Genre"], function (ko, elixir, Genre) {

    var genreDict = {};
    var styleDict = {};

    function GenreSelector(searchParam) {
        var self = this;

        // Data
        self.genres = ko.observableArray();
        for (var genreId in genreDict) {
            var gengeVm = genreDict[genreId].createKoObj(searchParam);
            self.genres.push(gengeVm);
        }
        
        // Behavior
        self.onGenreClick = function (genre) {
            searchParam.styleId(0);         // !!!keep this line first
            searchParam.genreId(genre.id);
            console.log("genre seleted: " + genre.name);
        };

        self.onStyleClick = function(style) {
            searchParam.styleId(style.id);
            console.log("style seleted: " + style.name);
        };
    }
    
    GenreSelector.preloadGenres = function (onComplete) {
        elixir.getGenres(function (response) {
            var genres = $.getNamedArray(response, "genres");
            genres.splice(0, 0, { id: 0, name: "Все жанры", styles: { style: [] } });
            
            for (var i = 0; i < genres.length; i++) {
                var genre = new Genre(genres[i]);
                genreDict[genre.id] = genre;
                
                for (var j = 0; j < genre.styles.length; j++) {
                    var style = genre.styles[j];
                    styleDict[style.id] = style;
                }
            }

            onComplete();
        });
    };

    GenreSelector.getGenre = function(id) {
        return genreDict[id];
    };
    
    GenreSelector.getStyle = function (id) {
        return styleDict[id];
    };

    GenreSelector.extendWithStyleAndGenres = function(target, styleIds) {
        target.styles = [];
        target.genres = [];
        
        $.each(styleIds, function () {
            // add style
            var style = styleDict[this];            
            target.styles.push(style);
            
            // add genre
            if ($.inArray(style.genre, target.genres) == -1)
                target.genres.push(style.genre);
        });

    };

    return GenreSelector;
})