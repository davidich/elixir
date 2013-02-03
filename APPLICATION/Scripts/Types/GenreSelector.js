define(["ko", "elixir", "Types/Genre"], function (ko, elixir, Genre) {

    var allGenres = [];

    function GenreSelector(searchParam) {
        var self = this;

        // Data
        self.genres = ko.observableArray();
        for (var i = 0; i < allGenres.length; i++) {
            self.genres.push(new Genre(searchParam, allGenres[i]));
        }
        
        // Behavior
        self.onGenreClick = function (genre) {
            //// update UI
            //for (var i = 0; i < allGenres.length; i++) {
            //    var gnr = allGenres[i];

            //    // show clicked and all items
            //    gnr.isVisible(gnr.id == 0 || clickedGenre.id == gnr.id || clickedGenre.id == 0);
                
            //    // make clicked as selected
            //    gnr.isSelected(gnr.id == clickedGenre.id);
            //}

            //for (var j = 0; j < clickedGenre.styles.length; j++) {
            //    var style = clickedGenre.styles[j];
            //    style.isSelected(false);
            //}
            
            // update model
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
            allGenres.push({ id: 0, name: "Все жанры", styles: { style: [] } });

            var genreData = $.getNamedArray(response, "genres");
            for (var i = 0; i < genreData.length; i++) {
                allGenres.push(genreData[i]);
            }

            onComplete();
        });
    };

    return GenreSelector;
})