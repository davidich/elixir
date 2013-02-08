define(["jqueryui", "ko", "pubSub", "Vms/viewBase", "elixir", "Types/Track", "Types/SearchResults", "Types/SearchParams", "Types/SearchCommand", "Types/GenreSelector"],
    function (jqueryui, ko, pubSub, viewBase, elixir, Track, SearchResults, SearchParams, SearchCommand) {

        function MusicVM(viewName) {

            var self = this,
                searchCommand;

            // init base class logic
            self.setName(viewName);
            

            // Properties                        
            self.oSearchParams = new SearchParams();
            self.oSearchResults = new SearchResults();
            self.searchState = ko.observable("idle");   // idle, postponed, working, canceled
            
            
            // Behavior
            self.goToMain = function () {
                self.activateView("main");
            };

            self.hasPendingSearch = ko.computed(function() {
                return self.searchState() == "postponed" || self.searchState() == "working";
            });
            
            self.searchState.subscribe(function(newVal) {
                console.log("state:" + newVal);
            })

            // SEARCH            
            pubSub.sub("searchParams.onChange", function() {
                // if we canceled and continued typing then revive search
                if (self.searchState() == "canceled") {
                    self.searchState("postponed");
                    return;
                }
                    
                // if search is already postponed then just return
                if (self.searchState() == "postponed")
                    return;
                
                // for idle, work => postpone new search
                setTimeout(startSearch, 1000);
                self.searchState("postponed");
            });
            
            pubSub.sub("searchCommand.onComplete", function (error) {
                // show error if we have some
                if (error) console.error(error);

                // only if we have pending request we won't become idle
                if (self.searchState() != "postponed") self.searchState("idle");
            });
            
            function startSearch() {
                // check if results are still needed
                if (self.searchState() == "canceled") {
                    self.searchState("idle");
                    return;
                }
                
                // if we have some command => disregard pending results
                if (searchCommand) searchCommand.cancel();
                
                // we get here => we need to work
                self.searchState("work");
                searchCommand = new SearchCommand(self.oSearchParams, self.oSearchResults);
            }
            
            self.cancelSearch = function() {
                if (self.searchState() == "postponed" || self.searchState() == "working") {
                    if (searchCommand) searchCommand.cancel();
                    self.searchState("canceled");
                }
            };
            // SEARCH END






            self.addToPlayList = function (track) {
                pubSub.pub("player.playTrack", track);
            };            
        };

        MusicVM.prototype = new viewBase();

        return MusicVM;
    })