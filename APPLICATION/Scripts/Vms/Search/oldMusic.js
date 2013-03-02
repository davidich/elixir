define([["jqueryui", "ko", "pubSub", "Vms/viewBase", "elixir", "Types/Track", "Types/SearchParams", "Types/LoadCommand", "rollbar"], 
    function(jqueryui, ko, pubSub, viewBase, elixir, Track, SearchParams, LoadCommand) {
        function MainVM(viewName) {

            var self = this;

            // init base class logic
            self.setName(viewName);

            // PAGED MODEL PROPERTIES
            self.loadManager = new LoadManager($('#musicContent'), 90, 34, self);
            self.items = ko.observableArray();
            self.totalCount = ko.observable();
            // PAGED MODEL PROPERTIES end


            // Behavior
            self.goToMain = function () {
                self.activateView("main");
            };
            
            self.activeSubView = ko.observable();

            self.addToPlayList = function (track) {
                pubSub.pub("player.playTrack", track);
            };
        };

        MainVM.prototype = new viewBase();

        return MainVM;
    })