define(["ko", "pubSub", "Vms/Extensions/Search", "Vms/Extensions/Tabs", "Types/FancyDropItem", "Modules/dal"],
    function (ko, pubSub, SearchExtention, TabsExtension, FancyDropItem, dal) {

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

        function SearchArtistsVm(searchVm) {
            var self = this,
                lastPage = 0;
            
            initUi("searchAristsVm");

            // DATA
            self.vmId = "artists";
            self.sectionName = "Люди";
            self.itemInfoUrl = "/artist?clean=true&id=";
            SearchExtention(self);
            TabsExtension(self, "people");


            // BEHAVIOR
            self.loadItems = function (cmd) {
                dal.searchArtists({
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
                params.query = $.trim(self.query());
                params.page = page || 1;

                return { // convert to elixir formar
                    query: encodeURIComponent(params.query),
                    artist: params.artistId || 0,
                    genre: params.genreId,
                    style: params.styleId,
                    hq: params.isHighQuality ? 1 : 0,
                    order: params.orderType,
                    timerange: params.timeRange,
                    page: params.page
                };;
            };

            self.getNextPageNmb = function () {
                return lastPage + 1;
            };            
        }

        return SearchArtistsVm;
    })