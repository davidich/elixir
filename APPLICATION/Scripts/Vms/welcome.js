define(["ko", "Vms/Extensions/Routing", "carousel"], function (ko, RoutingExtension) {

    function WelcomeVm() {
        var self = this;

        //$.extend(self, new BaseVm("welcome"));
        RoutingExtension(self, "welcome");

        self.goToTrack = function () {
            self.navigate("/search/track");
        };

        self.goToTracks = function () {
            self.navigate("/search/tracks?query=dido");
        };        

        self.onShow = function() {
            initCarousel();
        };

        self.sliderData = global.welcomeData;
        
        var carouselInited = false;
        function initCarousel() {
            if (carouselInited) return;

            carouselInited = true;

            $('.centerBlock').fadeIn(1500);
            
            $('.welcomeSlider').carouFredSel({
                circular: true,
                infinite: true,
                auto: {
                    play: true,
                    timeoutDuration: 7000
                },
                prev: '.slider_prevBig',
                next: '.slider_nextBig',
                align: "left"
            });
        }
    };

    return new WelcomeVm();
})
