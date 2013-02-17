define(["ko", "pubSub"], function (ko, pubSub) {

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
        self.id = ko.observable("id_" + metadata.id);        
        self.artists = ko.observableArray($.getNamedArray(metadata, "artists"));
        self.title = ko.observable(metadata.name);
        self.album = ko.observable(metadata.album);

        self.duration = ko.observable(metadata.duration);
        self.time = ko.observable(Track.toTimeString(metadata.duration));
        self.stats = ko.observable(metadata.stats);
        
        self.aid = ko.observable(metadata.aid);
        self.ownerId = ko.observable(metadata.ownerId);
        self.url = ko.observable(url);
        

        // Behavior
        self.onPlayClick = function(track) {
            pubSub.pub("track.onPlayClick", track);
        };        
    }

    Track.toTimeString = function(durationInSecs) {
        var mins = parseInt(durationInSecs / 60);
        var secs = parseInt(durationInSecs % 60);
        return mins + ":" + (secs < 10 ? "0" + secs : secs);
    };
    
    return Track;
})