define(["ko", "pubSub", "Vms/base", "Vms/Search/track", "Vms/Search/tracks", "Vms/Search/player", "Vms/Search/params"], function (ko, pubSub, BaseVm, trackVm, tracksVm, playerVm, paramsVm) {

    function SearchVm() {
        var self = this;

        var rollbar = $("#searchVm").rollbar({
            minThumbSize: '25%',
            pathPadding: '3px',
            zIndex: 100,
            onScroll: function (scrollState) {
                pubSub.pub("scroll.moved", scrollState);
            }
        });

        $.extend(self, new BaseVm("search"));
        self.addVm(trackVm);
        self.addVm(tracksVm);
        //self.addVm(new AlbumVm());
        //self.addVm(new AlbumsVm());
        //self.addVm(new PlaylistVm());
        //self.addVm(new PlaylistsVm());

        self.params = paramsVm;
        self.player = playerVm;


        pubSub.sub("scroll.reset", function () {
            rollbar.reset();
        });
        pubSub.sub("scroll.reset", function () {
            rollbar.update();
        });
    }

    return SearchVm;
})