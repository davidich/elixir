define(["jqueryui", "ko", "pubSub", "Vms/viewBase", "Types/Track", "Types/TrackSearcher", "Types/TrackSearchResult"],
    function (jqueryui, ko, pubSub, viewBase, Track, TrackSearcher, TrackSearchResult) {
       
    function MusicVM(viewName) {
        var self = this;

        self.setName(viewName);

        // Properties
        self.searchQuery = ko.observable();
        self.searchResult = new TrackSearchResult();
        
        
        // Behavior
        self.goToMain = function() {
            self.activateView("main");
        };
        
        self.search = function () {
            TrackSearcher.search(self.searchQuery(), self.searchResult);
        };

        self.addToPlayList = function(track) {
            pubSub.pub("player.playTrack", track);
        };

    };

    MusicVM.prototype = new viewBase();
        
    return MusicVM;
})