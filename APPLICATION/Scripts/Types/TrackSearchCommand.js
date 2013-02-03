define(["ko", "vk", "elixir", "Types/Track"], function (ko, vk, elixir, Track) {
    function TrackSearchCommand(params, outResults) {
        // Code contract
        if (!params) throw "params should be passed";
        if (!outResults) throw "outResults should be passed";

        // private vars
        var self = this;
        var query = (params = params.toJS()).query;        
        var isCanceled = false;
        
        // Behavior
        self.cancel = function () {
            isCanceled = true;
        };        

        self.process = function () {

            outResults.areLoading(true);
            
            try {
                elixir.getTracksMetadata(params, function (metadata) {
                    // is that what we are waiting for
                    if (query != metadata.query) {
                        onComplete();
                        return;
                    }

                    // are results still needed? is that what we are waiting for
                    if (isCanceled) {
                        onComplete();
                        return;
                    }
                    
                    // do we have any searchResults?
                    if (metadata.totalResults == 0) {
                        onComplete();
                        return;
                    }                        

                    vk.constructTracks(metadata, function (tracks) {
                        // are results still needed? is that what we are waiting for
                        if (isCanceled) {
                            onComplete();
                            return;
                        }

                        // add tracks to result
                        outResults.tracks.removeAll();
                        for (var i = 0; i < tracks.length; i++) {
                            outResults.tracks.push(tracks[i]);
                        }

                        onComplete(metadata.totalResults);
                    });
                });

            } catch (e) {
                console.error("TrackSeachCommand.process():" + e);
                onComplete(0);
            }
        };
        
        // private functions
        function onComplete(totalCount) {
            if (!isCanceled) {
                outResults.totalCount(totalCount || 0);
                outResults.areLoading(false);
            }                
        }       
    }

    return TrackSearchCommand;
})