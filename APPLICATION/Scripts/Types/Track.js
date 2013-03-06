define(["ko", "pubSub", "Types/TrackForPlayer", "Types/GenreSelector"], function (ko, pubSub, TrackForPlayer, GenreSelector) {

    function genreSelector() {
        if (!GenreSelector)
            GenreSelector = require("Types/GenreSelector");

        return GenreSelector;
    }

    function Track(metadata) {
        var self = this,
            cache = {};

        self.metadata = metadata;
        
        // Data
        //self.id = "id_" + metadata.id;
        self.id = metadata.id;
        self.title = metadata.name;
        self.album = metadata.album;
        self.artists = $.getNamedArray(metadata, "artists");
        self.stats = metadata.stats;        
        self.aid = metadata.aid;
        self.ownerId = metadata.ownerId;

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

        self.loadAlbum = function(onSuccess) {
            if (cache.album)
                onSuccess(cache.album);
            else {
                require("Modules/dal").loadAlbum(self.album.id, function(album) {
                    cache.album = album;
                    onSuccess(album);
                });
            }
        };
    }

    Track.toTimeString = function(durationInSecs) {
        var mins = parseInt(durationInSecs / 60);
        var secs = parseInt(durationInSecs % 60);
        return mins + ":" + (secs < 10 ? "0" + secs : secs);
    };
    
    return Track;
})