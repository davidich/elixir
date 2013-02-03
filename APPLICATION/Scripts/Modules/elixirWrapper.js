define(["vk", "Types/Track"], function (vk, Track) {

    function getUrl(name) {
        return "http://api.elixirvk.com/services/" + name + "/?json=1";
    }

    var urls = {
        tracksMetadata: getUrl("tracks")
    };


    var elixirApi = {
        getTracksMetadata: function(searchParams, callback) {
            var params = {
                query: encodeURIComponent(searchParams.query),
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

            $.ajax({
                url: urls.tracksMetadata,
                data: params,
                error: function(jqXHR, textStatus, errorThrown) {
                    log.error("ajax error in elixirApi.getTracksMetadata. Status: " + textStatus + "; error: " + errorThrown);
                },
                success: function(response) {
                    if (response.error)
                        throw "error has occured on the server (code: " + response.error["-code"] + ")";
                    else if (!response.results)
                        throw "server returned neither results nor error";

                    setTimeout(function() {
                        callback(response.results);
                    }, 1000);
                }
            });
        }
    };

    return elixirApi;
})