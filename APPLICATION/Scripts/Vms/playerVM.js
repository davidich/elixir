define(["ko", "Vms/viewBase", "pubSub", /*plugins w/o export*/ "jqueryui"],
    function (ko, viewBase, pubSub, sm2) {
        function Track(artist, title, url) {
            var self = this;

            self.artist = artist;
            self.title = title;
            self.url = url;
        }

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

        //View Player View Model
        function Player(mainVm) {
            var self = this;

            // override base isVisible logic
            self.isVisible = ko.observable();
            self.supportedViews = ["music", "video", "artists"];

            pubSub.sub("viewChanged", function (viewName) {
                var visible = $.inArray(viewName, self.supportedViews) != -1;
                self.isVisible(visible);
            });

            // Data
            self.currentTrack = ko.observable();
            self.playlist = ko.observableArray();
            self.state = ko.observable(); //play, pause, stop

            // Behavior
            self.playPause = function () {

            };
        }

        Player.prototype = new viewBase();

        return Player;
    })