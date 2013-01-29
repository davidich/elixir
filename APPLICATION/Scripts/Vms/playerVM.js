define(["ko", "Vms/viewBase", "pubSub", "jqueryui"], function (ko, viewBase, pubSub) {

    //do some ui setup here
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
    }

    Player.prototype = new viewBase();

    return Player;
})