define(["ko", "pubSub", "json", "Vms/Extensions/Routing", "Vms/Extensions/Tab", "Types/FancyDropItem", "Modules/dal", "Types/LoadCommand", "Types/LoadManager"],
    function (ko, pubSub, JSON, RoutingExtension, TabExtension, FancyDropItem, dal, LoadCommand, LoadManager) {

        var searchModes = [
               new FancyDropItem("all", "По всему"),
               new FancyDropItem("artist", "По исполнителю"),
               new FancyDropItem("title", "По треку")
        ];


        function TrackVm(searchVm) {
            // Private members
            var self = this,
                i,
                loadedPageItems = []; // ex: value 48 at 2nd index means that page1 + page2 + page3 together have 48 items

            // Init
            RoutingExtension(self, "tracks", "Музыка");
            TabExtension(self);
            self.loadMgr = new LoadManager(self.processLoadRequest);

            // Data
            self.pageNmb = ko.observable();

            self.query = ko.observable("");
            self.hasQuery = ko.computed(function () {
                return self.query() && $.trim(self.query()).length > 0;
            });
            self.searchMode = ko.observable("all");
            self.searchModes = ko.observableArray(searchModes);

            self.tracks = ko.observableArray();
            self.totalCount = ko.observable();


            // Behaviour
            function getLoadParams(page) {
                var params = searchVm.getParams();
                params.query = $.trim(self.query());
                params.searchMode = self.searchMode();
                params.page = page || 1;

                return params;
            }

            function doSearch() {
                var params = getLoadParams();
                var command = new LoadCommand(loadTracks, params, "search");
                self.loadMgr.queueCommand(command);
            }

            function doPageLoad(page) {
                var params = getLoadParams(page);
                var command = new LoadCommand(loadTracks, params, "page");
                self.loadMgr.queueCommand(command);
            }

            function loadTracks(cmd) {
                dal.searchTracks({
                    cancellationToken: cmd.cancellationToken,
                    params: cmd.params,
                    onSuccess: function (tracks, totalCount) {
                        cmd.state("success");

                        if (cmd.type == "search") {
                            loadedPageItems = [];
                            self.pageNmb(1);
                            self.tracks.removeAll();
                            pubSub.pub("scroll.reset");
                        }
                        else if (cmd.type == "page" && self.tracks().length == 0) {
                            self.pageNmb(1);
                        }

                        self.totalCount(totalCount);
                        $.each(tracks, function () { self.tracks.push(this); });

                        // update page info (!!! only after items are added)
                        var lastLoadedItemAmount = loadedPageItems.length == 0 ? 0 : loadedPageItems[loadedPageItems.length - 1];
                        loadedPageItems.push(lastLoadedItemAmount + tracks.length);
                        pubSub.pub("scroll.update");
                    },
                    onFail: function (error) {
                        cmd.state("fail");
                        // show warning dialog
                        console.error(error);
                    }
                });
            }

            self.addPageToPlayer = function () {
                var curPageIndex = self.pageNmb() - 1;
                var prevPageIndex = curPageIndex - 1;
                var indexOfFirstTrack = prevPageIndex < 0 ? 0 : loadedPageItems[prevPageIndex];
                var indexOfLastTrack = loadedPageItems[curPageIndex] - 1;

                var tracksOnPage = [];
                for (i = indexOfFirstTrack; i <= indexOfLastTrack; i++) {
                    tracksOnPage.push(self.tracks()[i]);
                }
                pubSub.pub("player.addToStart", tracksOnPage);
            };

            self.clearQuery = function () {
                self.query("");
            };

            // Search triggers
            pubSub.sub("search.changed", function (propName) {
                if (!self.isVisible()) return;
                if (self.query() && (propName == "orderType" || propName == "timeRange")) return;
                doSearch();
            });

            self.query.subscribe(function () {
                doSearch();
            });

            self.searchMode.subscribe(function () {
                if (self.query()) doSearch();
            });

            self.onQueryKeyUp = function (data, event) {
                if (event.keyCode == 27) { //esc
                    self.clearQuery();
                }
            };

            self.openTrackInfo = function (track) {
                self.navigate("/search/track?id=" + track.id + "&clean=true");
            };

            // Events
            pubSub.sub("scroll.moved", function (scrollState) {
                if (!self.isVisible()) return;

                // refresh page number
                var indexOfMiddleItem = (scrollState.vPxl + scrollState.vVisiblePxl / 2 - global.tracks.topSpaceBeforeFirstItem) / global.tracks.itemHeight;
                var pageNmb = null;
                if (loadedPageItems.length == 0)
                    pageNmb = 0;
                else {
                    for (i = 0; i < loadedPageItems.length; i++) {
                        if (indexOfMiddleItem < loadedPageItems[i]) {
                            pageNmb = i + 1;
                            break;
                        }
                    }
                }

                if (pageNmb == null) throw "Check the logic: pageNmb should be always resolved";
                self.pageNmb(pageNmb);

                // check if we get to the bottom
                if (scrollState.vPcnt == 1) {
                    var nextPageNmb = loadedPageItems.length + 1;
                    doPageLoad(nextPageNmb);
                }
            });

            var lastLoadParams;

            self.onHide = function () {
                if (self.tracks().length > 0)
                    lastLoadParams = JSON.stringify(getLoadParams(1));
            };

            self.onShow = function (navigationParams) {
                if (navigationParams)
                    console.log();

                pubSub.pub("scroll.reset");
                pubSub.pub("scroll.update");
                // if params are changed since last time then reload data
                if (lastLoadParams != JSON.stringify(getLoadParams(1))) {
                    self.tracks.removeAll();
                    doPageLoad(1);
                }
            };
        }

        return TrackVm;
    })