define([], function() {
    function TabExtension(self) {
        self.toTracks = function () {
            if ("tracks" == self.name) return;
            self.navigate("/search/tracks");
        };
        self.toAlbums = function () {
            if ("albums" == self.name) return;
            self.navigate("/search/albums");
        };
        self.toPlaylists = function () {
            if ("playlists" != self.name)
                self.navigate("/search/playlists");
        };
    }

    return TabExtension;
})