define(["ko", "Vms/viewBase", "pubSub", "Types/Track", "Types/TrackSearcher", "Types/TrackSearchResult", /*plugins w/o export*/ "jqueryui", "scroll"],
    function (ko, viewBase, pubSub, Track, TrackSearcher, TrackSearchResult) {
        
        // player ui setup
        $('#playerMainBlock .trackSlider').slider({
            range: "min",
            min: 0,
            max: 100,
            value: 0,
            animate: true,
            slide: function (event, ui) {
                console.log('position', ui.value);
            }
        });

        $('#playerMainBlock .trackVolume').slider({
            range: "min",
            min: 0,
            max: 100,
            value: 0,
            animate: true,
            slide: function (event, ui) {
                console.log('volume', ui.value);
            }
        });

//        $(".trackListBlock").mCustomScrollbar();

//        /* player switch between full and compact view */
//        $('.compactViewBtn').click(function () {
//            $('.playerHeader').animate({
//                height: ['toggle', 'swing'],
//                opacity: 'toggle'
//            }, 200, 'linear');

//            $('.playerPlaylistBlock').animate({
//                height: ['toggle', 'swing'],
//                opacity: 'toggle'
//            }, 200, 'linear');
//            $('.lockBackground').hide();
//            $('.playerMainBlock').removeClass('fillView');
//        });

//        $('.switchToFullView').click(function () {
//            $('.playerHeader').animate({
//                height: ['toggle', 'swing'],
//                opacity: 'toggle'
//            }, 200, 'linear');

//            $('.playerPlaylistBlock').animate({
//                height: ['toggle', 'swing'],
//                opacity: 'toggle'
//            }, 200, 'linear');

//            $('.lockBackground').show();
//            $('.playerMainBlock').addClass('fillView');
//        });

        //View Player View Model
        function Player(mainVm) {
            var self = this;

            // override base isVisible logic
            self.isVisible = ko.observable();
            self.supportedViews = ["music", "video", "artists"];

            pubSub.sub("viewChanged", function (viewName) {
                //var visible = $.inArray(viewName, self.supportedViews) != -1;
                //self.isVisible(visible);
                self.isVisible(false);
            });

            // Data
            self.currentTrack = ko.observable();
            self.playlist = ko.observableArray();
            self.state = ko.observable(); //play, pause, stop
            

            // Behavior
            pubSub.sub("player.playTrack", function(track) {
                if (self.currentTrack())
                    soundManager.destroySound(self.currentTrack().id());

                self.currentTrack(track);

                var sound = soundManager.createSound({
                    id: track.id(),
                    url: track.url()
                    //,whileloading: soundIsLoadingFunction
                });

                sound.play();
            });            

            self.playPause = function () {               
                if (self.state() == "pause" && self.currentTrackId()) {
                    soundManager.resume(self.currentTrackId());
                    soundManager.state("play");
                }                    
                else if (self.currentTrackId()) {
                    soundManager.state("play");
                }
            };
            
            // Methods

            function unpause() {
                
            }
        }

        Player.prototype = new viewBase();

        return Player;
    })