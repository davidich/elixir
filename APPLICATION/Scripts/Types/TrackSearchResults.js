define(["ko"], function(ko) {
    function TrackSearchResults() {
        var self = this;

        // Data
        self.totalCount = ko.observable(0);
        self.tracks = ko.observableArray();
        self.areLoading = ko.observable();
        
        // Behavior
        // nothing yet               
    }

    return TrackSearchResults;
})