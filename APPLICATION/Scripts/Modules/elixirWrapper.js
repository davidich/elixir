define(["vk", "Types/Track"], function (vk, Track) {

    function getUrl(name) {
        var apiUrl = "http://api.elixirvk.com/services/";

        return apiUrl + name + "/?json=1";
    }

    function getTrackMetadata(searchParams, callback) {
        var params = {
            query: searchParams.query,
            artist: searchParams.artistId || 0,
            genre: searchParams.genreId || 0,
            style: searchParams.styleId || 0,
            hq: searchParams.isHighQuality ? 1 : 0,
            order: searchParams.orderType || "popular",
            timerange: searchParams.timeRange || "all",
            page: searchParams.page || 1
        };

        switch (searchParams.searchMode || "all") {
            case "all":
                params.by = "all";
            case "artist":
                params.by = "artist_name";
            case "title":
                params.by = "track_name";
        }

        $.get(getUrl("tracks"), params, function (response) {
            var error = null;
            if (response.error)
                error = "error has occured on the server (code: " + response.error["-code"] + ")";
            else if (!response.results)
                error = "server returned neither results nor error";

            callback(response.results, error);
        });
    }

    var elixirApi = {
        // SEARCH_PARAM_OBJ:
        // query: string
        // [searchMode]: all, artist, title
        // [orderType]:  popular, interesting, new
        // [timerange]: all, year, month, week
        // [artistId]: int
        // [genreId]: int
        // [styleId]: int
        // [isHighQuality]: bool
        // [page]: int
        searchTracks: function (searchParams, outResult) {

            outResult.onSearchStarted(); // affect ui


            getTrackMetadata(searchParams, function (metadata, error) {
                if (error) {
                    outResult.onSearchCompleted(error);
                    return;
                }

                // sanity check?
                if (searchParams.query != metadata.query)
                    return;

                // get urls from VK
                var tracks = $.getNamedArray(metadata, "tracks");

                var i, paramValue = "";
                for (i = 0; i < tracks.length; i++) {
                    if (paramValue.length > 0) paramValue += ",";
                    paramValue += tracks[i].ownerId + "_" + tracks[i].aid;
                }

                vk.api("audio.getById", { audios: paramValue }, function(vkObj) {

                    outResult.tracks.removeAll();
                    for (i = 0; i < vkObj.response.length; i++) {
                        var vkTrack = vkObj.response[i];
                        var meta = $.grep(tracks, function (track) { return track.aid == vkTrack.aid; });
                        
                        if (meta.length > 0) outResult.tracks.push(new Track(meta[0], vkTrack.url));
                    }

                    outResult.totalCount(metadata.totalResults);
                    outResult.onSearchCompleted(); // affect ui
                });
            });
        }
    };

    return elixirApi;
})