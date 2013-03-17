﻿define(["vk", "elixir", "Types/Track", "Types/Album", "Types/Artist"], function (vk, elixir, Track, Album, Artist) {
    var deps = arguments;
    function ensureDeps() {
        if (!ensureDeps.ensured) {
            ensureDeps.ensured = true;
            vk = require("vk");
            elixir = require("elixir");
            Album = require("Types/Album");
            Track = require("Types/Track");
            Artist = require("Types/Artist");

            for (var key in deps) {
                if (!deps[key]) throw "Dal module invoked ensureDeps, but coundn't resolve '" + key + "'";
            }
        }
    }

    var searchFactory = {
        track: function (metadata) {
            return new Track(metadata);
        },
        album: function (metadata) {
            return Album.get(metadata);
        },
        artist: function (metadata) {
            return Artist.get(metadata);
        }
    };
    
    function search(itemType, args, extraLogic) {
        var cancellationToken = args && args.cancellationToken || {},
            params = args.params,
            onSuccess = args.onSuccess,
            onError = args.onError,
            requestType;

        ensureDeps();

        try {
            requestType = "search" + itemType.charAt(0).toUpperCase() + itemType.slice(1) + "s";
            elixir.get(requestType, params, function (metadata) {
                var totalCount = metadata.totalResults,
                    items = [];

                // are results still needed? is that what we are waiting for
                if (cancellationToken.isCanceled) return;

                // do we have any searchResults?
                if (totalCount == 0) {
                    onSuccess(items, totalCount);
                    return;
                }

                //create items
                metadata = $.getNamedArray(metadata, itemType + "s");
                $.each(metadata, function () {
                    var item = searchFactory[itemType](this);
                    items.push(item);
                });

                if (extraLogic) {
                    extraLogic(items, function (extendedItems) {
                        // are results still needed?
                        if (cancellationToken.isCanceled) return;
                        
                        // report success
                        onSuccess(extendedItems, totalCount);                                               
                    });
                } else {
                    // report success
                    onSuccess(items, totalCount);
                }
            });

        } catch (e) {
            onError(e);
        }
    }

    var dal = {
        searchTracks: function (args) {
            search("track", args, function(items, onComplete) {
                // append URL and DURATION to tracks
                vk.appendVkData(items, function (tracksWithData) {
                    onComplete(tracksWithData);
                });
            });            
        },
        searchAlbums: function (args) {
            search("album", args);
        },
        searchArtists: function (args) {
            search("artist", args);
        },
        
        trackInfo: function (id, onSuccess) {
            ensureDeps();            
            elixir.get("trackInfo", { id: id }, function (response) {
                var track = new Track(response.track);
                vk.appendVkData(track, function () {
                    onSuccess(track);
                });                
            });
        }        
    };
    return dal;
})