define(["ko", "pubSub", "vk", "elixir", "Types/Track"], function (ko, pubSub, vk, elixir, Track) {
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

        // Process request       
        try {
            console.time("elexir search time took");
            elixir.getTracksMetadata(params, function (metadata) {
                console.timeEnd("elexir search time took");

                // are results still needed? is that what we are waiting for
                if (isCanceled) return;

                // do we have any searchResults?
                if (metadata.totalResults == 0) {
                    onComplete(metadata.totalResults);
                    return;
                }

                console.time("vk search time took");
                vk.constructTracks(metadata, function (aTracks) {
                    console.timeEnd("vk search time took");

                    // are results still needed?
                    if (isCanceled) return;

                    // add tracks to result
                    outResults.items.removeAll();
                    for (var i = 0; i < aTracks.length; i++)
                        outResults.items.push(aTracks[i]);

                    onComplete(metadata.totalResults);
                });
            });

        } catch (e) {
            onComplete(0, e);
        }

        function onComplete(totalCount, error) {
            outResults.totalCount(totalCount);
            console.log("searchCommand.onComplete: " + query);
            pubSub.pub("searchCommand.onComplete", error);
        }
    }

    return TrackSearchCommand;
})