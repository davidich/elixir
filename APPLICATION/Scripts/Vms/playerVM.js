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
            $('.playerMainBlock').removeClass('fillView');
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
            $('.playerMainBlock').addClass('fillView');
        });
        
        $(".trackListBlockScrollWrapper").mCustomScrollbar();
    })();


    //View Player View Model
    function Player() {
        var self = this;

        // Data
        self.track = ko.observable();
        self.tracks = ko.observableArray();
        self.state = ko.observable("paused"); //playing, paused
        self.isElapsed = ko.observable(true);
        self.isShuffled = ko.observable(false);
        self.position = ko.observable(0);
        self.time = ko.computed(function() {
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
        self.isMuted = ko.observable(false);
        
        self.volume = ko.observable(100);

        // override base isVisible logic
        self.isVisible = ko.observable();
        pubSub.sub("viewChanged", function (viewName) {
            self.isVisible($.inArray(viewName, ["music", "video", "artists"]) != -1);
        });

        // BEHAVIOR        
        self.playPause = function () {
            if (self.state() == "playing") pause();
            else play();
        };

        self.next = function () {
            playNext();
        };

        self.prev = function () {
            playPrev();
        };

        self.test = function () {
            $slider.slider("option", "max", 150);
        };

        self.mute = function() {
            self.isMuted(!self.isMuted());
            refreshVolume();
        };

        self.switchTimeMode = function() {
            self.isElapsed(!self.isElapsed());
        };

        self.shuffle = function() {
            self.isShuffled(!self.isShuffled());
        };
        
        // track slider
        var $slider = $('.trackSlider').slider({
            range: "min",
            min: 0,
            max: 0,
            value: 0,
            animate: true,
            slide: function(event, ui) { refreshPosition(ui.value); }
        });
        
        function setSliderDuration(duration) {
            $slider.slider("option", "max", duration);
        }

        function refreshPosition(positionInSecs, skipSoundUpdate) {
            if (!self.track()) return;
            
            
            var sound = soundManager.getSoundById(self.track().id());
            
            // prevent sliding over the loaded part
            var maxPosition = sound.duration / 1000;
            if (positionInSecs > maxPosition) positionInSecs = maxPosition;                       
            
            // functional update
            if (!skipSoundUpdate)
                sound.setPosition(positionInSecs * 1000);

            // UI
            if ($slider.slider("option", "value") != positionInSecs)
                $slider.slider("option", "value", positionInSecs);

            self.position(parseInt(positionInSecs));
        }
        
        // volume
        var $volume = $('.trackVolume').slider({
            range: "min",
            min: 0,
            max: 100,
            value: 100,
            animate: true,
            slide: function(event, ui) { onVolumeChanged(ui.value); }
        });
        
        function onVolumeChanged(volume) {
            self.isMuted(false);
            if (!self.track()) return;

            self.volume(volume);
            refreshVolume();
        }

        function refreshVolume() {
            var sound = soundManager.getSoundById(self.track().id());

            var resolvedVolume = !self.isMuted()
                ? self.volume()
                : 0;
            
            // functional update
            if (sound.volume != resolvedVolume)
                sound.setVolume(resolvedVolume);

            // UI
            if ($volume.slider("option", "value") != resolvedVolume)
                $volume.slider("option", "value", resolvedVolume);
        }
        
        // Events
        pubSub.sub("track.onPlayClick", function (track) {
            var tr = new TrackForPlayer(track);
            self.tracks.push(tr);
            self.track(tr);
            play();
        });

        pubSub.sub("trackForPlayer.onDeleteClick", function (deletedTrack) {
            // try to start playing next track
            if (self.track() == deletedTrack && self.tracks().length > 1)
                playNext();

            // is that was last instance of that track in playlist?
            var itemsWithTheSameId = $.grep(self.tracks(), function (elem) { return elem.id() == deletedTrack.id(); });
            if (itemsWithTheSameId.length <= 1) soundManager.destroySound(deletedTrack.id());

            // remove item from playlist
            var index = self.tracks.indexOf(deletedTrack);
            self.tracks.splice(index, 1);
        });

        // Helpers
        function play() {
            if (!self.track()) return;            
            self.state("playing");

            var track = self.track(),
                url = track.url(),
                sound = soundManager.getSoundById(track.id());

            if (!sound) {
                sound = soundManager.createSound({
                    id: track.id(),
                    url: url,
                    whileplaying: function () {
                        var posInSecs = this.position / 1000;
                        refreshPosition(posInSecs, true /*skipSoundUpdate*/);
                    }
                });                               
            }

            sound.setVolume(self.volume());

            if (sound.paused) {
                sound.resume();
            } else {
                stop();
                soundManager.play(track.id());
            }
            
            setSliderDuration(track.duration());        //do it as after stop is called
        }

        function stop() {
            if (!self.track()) return;
            
            soundManager.stopAll();
            setSliderDuration(0);
        }

        function playNext() {
            if (!self.track()) return;

            var curIndex = self.tracks.indexOf(self.track());
            var trackLength = self.tracks().length;
            var isShuffled = self.isShuffled();
            var newIndex = sequenceManager.getNext(curIndex, trackLength, isShuffled);
            
            self.track(self.tracks()[newIndex]);
            if (self.state() == "playing") play();
        }

        function playPrev() {
            if (!self.track()) return;

            var curIndex = self.tracks.indexOf(self.track());
            var trackLength = self.tracks().length;
            var isShuffled = self.isShuffled();
            var newIndex = sequenceManager.getPrev(curIndex, trackLength, isShuffled);

            self.track(self.tracks()[newIndex]);
            if (self.state() == "playing") play();
        }

        function pause() {
            if (!self.track()) return;

            var track = self.track();
            var sound = soundManager.getSoundById(track.id());
            sound.pause();
            self.state("paused");
        }
       
    }

    Player.prototype = new viewBase();

    return Player;
})