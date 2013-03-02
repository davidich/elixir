define(["ko", "pubSub", "Types/GenreSelector"], function (ko, pubSub, GenreSelector) {

    function TrackForPlayer(track) {
        var self = this,
            i;

        self.data = track;
        
        // shortcuts
        self.id = track.id;
        self.url = track.url;               
        self.title = track.title;
        self.artists = track.artists;
        self.duration = track.duration;
        self.time = track.time;
        self.imageId = track.album.image;
        self.rank = ko.observable(track.stats.rank);
        
        self.genres = [];
        self.styles = [];
        for (i = 0; i < track.styles.length; i++) {
            var style = GenreSelector.getStyle(track.styles[i]);

            // add genre
            if ($.inArray(style.genre, self.genres) == -1)
                self.genres.push(style.genre);
            
            // add style
            self.styles.push(style);
        }

        // behavior
        self.onDeleteClick = function (deletedTrack) {
            pubSub.pub("trackForPlayer.onDeleteClick", deletedTrack);
        };

        self.onTrackClick = function(track) {
            pubSub.pub("trackForPlayer.onClick", track);
        };

    }

    return TrackForPlayer;
})