define(["ko", "pubSub", "Types/TrackForPlayer", "Types/GenreSelector", "Types/Album"], function (ko, pubSub, TrackForPlayer, GenreSelector, Album) {
    var deps = arguments;
    function ensureDeps() {
        if (!ensureDeps.ensured) {
            ensureDeps.ensured = true;
            GenreSelector = require("Types/GenreSelector");
            Album = require("Types/Album");
            for (var key in deps) {
                if (!deps[key]) throw "Track module invoked ensureDeps, but coundn't resolve '" + key + "'";
            }
        }
    }
    
    function genreSelector() {
        if (!GenreSelector)
            GenreSelector = require("Types/GenreSelector");

        return GenreSelector;
    }

    function Track(metadata) {
        var self = this;

        ensureDeps();
        
        // Data
        var props = ["id", "stats", "aid", "ownerId"];
        $.copyProps(self, metadata, props);
        self.title = metadata.name;

        self.album = Album.get(metadata.album);
        self.artists = $.getNamedArray(metadata, "artists");

        var styleIds = $.getNamedArray(metadata, "styles");
        genreSelector().extendWithStyleAndGenres(self, styleIds);
        
        self.similars = [];
        if (metadata.similar) {
            var similars = $.getNamedArray(metadata, "similar", "track");
            $.each(similars, function() { self.similars.push(new Track(this)); });
        }

        self.isAdded = ko.computed(function() {
            var addedTracks = window.player.tracks();
            var match = $.grep(addedTracks, function (elem) {
                return self.id == elem.id;
            });

            return match.length > 0;
        });

        self.imageId = function() {
            return self.album.image;
        };
        self.getImageUrl = function (size) {
            return self.imageId()
                ? window.global.imageUrl + "?id=" + self.imageId() + "&size=" + size
                : "";
        };

        // Behavior
        self.appendVkRequest = function(vkRequest) {
            $.each(self.similars, function () {
                vkRequest = this.appendVkRequest(vkRequest);
            });

            if (vkRequest.length > 0) vkRequest += ",";
            vkRequest += self.ownerId + "_" + self.aid;

            return vkRequest;
        };
        
        self.obserbVkData = function(vkData) {
            $.each(self.similars, function () {
                this.obserbVkData(vkData);
            });

            for (var i = self.similars.length - 1; i >= 0; i--) {
                if (!self.similars[i].url) {
                    self.similars.splice(i, 1);
                }
            }
            
            if (vkData[self.aid]) {
                self.url = vkData[self.aid].url;
                self.duration = vkData[self.aid].duration;
                self.time = Track.toTimeString(self.duration);
            }
        };
        
        self.addToStart = function(track) {
            pubSub.pub("player.addToStart", track);
        };
        
        self.addToEnd = function (track) {
            pubSub.pub("player.addToEnd", track);
        };        
    }

    Track.toTimeString = function(durationInSecs) {
        var mins = parseInt(durationInSecs / 60);
        var secs = parseInt(durationInSecs % 60);
        return mins + ":" + (secs < 10 ? "0" + secs : secs);
    };
    
    return Track;
})