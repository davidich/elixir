define(["ko", "Vms/base", "carousel"], function (ko, BaseVm) {

    function WelcomeVm() {
        var self = this;

        $.extend(self, new BaseVm("welcome"));

        self.goToTrack = function () {
            self.navigate("/search/track");
        };

        self.goToTracks = function () {
            self.navigate("/search/tracks");
        };        

        self.afterVisibleApplied = function(isVisible) {
            if (isVisible) initCarousel();
        };
        

        var carouselInited = false;
        function initCarousel() {
            if (carouselInited) return;

            carouselInited = true;

            $('.welcomeSlider').carouFredSel({
                circular: true,
                infinite: true,
                auto: {
                    play: true,
                    timeoutDuration: 7000
                },
                prev: '.slide_prevBig',
                next: '.slider_nextBig',
                align: "left"
            });
        }
    };

    return WelcomeVm;
})