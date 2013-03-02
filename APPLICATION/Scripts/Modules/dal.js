define(["vk", "elixir"], function (vk, elixir) {
    var dal = {
        loadTracks: function (args) {
            var cancellationToken = args && args.cancellationToken || {},
                params = args.params,
                onSuccess = args.onSuccess,
                onError = args.onError;

            try {
                elixir.getTracksMetadata(params, function (metadata) {
                    var totalCount = metadata.totalResults,
                        items = [];

                    // are results still needed? is that what we are waiting for
                    if (cancellationToken.isCanceled) return;

                    // do we have any searchResults?
                    if (totalCount == 0) {
                        onSuccess(items, totalCount);
                        return;
                    }

                    vk.constructTracks(metadata, function (aTracks) {
                        // are results still needed?
                        if (cancellationToken.isCanceled) return;

                        // add constructed items
                        for (var i = 0; i < aTracks.length; i++)
                            items.push(aTracks[i]);

                        // report success
                        onSuccess(items, totalCount);
                    });
                });

            } catch (e) {                
                onError(e);
            }
        }
    };
    return dal;
})