define(["vk", "elixir", "Types/Track", "Types/Album"], function (vk, elixir, Track, Album) {
    var deps = false;
    function ensureDeps() {
        if (!deps) {
            vk = require("vk");
            elixir = require("elixir");
            Album = require("Types/Album");
            Track = require("Types/Track");            
            deps = true;
        }        
    }

    var dal = {
        searchTracks: function (args) {
            var cancellationToken = args && args.cancellationToken || {},
                params = args.params,
                onSuccess = args.onSuccess,
                onError = args.onError;

            ensureDeps();
            
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
                    metadata = $.getNamedArray(metadata, "tracks");                    
                    $.each(metadata, function () {
                        items.push(new Track(this));
                    });
                   
                    // append URL and DURATION to tracks
                    vk.appendVkData(items, function (tracksWithData) {
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
        trackInfo: function (id, onSuccess) {
            ensureDeps();            
            elixir.get("trackInfo", { id: id }, function (response) {
                var track = new Track(response.track);
                vk.appendVkData(track, function () {
                    onSuccess(track);
                });                
            });
        },
        searchAlbums: function (args) {
            var cancellationToken = args && args.cancellationToken || {},
                params = args.params,
                onSuccess = args.onSuccess,
                onError = args.onError;

            ensureDeps();
            
            try {
                elixir.get("searchAlbums", params, function (metadata) {
                    var totalCount = metadata.totalResults,
                        items = [];

                    // are results still needed? is that what we are waiting for
                    if (cancellationToken.isCanceled) return;

                    // do we have any searchResults?
                    if (totalCount == 0) {
                        onSuccess(items, totalCount);
                        return;
                    }

                    //create albums
                    metadata = $.getNamedArray(metadata, "albums");
                    $.each(metadata, function () {
                        items.push(new Album(this, "normal"));
                    });
                    
                    // report success
                    onSuccess(items, totalCount);
                });

            } catch (e) {
                onError(e);
            }
        },
        loadAlbum: function (idOrAlbum, onSuccess) {
            var album = idOrAlbum instanceof Album ? idOrAlbum : null,
                id = album == null ? idOrAlbum : album.id;

            ensureDeps();
            
            elixir.get("albumInfo", { id: id }, function (response) {
                var metadata = response.album;
                
                if (album != null) {
                    Album.call(album, metadata, "full");                                       
                } else
                    album = new Album(metadata, "full");
                
                vk.appendVkData(album.tracks, function () {
                    onSuccess(album);
                });
            });
        }
    };
    return dal;
})