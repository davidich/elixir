define(["vk", "Types/Track"], function (vk, Track) {

    function getUrl(name) {
        return "http://api.elixirvk.com/services/" + name + "/?json=1";
    }

    var urls = {
        tracksMetadata: getUrl("tracks"),
        genres: getUrl("genres")
    };

    var isOffline = false;
    var cnt = 0;

    var elixirApi = {
        getTracksMetadata: function (searchParams, callback) {
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

            if (!isOffline) {
                $.ajax({
                    url: urls.tracksMetadata,
                    data: params,
                    error: function (jqXHR, textStatus, errorThrown) {
                        log.error("ajax error in elixirApi.getTracksMetadata. Status: " + textStatus + "; error: " + errorThrown);
                    },
                    success: function (response) {
                        if (response.error)
                            throw "error has occured on the server (code: " + response.error["-code"] + ")";
                        else if (!response.results)
                            throw "server returned neither results nor error";

                        callback(response.results);
                    }
                });
            } else {
                setTimeout(function () {
                    var text = (cnt % 2 ? "dido" : "maxi") + cnt++;
                    callback({
                        totalResults: 1,
                        query: searchParams.query,
                        tracks: {
                            track: {
                                "id": 261850,
                                "artists": { "artist": { "id": 782972, "name": text } },
                                "duration": 210,
                                "ownerId": 3089436,
                                "stats": { "rank": 564401, "likes": 0 },
                                "album": { "id": 193747, "name": "O", "image": 17436 },
                                "name": text,
                                "styles": "",
                                "aid": 72014244
                            }
                        }
                    });
                }, 500);
            }
        },
        getGenres: function (callback) {
            //if (!isOffline) {
            //    $.ajax({
            //        url: urls.genres,
            //        error: function (jqXHR, textStatus, errorThrown) {
            //            log.error("ajax error in elixirApi.getGenres. Status: " + textStatus + "; error: " + errorThrown);
            //        },
            //        success: function (response) {
            //            if (response.error)
            //                throw "error has occured on the server (code: " + response.error["-code"] + ")";
            //            else if (!response.results)
            //                throw "server returned neither results nor error";

            //            callback(response.results);
            //        }
            //    });
            //} else {
            setTimeout(function () {
                var response = { "genres": { "genre": [{ "id": "1", "name": "Hip Hop", "styles": { "style": [{ "id": "1", "name": "Rap" }, { "id": "2", "name": "Hip Hop" }, { "id": "3", "name": "Gangsta rap" }, { "id": "4", "name": "Alternative rap" }, { "id": "5", "name": "Hardcore rap" }, { "id": "6", "name": "Dirty south" }, { "id": "7", "name": "French rap" }, { "id": "8", "name": "Latin rap" }, { "id": "251", "name": "Grime" }] } }, { "id": "2", "name": "R&B", "styles": { "style": [{ "id": "141", "name": "R&B" }, { "id": "142", "name": "Neo Soul" }, { "id": "144", "name": "Urban" }] } }, { "id": "4", "name": "Pop", "styles": { "style": [{ "id": "145", "name": "Pop" }, { "id": "146", "name": "Latin pop" }, { "id": "147", "name": "French pop" }, { "id": "148", "name": "Italian pop" }, { "id": "149", "name": "Teen pop" }, { "id": "150", "name": "Dance" }, { "id": "151", "name": "Disco" }] } }, { "id": "3", "name": "Rock", "styles": { "style": [{ "id": "152", "name": "Alternative" }, { "id": "252", "name": "Indie rock" }, { "id": "253", "name": "Nu metal" }, { "id": "153", "name": "Classic rock" }, { "id": "154", "name": "Hard Rock" }, { "id": "155", "name": "Hardcore" }, { "id": "157", "name": "Metal" }, { "id": "159", "name": "Trash metal" }, { "id": "160", "name": "Death\/Black metal" }, { "id": "254", "name": "Progressive metal" }, { "id": "163", "name": "Gothic" }, { "id": "164", "name": "Punk" }, { "id": "255", "name": "Emo" }, { "id": "271", "name": "Rock'n'Roll" }, { "id": "272", "name": "Pop rock" }] } }, { "id": "5", "name": "House", "styles": { "style": [{ "id": "165", "name": "House" }, { "id": "166", "name": "Tech house" }, { "id": "167", "name": "Deep house" }, { "id": "168", "name": "Electro house" }, { "id": "169", "name": "Progressive house" }, { "id": "170", "name": "Tribal house" }, { "id": "171", "name": "Vocal house" }, { "id": "172", "name": "Acid house" }] } }, { "id": "9", "name": "Trance", "styles": { "style": [{ "id": "173", "name": "Trance" }, { "id": "180", "name": "Epic trance" }, { "id": "174", "name": "Tech trance" }, { "id": "175", "name": "Vocal trance" }, { "id": "176", "name": "Progressive trance" }, { "id": "177", "name": "Melodic trance" }, { "id": "178", "name": "Hard trance" }, { "id": "179", "name": "Euro trance" }] } }, { "id": "8", "name": "Techno", "styles": { "style": [{ "id": "181", "name": "Techno" }, { "id": "182", "name": "Minimal" }, { "id": "183", "name": "Detroit techno" }, { "id": "184", "name": "Deep techno" }, { "id": "185", "name": "Dub techno" }] } }, { "id": "13", "name": "Electronic", "styles": { "style": [{ "id": "186", "name": "Electronica" }, { "id": "187", "name": "Nu Disco" }, { "id": "188", "name": "Electro" }, { "id": "189", "name": "Trip hop" }, { "id": "190", "name": "Synthpop" }, { "id": "191", "name": "Chiptune" }, { "id": "192", "name": "Glitch" }, { "id": "193", "name": "Tribal" }, { "id": "194", "name": "8-Bit" }, { "id": "195", "name": "IDM" }] } }, { "id": "6", "name": "Breakbeat", "styles": { "style": [{ "id": "196", "name": "Drum&Bass" }, { "id": "256", "name": "Liquid funk" }, { "id": "197", "name": "Intelligent" }, { "id": "199", "name": "Dubstep" }, { "id": "200", "name": "Techstep" }, { "id": "203", "name": "Darkstep" }, { "id": "257", "name": "Ragga jungle" }, { "id": "204", "name": "Jump Up" }, { "id": "201", "name": "Breakbeat" }, { "id": "258", "name": "Progressive Breaks" }, { "id": "259", "name": "Nuskool breaks" }, { "id": "260", "name": "Funky Breaks" }, { "id": "261", "name": "2 step" }] } }, { "id": "10", "name": "Psychedelic", "styles": { "style": [{ "id": "207", "name": "Full on" }, { "id": "208", "name": "Psyprog" }, { "id": "209", "name": "Psytrance" }, { "id": "210", "name": "Darkpsy" }, { "id": "211", "name": "Psy Chill" }] } }, { "id": "12", "name": "Hardstyle", "styles": { "style": [{ "id": "262", "name": "Dark electro" }, { "id": "212", "name": "Hard techno" }, { "id": "263", "name": "Hardstep" }, { "id": "213", "name": "Hardcore" }, { "id": "264", "name": "Happy hardcore" }, { "id": "265", "name": "Speedcore" }, { "id": "266", "name": "Breakcore" }, { "id": "214", "name": "Hard Bass" }, { "id": "215", "name": "Jumpstyle" }, { "id": "216", "name": "Schranz" }, { "id": "217", "name": "Gabber" }] } }, { "id": "7", "name": "Chill out", "styles": { "style": [{ "id": "218", "name": "Chillout" }, { "id": "219", "name": "Lounge" }, { "id": "220", "name": "Ambient" }, { "id": "221", "name": "Downtempo" }, { "id": "222", "name": "Meditative" }, { "id": "223", "name": "New Age" }, { "id": "224", "name": "Reggae" }, { "id": "225", "name": "World" }] } }, { "id": "14", "name": "Classic", "styles": { "style": [{ "id": "226", "name": "Classical" }, { "id": "227", "name": "Neoclassical" }, { "id": "267", "name": "Classical crossover" }, { "id": "228", "name": "Impressionist" }, { "id": "229", "name": "Renaissance" }, { "id": "230", "name": "Baroque" }, { "id": "231", "name": "Choral" }, { "id": "232", "name": "Opera" }, { "id": "233", "name": "Piano" }] } }, { "id": "15", "name": "Blues", "styles": { "style": [{ "id": "268", "name": "Soul" }, { "id": "235", "name": "Classic Blues" }, { "id": "269", "name": "Modern blues" }, { "id": "236", "name": "Chicago blues" }, { "id": "234", "name": "Delta Blues" }, { "id": "237", "name": "Blues Rock" }, { "id": "238", "name": "Rhythem & blues" }, { "id": "239", "name": "Electric blues" }, { "id": "240", "name": "Motown" }, { "id": "273", "name": "Country" }] } }, { "id": "11", "name": "Jazz", "styles": { "style": [{ "id": "241", "name": "Smooth Jazz" }, { "id": "242", "name": "Vocal Jazz" }, { "id": "243", "name": "Nu Jazz" }, { "id": "244", "name": "Acid Jazz" }, { "id": "245", "name": "Cool Jazz" }, { "id": "246", "name": "Free Jazz" }, { "id": "270", "name": "Modern Jazz" }, { "id": "247", "name": "Classic Jazz" }, { "id": "248", "name": "Bossa Nova" }, { "id": "249", "name": "Soul Jazz" }, { "id": "250", "name": "Fusion" }] } }] } };
                //var response = { "genres": { "genre": [{ "id": "1", "name": "Hip Hop", "styles": { "style": [{ "id": "1", "name": "Rap" }, { "id": "2", "name": "Hip Hop" }, { "id": "3", "name": "Gangsta rap" }, { "id": "4", "name": "Alternative rap" }, { "id": "5", "name": "Hardcore rap" }, { "id": "6", "name": "Dirty south" }, { "id": "7", "name": "French rap" }, { "id": "8", "name": "Latin rap" }, { "id": "251", "name": "Grime" }] } }, { "id": "2", "name": "R&B", "styles": { "style": [{ "id": "141", "name": "R&B" }, { "id": "142", "name": "Neo Soul" }, { "id": "144", "name": "Urban" }] } }] } };
                callback(response, 500);
            });
            //}
        }
    };

    return elixirApi;
})