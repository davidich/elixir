define(["ko", "Vms/base"], function (ko, BaseVm) {

    function WelcomeVm() {
        var self = this;

        $.extend(self, new BaseVm("welcome"));

        self.goToTrack = function() {
            self.navigate("/search/track");
        };

        self.goToTracks = function () {
            self.navigate("/search/tracks");
        };
    };    

    return WelcomeVm;
})