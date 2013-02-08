define(["ko"], function(ko) {
    function SearchResults() {
        var self = this;

        // Data
        self.totalCount = ko.observable(0);
        self.items = ko.observableArray();
        
        // Behavior
        // nothing yet               
    }

    return SearchResults;
})