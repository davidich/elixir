define(["Types/GenreSelector", "Types/Track"], function (GenreSelector, Track) {

    function createTrack(metadata) {
        if (!Track) Track = require("Types/Track");
        return new Track(metadata);
    }

    function Album(metadata) {
        var self = this;

        var props = ["id", "name", "image", "release", "stats", "info"];
        $.copyProps(self, metadata, props);
        
        self.artists = $.getNamedArray(metadata, "artists");

        self.similars = [];
        if (metadata.similar) {
            var similars = $.getNamedArray(metadata, "similar", "album");
            $.each(similars, function () {
                self.similars.push(new Album(this));
            });
        }

        var styleIds = $.getNamedArray(metadata, "styles");
        GenreSelector.extendWithStyleAndGenres(self, styleIds);
        
        self.tracks = [];        
        $.each($.getNamedArray(metadata, "tracks"), function () {
            self.tracks.push(createTrack(this));
        });        
    }

    return Album;
})