define(["ko", "pubSub", "Vms/Extensions/Search", "Types/FancyDropItem", "Modules/dal"],
    function (ko, pubSub, SearchExtention, FancyDropItem, dal) {

        function initUi(containerId) {
            $("#" + containerId)
                .on("mouseenter", '.albumBlock .cover', function () {
                    $(this).find('.coverHover').animate({
                        marginTop: 0
                    }, 300);
                })
                .on("mouseleave", '.albumBlock .cover', function () {
                    $(this).find('.coverHover').animate({
                        marginTop: 33
                    }, 300);
                });
        }

        function SearchAlubumsVm(searchVm, options) {
            var self = this,
                lastPage = 0;

            initUi(options.containerId);

            self.vmId = options.vmId;
            self.sectionName = "Музыка";
            self.itemInfoUrl = options.detailUrl + "?clean=true&id=";
            self.searchResultSuffix = options.searchResultSuffix;
            SearchExtention(self, options.searchModes);

            // BEHAVIOR
            self.loadItems = function (cmd) {
                dal[options.dalMethod]({
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
                    artist: params.artistId || 0,
                    genre: params.genreId,
                    style: params.styleId,
                    hq: params.isHighQuality ? 1 : 0,
                    order: params.orderType,
                    timerange: params.timeRange,
                    page: params.page
                };
            };

            self.getNextPageNmb = function () {
                return lastPage + 1;
            };
        }

        return SearchAlubumsVm;
    })
