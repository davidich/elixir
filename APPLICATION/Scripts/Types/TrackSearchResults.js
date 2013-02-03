define(["ko"], function(ko) {
    function TrackSearchResults() {
        var self = this;

        // Data
        self.totalCount = ko.observable(0);
        self.tracks = ko.observableArray();
        self.areLoading = ko.observable(true);
        
        // Behavior
        // nothing yet
        
        self.areLoading.subscribe(function (newValue) {
            console.log("areLoading = " + newValue);
        });
    }

    return TrackSearchResults;
})