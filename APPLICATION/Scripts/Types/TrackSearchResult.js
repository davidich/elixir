define(["ko"], function(ko) {
    function TrackSearchResult() {
        var self = this;

        // Data
        self.totalCount = ko.observable();
        self.tracks = ko.observableArray();        
    }

    return TrackSearchResult;
})