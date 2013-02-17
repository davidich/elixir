define(["ko", "pubSub", "Types/TrackForPlayer"], function (ko, pubSub, TrackForPlayer) {

    function Track(metadata, url) {
        var self = this;

        self.metadata = metadata;
        /* METADATA EXAMPLE:
         * {
         *    "id": 261850,
         *    "artists": {
         *        "artist": {
         *            "id": 782972,
         *            "name": "Damien Rice"
         *        }
         *    },
         *    "duration": 210,
         *    "ownerId": 3089436,
         *    "stats": {
         *        "rank": 564401,
         *        "likes": 0
         *    },
         *    "album": {
         *        "id": 193747,
         *        "name": "O",
         *        "image": 17436
         *    },
         *    "name": "Cannonball",
         *    "styles": "",
         *    "aid": 72014244
         * } 
         */

        // Properties
        self.id = "id_" + metadata.id;
        self.title = metadata.name;
        self.album = metadata.album;
        self.artists = $.getNamedArray(metadata, "artists");
        self.styles = $.getNamedArray(metadata, "styles");

        self.duration = metadata.duration;
        self.time = Track.toTimeString(metadata.duration);
        self.stats = metadata.stats;
        
        self.aid = metadata.aid;
        self.ownerId = metadata.ownerId;
        self.url = url;

        self.isAdded = ko.computed(function() {
            var addedTracks = global.player.tracks();
            var match = $.grep(addedTracks, function (elem) {
                return self.id == elem.id;
            });

            return match.length > 0;

        });

        // Behavior
        self.addToStart = function(track) {
            pubSub.pub("track.addToStart", new TrackForPlayer(track));
        };
        
        self.addToEnd = function (track) {
            pubSub.pub("track.addToEnd", new TrackForPlayer(track));
        };
    }

    Track.toTimeString = function(durationInSecs) {
        var mins = parseInt(durationInSecs / 60);
        var secs = parseInt(durationInSecs % 60);
        return mins + ":" + (secs < 10 ? "0" + secs : secs);
    };
    
    return Track;
})