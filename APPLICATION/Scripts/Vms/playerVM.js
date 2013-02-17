define(["ko", "Vms/viewBase", "pubSub", "Types/Track", "Types/TrackForPlayer", "Types/SequenceMananager", /*plugins w/o export*/ "jqueryui", "scroll"],
function (ko, viewBase, pubSub, Track, TrackForPlayer, sequenceManager) {

    // player ui setup
    (function () {
        $('.compactViewBtn').click(function () {
            $('.playerHeader').animate({
                height: ['toggle', 'swing'],
                opacity: 'toggle'
            }, 200, 'linear');

            $('.playerPlaylistBlock').animate({
                height: ['toggle', 'swing'],
                opacity: 'toggle'
            }, 200, 'linear');
            $('.lockBackground').hide();
            $('.playerBlock').removeClass('fullView');
        });

        $('.switchToFullView').click(function () {
            $('.playerHeader').animate({
                height: ['toggle', 'swing'],
                opacity: 'toggle'
            }, 200, 'linear');


            $('.playerPlaylistBlock').animate({
                height: ['toggle', 'swing'],
                opacity: 'toggle'
            }, 200, 'linear');

            $('.lockBackground').show();
            $('.playerBlock').addClass('fullView');
        });
        
        $(".trackListBlockScrollWrapper").mCustomScrollbar();
    })();


    //View Player View Model
    function Player() {
        var self = this;


        // override base isVisible logic
        self.isVisible = ko.observable();
        pubSub.sub("viewChanged", function (viewName) {
            self.isVisible($.inArray(viewName, ["music", "video", "artists"]) != -1);
        });
        

        // Build UI
        var $slider = $('.trackSlider').slider({
            range: "min",
            min: 0,
            max: 0,
            value: 0,
            animate: true,
            slide: function (event, ui) { self.refreshPosition(ui.value); }
        });
        
        var $volume = $('.trackVolume').slider({
            range: "min",
            min: 0,
            max: 100,
            value: 100,
            animate: true,
            slide: function (event, ui) {
                self.isMuted(false);
                self.volume(ui.value);
                self.refreshVolume();
            }
        });
        

        // DATA
        self.track = ko.observable();
        self.tracks = ko.observableArray();
        self.state = ko.observable("paused"); //playing, paused, stoped
        self.isElapsed = ko.observable(true);
        self.isShuffled = ko.observable(false);
        self.isLooped = ko.observable(false);
        self.position = ko.observable(0);
        self.isMuted = ko.observable(false);        
        self.volume = ko.observable(100);                
        self.time = ko.computed(function () {
            if (!self.track()) return "0:00";

            var pos;
            if (!self.isElapsed()) {
                pos = self.position();
                return Track.toTimeString(pos);
            } else {
                pos = self.track().duration() - self.position();
                return "-" + Track.toTimeString(pos);
            }
        });
        self.sound = function () {
            if (!self.track())
                return null;

            var id = self.track().id();
            var url = self.track().url();

            return soundManager.getSoundById(id)
                || soundManager.createSound({
                    id: id,
                    url: url,
                    whileplaying: function () {
                        var posInSecs = this.position / 1000;
                        self.refreshPosition(posInSecs, true /*skipSoundUpdate*/);
                    }
                });
        };
        

        // BEHAVIOR        
        self.playPause = function () {
            if (self.state() != "playing")
                play();
            else
                pause();
        };

        self.next = function () {
            if (!self.track()) return;

            var curIndex = self.tracks.indexOf(self.track());
            var trackLength = self.tracks().length;
            var isShuffled = self.isShuffled();
            var newIndex = sequenceManager.getNext(curIndex, trackLength, isShuffled);

            self.track(self.tracks()[newIndex]);
            if (self.state() == "playing") play();
        };

        self.prev = function () {
            if (!self.track()) return;

            var curIndex = self.tracks.indexOf(self.track());
            var trackLength = self.tracks().length;
            var isShuffled = self.isShuffled();
            var newIndex = sequenceManager.getPrev(curIndex, trackLength, isShuffled);

            self.track(self.tracks()[newIndex]);
            if (self.state() == "playing") play();
        };

        self.refreshVolume = function () {
            var resolvedVolume = !self.isMuted()
                ? self.volume()
                : 0;

            // UI
            if ($volume.slider("option", "value") != resolvedVolume)
                $volume.slider("option", "value", resolvedVolume);

            // functional update
            var sound = self.sound();
            if (sound && sound.volume != resolvedVolume) sound.setVolume(resolvedVolume);
        };

        self.refreshPosition = function(positionInSecs, skipSoundUpdate) {
            var sound = self.sound();
            if (!sound) return;

            // prevent sliding over the loaded part            
            var maxPosition = sound.duration / 1000;
            if (positionInSecs > maxPosition) positionInSecs = maxPosition;

            // UI
            if ($slider.slider("option", "value") != positionInSecs)
                $slider.slider("option", "value", positionInSecs);

            // functional update
            if (!skipSoundUpdate) sound.setPosition(positionInSecs * 1000);
            self.position(parseInt(positionInSecs));
        };
        

        // EVENTS
        pubSub.sub("track.onPlayClick", function (track) {
            var tr = new TrackForPlayer(track);
            self.tracks.push(tr);
            self.track(tr);
            play();
        });

        pubSub.sub("trackForPlayer.onDeleteClick", function (deletedTrack) {
            // try to start playing next track
            if (self.track() == deletedTrack && self.tracks().length > 1)
                self.next();

            // is that was last instance of that track in playlist?
            var itemsWithTheSameId = $.grep(self.tracks(), function (elem) { return elem.id() == deletedTrack.id(); });
            if (itemsWithTheSameId.length <= 1) soundManager.destroySound(deletedTrack.id());

            // remove item from playlist
            var index = self.tracks.indexOf(deletedTrack);
            self.tracks.splice(index, 1);
        });


        // Helpers
        function play() {
            var sound = self.sound();
            if (!sound) return;

            if (sound.paused) {
                sound.resume();
            } else {
                stop();
                sound.play();
                refreshSliderLength();
            }

            self.state("playing");
        }

        function stop() {
            self.state("stoped");
            if (!self.track()) return;
            
            soundManager.stopAll();
            refreshSliderLength();
        }

        function pause() {
            var sound = self.sound();
            if (!sound) return;
            
            sound.pause();
            self.state("paused");
        }

        function refreshSliderLength() {
            if(!self.track() || self.state() == "stopped")
                $slider.slider("option", "max", 0);
            else
                $slider.slider("option", "max", self.track().duration());
        }
       
    }

    Player.prototype = new viewBase();

    return Player;
})
