define(["jqueryui", "ko", "pubSub", "Vms/viewBase", "elixir", "Types/Track", "Types/TrackSearchResults", "Types/TrackSearchParams"],
    function (jqueryui, ko, pubSub, viewBase, elixir, Track, TrackSearchResults, TrackSearchParams) {

        function MusicVM(viewName) {
            var self = this;

            self.setName(viewName);
           
            // Properties
            self.searchParams = new TrackSearchParams();
            self.searchResults = new TrackSearchResults();
            
            // Behavior
            self.goToMain = function () {
                self.activateView("main");
            };

            self.search = function () {
                self.searchParams.orderType("popular");
                //elixir.searchTracks(self.searchParams.toJS(), self.searchResults);                               
            };

            self.addToPlayList = function (track) {
                pubSub.pub("player.playTrack", track);
            };

        };

        MusicVM.prototype = new viewBase();

        return MusicVM;
    })