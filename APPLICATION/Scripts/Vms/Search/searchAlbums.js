define(["ko", "pubSub", "Vms/Extensions/Search", "Vms/Extensions/Tabs", "Types/FancyDropItem", "Modules/dal"],
    function (ko, pubSub, SearchExtention, TabsExtension, FancyDropItem, dal) {



        function SearchAlubumsVm(searchVm, options) {
            var self = this,
                lastPage = 0;

            // DATA
            self.isPlayerVisible = true;
            self.vmId = options.vmId;
            self.sectionName = "Музыка";
            self.itemInfoUrl = options.detailUrl + "?clean=true&id=";
            self.searchResultSuffix = options.searchResultSuffix;
            SearchExtention(self, options.searchModes);
            TabsExtension(self, "music");

            // BEHAVIOR
            self.loadItems = function (cmd) {
                dal.search("album", {
                    cancellationToken: cmd.cancellationToken,
                    params: cmd.params,
                    onSuccess: function (items, totalCount) {
                        cmd.state("success");

                        if (cmd.type == "search") {
                            lastPage = 0;
                            self.items.removeAll();
                            pubSub.pub("scroll.reset");
                        }

                        self.totalCount(totalCount);
                        $.each(items, function () { self.items.push(this); });

                        lastPage++;
                        pubSub.pub("scroll.update");
                    },
                    onFail: function (error) {
                        cmd.state("fail");
                        console.error(error);
                    }
                });
            };

            self.getLoadParams = function (page) {
                var params = searchVm.getParams();

                // add view specific params
                params.query = encodeURIComponent($.trim(self.query()));
                params.searchMode = self.searchMode();
                params.artist = params.artist || 0;
                params.page = page || 1;

                return { // convert to elixir api format
                    query: encodeURIComponent(params.query),
                    by: params.searchMode,
                    genre: params.genreId,
                    style: params.styleId,
                    hq: params.isHighQuality ? 1 : 0,
                    order: params.orderType,
                    timerange: params.timeRange,
                    artist: params.artist,
                    user: params.user,
                    page: params.page
                };
            };

            self.getNextPageNmb = function () {
                return lastPage + 1;
            };
        }

        return SearchAlubumsVm;
    })
