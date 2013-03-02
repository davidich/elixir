define(["vk", "elixir", "Types/Track", "Types/Album"], function (vk, elixir, Track, Album) {

    function createTrack(metadata) {
        if (!Track) Track = require("Types/Track");
        return new Track(metadata);
    }

    function vkApi() {
        if (!vk) vk = require("vk");
        return vk;
    }

    var dal = {
        searchTracks: function (args) {
            var cancellationToken = args && args.cancellationToken || {},
                params = args.params,
                onSuccess = args.onSuccess,
                onError = args.onError;

            try {
                elixir.searchTracks(params, function (metadata) {
                    var totalCount = metadata.totalResults,
                        items = [];

                    // are results still needed? is that what we are waiting for
                    if (cancellationToken.isCanceled) return;

                    // do we have any searchResults?
                    if (totalCount == 0) {
                        onSuccess(items, totalCount);
                        return;
                    }
                    
                    //create tracks
                    var tracksMeta = $.getNamedArray(metadata, "tracks");
                    var tracks = [];
                    $.each(tracksMeta, function() {
                        tracks.push(createTrack(this));
                    });
                   
                    // append URL and DURATION to tracks
                    vkApi().appendVkData(tracks, function (tracksWithData) {
                        // are results still needed?
                        if (cancellationToken.isCanceled) return;

                        // report success
                        onSuccess(tracksWithData, totalCount);
                    });
                });

            } catch (e) {                
                onError(e);
            }
        },
        trackInfo: function(id, onSuccess) {
            elixir.get("trackInfo", { id: id }, function (response) {
                var track = createTrack(response.track);
                vkApi().appendVkData(track, function () {
                    onSuccess(track);
                });                
            });
        },
        loadAlbum: function (id, onSuccess) {
            elixir.get("albumInfo", { id: id }, function (response) {
                var album = new Album(response.album);
                vkApi().appendVkData(album.tracks, function () {
                    onSuccess(album);
                });
            });
        }
    };
    return dal;
})