define(["jqueryui", "ko", "pubSub", "Vms/viewBase", "elixir", "Types/Track", "Types/SearchParams", "Types/LoadCommand", "Types/TrackForPlayer", "rollbar"],
    function (jqueryui, ko, pubSub, viewBase, elixir, Track, SearchParams, LoadCommand, TrackForPlayer) {

        function LoadManager($container, headerHeight, itemHeight, pagedModel) {
            var self = this,
                i,
                lastCommand,
                loadedPageItems = []; // ex: value 48 at 2nd index means that page1 + page2 + page3 together have 48 items

            var rollbar = $container.rollbar({
                minThumbSize: '25%',
                pathPadding: '3px',
                zIndex: 100,
                onScroll: onScrollMoved
            });

            // Data
            self.pageNmb = ko.observable();
            self.state = ko.observable("idle");   // idle, delayedSearch (postponed), activeSearch (working), loadingPage
            self.searchParams = new SearchParams(onSearchUpdate);
            
            // Computed Data
            self.hasQuery = ko.computed(function () {
                return self.searchParams.query() && self.searchParams.query().length > 0;
            });

            self.hasPendingSearch = ko.computed(function () {
                return self.state() == "delayedSearch" || self.state() == "activeSearch";
            });
            
            self.hasPendingPage = ko.computed(function () {
                return self.state() == "loadingPage";
            });

            // Behavior
            self.clearQuery = function () {
                if (self.state() == "delayedSearch") {
                    self.searchParams.query("");
                    self.state("canceled");     // cancel only if we were in delayedSearch before self.searchParams.query("")
                } else {
                    self.searchParams.query("");
                }
            };

            self.onQueryKeyUp = function (data, event) {
                if (event.keyCode == 27) { //esc
                    self.clearQuery();
                }
            };

            self.addPage = function () {
                var curPageIndex = self.pageNmb() - 1;
                var prevPageIndex = curPageIndex - 1;
                var indexOfFirstTrack = prevPageIndex < 0 ? 0 : loadedPageItems[prevPageIndex];
                var indexOfLastTrack = loadedPageItems[curPageIndex] - 1;

                var tracksOnPage = [];
                for (i = indexOfFirstTrack; i <= indexOfLastTrack; i++) {
                    tracksOnPage.push(pagedModel.items()[i]);
                }                
                pubSub.pub("player.addToStartAndPlayFirst", tracksOnPage);
            };

            // Methods            
            function onScrollMoved(scrollState) {
                // refresh page number
                var indexOfMiddleItem = (scrollState.vPxl + scrollState.vVisiblePxl / 2 - headerHeight) / itemHeight;
                var pageNmb = null;
                for (i = 0; i < loadedPageItems.length; i++) {
                    if (indexOfMiddleItem < loadedPageItems[i]) {
                        pageNmb = i + 1;
                        break;
                    }
                }
                if (pageNmb == null) throw "Check the logic: pageNmb should be always resolved";
                self.pageNmb(pageNmb);

                // check if we get to the bottom
                if (scrollState.vPcnt == 1) {
                    loadPage(loadedPageItems.length + 1);
                }
            };

            function onSearchUpdate() {
                // if we canceled and continued typing then revive pending request
                if (self.state() == "canceled") {
                    self.state("delayedSearch");
                    return;
                }

                // if search is already postponed then just return
                if (self.state() == "delayedSearch")
                    return;

                // for idle, work => postpone new search
                setTimeout(function () { loadSearch(); }, 1000);
                self.state("delayedSearch");
            }

            function loadSearch() {
                if (self.state() == "canceled") return;

                if (lastCommand) lastCommand.cancel();

                self.state("activeSearch");
                lastCommand = new LoadCommand(self.searchParams, 1, onLoadSuccess, onLoadFail);
            }

            function loadPage(page) {
                // load page if we are not waiting for searchResults
                if (self.state() == "delayedSearch" || self.state() == "activeSearch" || self.state() == "loadingPage")
                    return;

                self.state("loadingPage");
                lastCommand = new LoadCommand(self.searchParams, page, onLoadSuccess, onLoadFail);
                console.log("loadPage: " + page);
            }

            function onLoadSuccess(items, page, totalCount) {
                console.log("onLoadSuccess: " + page);
                // only if we have pending request we won't become idle
                if (self.state() != "delayedSearch")
                    self.state("idle");

                // if that is search load, then clear up old results
                if (page == 1) {
                    pagedModel.items.removeAll();
                    rollbar.reset();
                    loadedPageItems = [];
                    self.pageNmb(1);
                }
                
                // set total count
                pagedModel.totalCount(totalCount);

                // add items                
                for (i = 0; i < items.length; i++) {
                    pagedModel.items.push(items[i]);
                }

                // update page info (!!! only after items are added)
                var lastLoadedItemAmount = loadedPageItems.length == 0 ? 0 : loadedPageItems[loadedPageItems.length - 1];
                loadedPageItems.push(lastLoadedItemAmount + items.length);
                rollbar.update();
            }

            function onLoadFail(error) {
                // TODO: report error
                //...

                // return to initial state
                self.state("idle");
            }
            
            // do initial emtpy search
            loadPage(1);
        }

        function MusicVM(viewName) {

            var self = this;

            // init base class logic
            self.setName(viewName);

            // PAGED MODEL PROPERTIES
            self.loadManager = new LoadManager($('#musicContent'), 90, 34, self);            
            self.items = ko.observableArray();
            self.totalCount = ko.observable();
            // PAGED MODEL PROPERTIES end


            // Behavior
            self.goToMain = function () {
                self.activateView("main");
            };

            self.addToPlayList = function (track) {
                pubSub.pub("player.playTrack", track);
            };
        };

        MusicVM.prototype = new viewBase();

        return MusicVM;
    })