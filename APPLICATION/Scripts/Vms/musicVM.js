define(["jqueryui", "ko", "pubSub", "Vms/viewBase", "elixir", "Types/Track", "Types/TrackSearchResults", "Types/TrackSearchParams", "Types/TrackSearchCommand", "checkbox"],
    function (jqueryui, ko, pubSub, viewBase, elixir, Track, TrackSearchResults, TrackSearchParams, TrackSearchCommand) {

        function MusicVM(viewName) {
            var self = this,
                curSearchCommand;


            self.setName(viewName);

            // Properties
            self.searchParams = new TrackSearchParams();
            self.searchResults = new TrackSearchResults();

            // Behavior
            self.goToMain = function () {
                self.activateView("main");
            };

            self.search = function () {
                if ((self.searchParams.query() || "").length < 3)
                    return;

                // cancel any pending search
                self.cancelSearch();

                // start new search
                curSearchCommand = new TrackSearchCommand(self.searchParams, self.searchResults);
                curSearchCommand.process();
            };

            self.cancelSearch = function () {
                if (curSearchCommand) {
                    curSearchCommand.cancel();
                    curSearchCommand = null;
                }
            };

            self.addToPlayList = function (track) {
                pubSub.pub("player.playTrack", track);
            };


            Custom.init(); //init custom checkbox
        };

        MusicVM.prototype = new viewBase();

        return MusicVM;
    })