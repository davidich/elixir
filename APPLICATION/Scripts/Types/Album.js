define(["pubSub", "Types/GenreSelector", "Types/Track"], function (pubSub, GenreSelector, Track) {

    function createTrack(metadata) {
        if (!Track) Track = require("Types/Track");
        return new Track(metadata);
    }

    // LOAD LEVELS:
    // lite (similar albums):   id, name, image
    // normal (search result):  id, name, image, release, artists, styles , stats
    // full (album details):    id, name, image, release, artists, styles , stats,  similar, tracks    
    function Album(metadata, loadLevel) {
        var self = this;
        self.loadLevel = loadLevel;

        var props = ["id", "name", "image", "stats", "info"];
        $.copyProps(self, metadata, props);
        
        if (typeof metadata.release == "string" && metadata.release.length > 0) {
            var end = metadata.release.indexOf(",") != -1 ? metadata.release.indexOf(",") : metadata.release.length;
            self.release = metadata.release.substring(0, end);
        } else {
            self.release = "не известна";
        }

        self.imageUrl = function(size) {
            return window.global.imageUrl + "?id=" + self.image + "&size=" + size;
        };               

        self.artists = $.getNamedArray(metadata, "artists");

        self.similars = [];
        if (metadata.similar) {
            var similars = $.getNamedArray(metadata, "similar", "album");
            $.each(similars, function() {
                self.similars.push(new Album(this, "lite"));
            });
        }

        var styleIds = $.getNamedArray(metadata, "styles");
        GenreSelector.extendWithStyleAndGenres(self, styleIds);

        self.tracks = [];
        $.each($.getNamedArray(metadata, "tracks"), function() {
            self.tracks.push(createTrack(this));
        });

        self.playTracks = function() {
            self.fullLoad(function () {
                pubSub.pub("player.addToStart", self.tracks);
            });
        };

        self.appendTracks = function () {
            self.fullLoad(function () {
                pubSub.pub("player.addToEnd", self.tracks);
            });
        };
        
        self.fullLoad = function (onComplete) {
            if (self.loadLevel != "full") {
                require("Modules/dal").loadAlbum(self, onComplete);
            } else {
                onComplete(self);
            }
        };
    }

    return Album;
})


