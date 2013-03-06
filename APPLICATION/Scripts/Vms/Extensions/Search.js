define(["ko", "pubSub", "json", "Vms/Extensions/Routing", "Vms/Extensions/Tab", "Types/LoadCommand", "Types/LoadManager"],
    function (ko, pubSub, JSON, RoutingExtension, TabExtension, LoadCommand, LoadManager) {
        
        function SearchExtension(self, searchModes) {
            // Init
            RoutingExtension(self, self.vmId, self.sectionName);
            TabExtension(self);
            self.loadMgr = new LoadManager(self.processLoadRequest);

            // Data            
            self.query = ko.observable("");
            self.hasQuery = ko.computed(function () {
                return self.query() && $.trim(self.query()).length > 0;
            });
            self.searchMode = ko.observable("all");
            self.searchModes = ko.observableArray(searchModes);

            self.items = ko.observableArray();
            self.totalCount = ko.observable();

            // Behaviour
            self.clearQuery = function () {
                self.query("");
            };

            self.doSearch = function () {
                var params = self.getLoadParams();
                var command = new LoadCommand(self.loadItems, params, "search");
                self.loadMgr.queueCommand(command);
            };

            self.doPageLoad = function (page) {
                var params = self.getLoadParams(page);
                var command = new LoadCommand(self.loadItems, params, "page");
                self.loadMgr.queueCommand(command);
            };

            self.openDetails = function (item) {
                self.navigate(self.itemInfoUrl + item.id);
            };

            // Search triggers
            pubSub.sub("search.changed", function (propName) {
                if (!self.isVisible()) return;
                if (self.query() && (propName == "orderType" || propName == "timeRange")) return;
                self.doSearch();
            });

            self.query.subscribe(function () {
                self.doSearch();
            });

            self.searchMode.subscribe(function () {
                if (self.query()) self.doSearch();
            });

            // clear on ESC
            self.onQueryKeyUp = function (data, event) {
                if (event.keyCode == 27) {
                    self.clearQuery();
                }
            };

            // Events                      
            pubSub.sub("scroll.moved", function (scrollState) {
                if (!self.isVisible()) return;

                if (self.onScroll) self.onScroll(scrollState);

                // check if we need to load next page
                if (scrollState.vPcnt == 1) {
                    self.doPageLoad(self.getNextPageNmb());
                }
            });

            var lastLoadParams;
            self.onHide = function () {
                if (self.items().length > 0)
                    lastLoadParams = JSON.stringify(self.getLoadParams(1));
            };

            self.onShow = function () {
                pubSub.pub("scroll.reset");
                pubSub.pub("scroll.update");

                // if params are changed since last time then reload data
                if (lastLoadParams != JSON.stringify(self.getLoadParams(1))) {
                    self.items.removeAll();
                    self.doPageLoad(1);
                }
            };
        }

        return SearchExtension;
    })