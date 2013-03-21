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

        self.onShow = function (args) {
            self.agrs = args;
            if (args == null || args.type == 'welcome') {
                $('.welcomeBlock').addClass('welcomeView');
                $('.welcomeBlock').removeClass('eventsView');
                $('.rightPart, .leftPart, .topPart').attr('href', 'javascript:void(0);');

            } else {
                $('.welcomeBlock').removeClass('welcomeView');
                $('.welcomeBlock').addClass('eventsView');
                $('.rightPart, .leftPart, .topPart').removeAttr('href');
            }
            initCarousel();
        };

        self.sliderData = global.welcomeData;

        self.showPopup = function () {
            var activeSlide = $($('ul#welcomeEventSilder li:first'));
            var title = activeSlide.attr('data-title');
            var fileName = activeSlide.attr('data-file');

            $(dialog).dialog("option", "title", title);
            $(dialog).dialog("open");
            $.ajax({
                method: 'Get',
                url: 'Html/events/' + fileName,
                beforeSend: function () {
                    $(dialog).html("");
                },
                success: function (data) {
                    $(dialog).html(data);
                    var rollbar = $(".eventDetailContainer").rollbar({
                        pathPadding: '3px'
                    });
                    rollbar.update();
                }
            });
        };


        var dialog = $('<div class="eventDetailContainer"></div>').dialog({
            dialogClass: 'customDialog',
            draggable: false,
            resizable: false,
            autoOpen: false,
            modal: true,
            width: 501,
            height: 483,
            buttons: [{
                text: "",
                icons: {},
                'class': 'giftButton'

            }, {
                text: 'закрыть',
                icons: {
                    primary: 'close'
                },
                click: function() {
                    $(this).dialog("close");
                }
            }
            ]
        });

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
                    timeoutDuration: 70000
                },
                prev: '.slider_prevBig',
                next: '.slider_nextBig',
                align: "left"
            });
        }


    };

    return new WelcomeVm();
})
