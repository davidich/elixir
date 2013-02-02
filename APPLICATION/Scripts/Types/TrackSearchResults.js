define(["ko"], function(ko) {
    function TrackSearchResults() {
        var self = this;

        // Data
        self.totalCount = ko.observable();
        self.tracks = ko.observableArray();
        
        // Behavior
        self.onSearchStarted = function () {
            // update ui
        };
        
        self.onSearchCompleted = function (error) {
            if (!error) {
                // update ui    
            } else {
                //show error
            }
        };
    }

    return TrackSearchResults;
})