define(["ko", "pubSub", "Types/Track", "Types/TrackForPlayer", "Types/SequenceMananager", /*plugins w/o export*/ "jqueryui", "rollbar"],
function (ko, pubSub, Track, TrackForPlayer, sequenceManager) {

    // player ui setup    
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
        $('.playerHeader').animate(
            {
                height: ['toggle', 'swing'],
                opacity: 'toggle'
            },
            200,
            'linear',
            function () {
                rollbar.update();
            });


        $('.playerPlaylistBlock').animate({
            height: ['toggle', 'swing'],
            opacity: 'toggle'
        }, 200, 'linear');

        $('.lockBackground').show();
        $('.playerBlock').addClass('fullView');
    });
    
    $("#playerContent").bind('mousewheel DOMMouseScroll', function (e) {
        return false;
    });

    var rollbar = $(".trackListBlock").rollbar({
        minThumbSize: '25%',
        pathPadding: '3px',
        zIndex: 100
    });


    //View Player View Model
    function PlayerVm() {
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
        self.sliderValue = function (value) {
            return typeof value == "undefined"
                ? $slider.slider("option", "value")
                : $slider.slider("option", "value", value);
        };
        self.sliderMaxValue = function (value) {
            return typeof value == "undefined"
                ? $slider.slider("option", "max")
                : $slider.slider("option", "max", value);
        };

        var $volumeSlider = $('.trackVolume').slider({
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
        self.volumeSilderValue = function (value) {
            return typeof value == "undefined"
                ? $volumeSlider.slider("option", "value")
                : $volumeSlider.slider("option", "value", value);
        };


        // DATA
        self.track = ko.observable();
        self.tracks = ko.observableArray();
        self.state = ko.observable("paused"); //playing, paused, stoped
        self.position = ko.observable(0);
        self.volume = ko.observable(100);
        self.isElapsed = ko.observable(true);
        self.isShuffled = ko.observable(false);
        self.isLooped = ko.observable(false);
        self.isMuted = ko.observable(false);
        self.time = ko.computed(function () {
            if (!self.track()) return "0:00";

            var pos;
            if (!self.isElapsed()) {
                pos = self.position();
                return Track.toTimeString(pos);
            } else {
                pos = self.track().duration - self.position();
                return "-" + Track.toTimeString(pos);
            }
        });
        self.sound = function () {
            if (!self.track())
                return null;

            var id = self.track().id;
            var url = self.track().url;

            return soundManager.getSoundById(id)
                || soundManager.createSound({
                    id: id,
                    url: url,
                    whileplaying: function () {
                        var posInSecs = this.position / 1000;
                        self.refreshPosition(posInSecs, true /*skipSoundUpdate*/);
                    },
                    onfinish: function () {
                        if (self.isLooped())
                            play();
                        else
                            self.next();
                    }
                });
        };
        self.imageVisibility = ko.computed(function () {
            return self.track() && self.track().data.imageId();
        });
        self.imageUrl = function (size) {
            return self.state() != "stopped" && self.track()
                ? self.track().data.getImageUrl(size)
                : "";
        };
        self.trackCaption = ko.computed(function () {
            var title,
                i,
                track = self.track();

            if (!track)
                title = "";
            else {
                title = track.title + " - ";
                for (i = 0; i < track.artists.length; i++) {
                    var artist = track.artists[i];
                    var isLast = i == track.artists.length - 1;
                    title += artist.name;
                    if (!isLast) title += ", ";
                }
            }

            return title;
        });


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
            if (self.volumeSilderValue() != resolvedVolume)
                self.volumeSilderValue(resolvedVolume);

            // functional update
            var sound = self.sound();
            if (sound && sound.volume != resolvedVolume) sound.setVolume(resolvedVolume);
        };

        self.refreshPosition = function (positionInSecs, skipSoundUpdate) {
            var sound = self.sound();
            if (!sound) return;

            // prevent sliding over the loaded part            
            var maxPosition = sound.duration / 1000;
            if (positionInSecs > maxPosition) positionInSecs = maxPosition;

            // UI
            if (self.sliderValue() != positionInSecs)
                self.sliderValue(positionInSecs);

            // functional update
            if (!skipSoundUpdate) sound.setPosition(positionInSecs * 1000);
            self.position(parseInt(positionInSecs));
        };

        self.clearPlaylist = function () {
            stop();
            self.tracks.removeAll();
            self.track(null);
            refreshSliderLength();
        };


        // EVENTS
        pubSub.sub("player.addToStart", function (tracks, playFirst) {
            if (!$.isArray(tracks)) tracks = [tracks];

            for (var i = tracks.length - 1; i >= 0; i--) {
                prependTrack(tracks[i]);
            }

            if (playFirst !== false) {
                self.track(self.tracks()[0]);
                play();
            }
        });

        pubSub.sub("player.addToEnd", function (tracks) {
            if (!$.isArray(tracks)) tracks = [tracks];
            $.each(tracks, function () { appendTrack(this); });
        });

        var hasPendingRedraw = false;
        self.tracks.subscribe(function () {
            if (hasPendingRedraw)
                return;

            hasPendingRedraw = true;

            setTimeout(function () {
                rollbar.update();
                hasPendingRedraw = false;
            }, 300);

        });

        pubSub.sub("trackForPlayer.onDeleteClick", function (deletedTrack) {
            // try to start playing next track
            if (self.track() == deletedTrack && self.tracks().length > 1)
                self.next();

            // is that was last instance of that track in playlist?
            var itemsWithTheSameId = $.grep(self.tracks(), function (elem) { return elem.id == deletedTrack.id; });
            if (itemsWithTheSameId.length <= 1) soundManager.destroySound(deletedTrack.id);

            // remove item from playlist
            var index = self.tracks.indexOf(deletedTrack);
            self.tracks.splice(index, 1);

            if (self.tracks().length == 0) self.track(null);
            refreshSliderLength();
        });

        pubSub.sub("trackForPlayer.onClick", function (track) {
            if (self.track() == track)
                return;

            self.track(track);
            play();
        });


        // Helpers
        function prependTrack(track) {
            self.tracks.splice(0, 0, new TrackForPlayer(track));
        }

        function appendTrack(track) {
            self.tracks.push(new TrackForPlayer(track));
        }

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
            if (!self.track() || self.state() == "stopped")
                self.sliderMaxValue(0);
            else
                self.sliderMaxValue(self.track().duration);
        }
    }

    return new PlayerVm();
})
