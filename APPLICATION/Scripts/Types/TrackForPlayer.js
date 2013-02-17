define(["ko", "pubSub"], function (ko, pubSub) {

    function TrackForPlayer(track) {
        var self = this;

        self.data = track;
        
        // shortcuts
        self.id = track.id;
        self.url = track.url;               
        self.title = track.title;
        self.artists = track.artists;
        self.duration = track.duration;
        self.time = track.time;
        self.imageId = track.album().image;

        // behavior
        self.onDeleteClick = function (deletedTrack) {
            pubSub.pub("trackForPlayer.onDeleteClick", deletedTrack);
        };
        
    }

    return TrackForPlayer;
})