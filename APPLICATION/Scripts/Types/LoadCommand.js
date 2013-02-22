define(["ko", "pubSub", "vk", "elixir"], function (ko, pubSub, vk, elixir) {
    function LoadCommand(params, page, onSuccess, onError) {
        // Code contract
        if (!params) throw "params should be passed";
        
        // private vars
        var self = this,
            isCanceled = false;

        // convert KO object
        params = params.toJS(page);

        // Behavior
        self.cancel = function () {
            isCanceled = true;
        };

        // start processing
        try {
            elixir.getTracksMetadata(params, function (metadata) {
                var totalCount,
                    items = [];
                
                // are results still needed? is that what we are waiting for
                if (isCanceled) return;
                
                // set total count
                totalCount = metadata.totalResults;
                
                // do we have any searchResults?
                if (totalCount == 0) {
                    onSuccess(items, page, totalCount);
                    return;
                }
                
                vk.constructTracks(metadata, function (aTracks) {
                    // are results still needed?
                    if (isCanceled) return;
                        
                    // add constructed items
                    for (var i = 0; i < aTracks.length; i++)
                        items.push(aTracks[i]);
                    
                    // report success
                    onSuccess(items, page, totalCount);
                });
            });

        } catch (e) {
            isCanceled = true;
            onError(e);
        }        
    }    

    return LoadCommand;
})