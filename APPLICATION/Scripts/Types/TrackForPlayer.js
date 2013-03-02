define(["ko", "pubSub", "Types/GenreSelector"], function (ko, pubSub, GenreSelector) {
    function TrackForPlayer(track) {
        var self = this,
            i;               
               
        // Data
        self.data = track;
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

        self.isCurrent = ko.computed(function () {            
            return self == window.player.track();
        });

        // behavior
        self.onDeleteClick = function (deletedTrack) {
            pubSub.pub("trackForPlayer.onDeleteClick", deletedTrack);
        };

        self.onTrackClick = function(clickedTrack) {
            pubSub.pub("trackForPlayer.onClick", clickedTrack);
        };

    }

    return TrackForPlayer;
})