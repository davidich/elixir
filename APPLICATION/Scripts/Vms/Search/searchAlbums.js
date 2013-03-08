define(["ko", "pubSub", "Vms/Extensions/Search", "Types/FancyDropItem", "Modules/dal"],
    function (ko, pubSub, SearchExtention, FancyDropItem, dal) {

        var searchModes = [
               new FancyDropItem("all", "По всему"),
               new FancyDropItem("album_name", "По альбому"),
               new FancyDropItem("artist_name", "По исполнителю")
        ];

        $("#searchAlbumsVm").on("mouseenter", '.albumBlock .cover', function () {
            $(this).find('.coverHover').animate({
                marginTop: 0
            }, 300);
        });

        $("#searchAlbumsVm").on("mouseleave", '.albumBlock .cover', function () {
            $(this).find('.coverHover').animate({
                marginTop: 33
            }, 300);
        });

        function SearchAlubumsVm(searchVm) {
            var self = this,
                lastPage = 0;

            self.vmId = "albums";
            self.sectionName = "Музыка";
            self.itemInfoUrl = "/search/album?clean=true&id=";
            SearchExtention(self, searchModes);
            
            // BEHAVIOR
            self.loadItems = function (cmd) {
                dal.searchAlbums({
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
