define(["ko", "pubSub", "Vms/base", "Vms/Search/params", "Types/FancyDropItem", "Modules/dal"], function (ko, pubSub, BaseVm, searchParamVm, FancyDropItem, dal) {

    var searchModes = [
           new FancyDropItem("all", "По всему"),
           new FancyDropItem("artist", "По исполнителю"),
           new FancyDropItem("title", "По треку")
    ];


    function LoadCommand(executeLogic, params, type) {
        var self = this;
        
        // data contract
        if (!executeLogic) throw "executeLogic is a mandatory parameter";
        if (!params) throw "params is a mandatory parameter";
        if (type != "search" && type != "page") throw "type value can only be 'search' or 'page'";
        
        // input
        self.params = params;
        self.executeLogic = executeLogic;
        self.type = type;
        self.cancellationToken = { isCanceled: false };

        // output
        self.state = ko.observable("idle");
        self.data = null;
        
        // methods
        self.execute = function() {
            self.state("working");
            executeLogic(self);
        };
                
        self.cancel = function() {
            self.state("canceled");
            self.cancellationToken.isCanceled = true;
        };

        self.isAlive = function() {
            return self.state() == "scheduled" || self.state() == "working";
        };

        //// events
        //var completeCallbacks = [];
        //self.addCompleteCallback = function(callback) { completeCallbacks.push(callback); };
        //self.onComplete = function() {
        //    $.each(completeCallbacks, function(/*i, callback*/) { /*callback();*/
        //        this();
        //    });
        //};

        //self.state.subscribe(function(newState) {
        //    if (self.state() != "canceled" && (newState == "success" || newState == "fail"))
        //        self.onComplete();
        //});
    }

    function LoadManager() {
        var self = this,
            command = null;
                
        // Data
        self.command = ko.observable();
        self.delayedSearchParams = ko.observable();
        self.loadToken = ko.observable();

        self.isSearching = ko.computed(function() {
            return self.delayedSearchParams() || self.loadToken() && self.loadToken().type == "search";
        });

        self.isLoadingPage = ko.computed(function() {
            return self.loadToken() && self.loadToken().type == "page";
        });

        // Behavior
        self.queueCommand = function(cmd) {
            if (cmd.type == "search") {
                queueSearch(cmd);
            }
            if (cmd.type == "page") {
                loadPage(cmd);
            }
        };

        
        
        function queueSearch (cmd) {
            // save current command state since we need it after we override it with "canceled"
            var state = self.command() && self.command().state();

            // Have any command?
            // New search request has higher priority over page loading and privious search
            if (self.command()) self.command().cancel();

            // set current command
            self.command(cmd);            
            
            // schedule search
            if (state == "scheduled") return;
            setTimeout(executeCurrentCommand, global.searchDelay);
            self.command().state("scheduled");
        };

        function loadPage (cmd) {
            // disregard any page reqeuest when we have pending search request            
            if (self.command().isAlive()) return;

            self.command(cmd);
            executeCurrentCommand();
        };
        
        function executeCurrentCommand() {
            //self.command().addCompleteCallback(onComplete);
            self.command().execute(self);
        }

        //self.onComplete = function() {
        //    self.loadToken = null;
        //};
    }

    
    function TrackVm() {
        
        // Private members
        var self = this,
            i,
            loadedPageItems = []; // ex: value 48 at 2nd index means that page1 + page2 + page3 together have 48 items
            


        
        function getLoadParams(page) {
            var params = searchParamVm.toJS();
            params.query = $.trim(self.query());
            params.searchMode = self.searchMode();
            params.page = page || 1;

            return params;
        }
        
        // Init
        $.extend(self, new BaseVm("tracks"));
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
        function doSearch() {
            var params = getLoadParams();
            var command = new LoadCommand(loadTracks, params, "search");
            self.loadMgr.queueCommand(command);
        }
        
        function loadTracks(cmd) {
            dal.loadTracks({
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

                    self.totalCount(totalCount);
                    $.each(tracks, function() { self.tracks.push(this); });

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
            pubSub.pub("player.addToStartAndPlayFirst", tracksOnPage);
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
        
        // Events
        pubSub.pub("scroll.moved", function (scrollState) {
            if (!self.isVisible()) return;

            // refresh page number
            var indexOfMiddleItem = (scrollState.vPxl + scrollState.vVisiblePxl / 2 - global.headerHeight) / global.tracksItemHeight;
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
                var nextPageNmb = loadedPageItems.length + 1;                
                var params = getLoadParams(nextPageNmb);
                var command = new LoadCommand(loadTracks, params, "page");
                self.loadMgr.loadPage(command);
            }
        });        
}

    return new TrackVm();
})