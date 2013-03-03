﻿define(["vk", "Types/Track"], function (vk, Track) {
    var apiUrl = "http://api.elixirvk.com/services/";
    //var apiUrl = "http://elexircp.evo-studio.com/request/";

    var urls = {
        genres: getUrl("genres"),
        trackInfo: getUrl("track"),
        //tracks: getUrl("search_track"),
        tracks: getUrl("tracks"),
        albumInfo: getUrl("album"),
        albums: getUrl("search_album"),
        artist: getUrl("artist"),
        artists: getUrl("search_artist")
        
    };

    function getUrl(name) {
        return apiUrl + name + "/?json=1";
    }


    var offlineDelay = false;//500;
    var cnt = 0;

    function ajax(url, params, onSuccess) {
        if (typeof params == "function") {
            onSuccess = params;
            params = null;
        }

        $.ajax({
            url: url,
            data: params,
            error: function (jqXHR, textStatus, errorThrown) {
                throw "ajax error in elixirApi.getTracksMetadata. Status: " + textStatus + "; error: " + errorThrown;
            },
            success: function (response) {
                if (response.error)
                    throw "error has occured on the server (code: " + response.error["-code"] + ")";
                else if (!response)
                    throw "server returned neither results nor error";

                onSuccess(response.results || response);
            }
        });
    }

    var elixirApi = {
        get : function(requestType, params, onSuccess) {
            ajax(urls[requestType], params, onSuccess);
        },
        searchTracks: function (searchParams, onSuccess) {
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
                    break;
                case "artist":
                    params.by = "artist_name";
                    break;
                case "title":
                    params.by = "track_name";
                    break;
            }

            if (!offlineDelay)
                ajax(urls.tracks, params, onSuccess);
            else {
                var tracks = (cnt++ % 2)
                    ? {
                        track: [
                            { "id": "4962", "name": "Smells Like Teen Spirit", "artists": { "artist": { "id": "782736", "name": "Nirvana" } }, "album": { "id": "174942", "name": "Nevermind", "image": "444" }, "stats": { "rank": "1545713", "likes": "0" }, "similar": "", "duration": "302", "styles": { "style": "152" }, "ownerId": "111953916", "aid": "109005699" },
                            { "id": "4236", "name": "Mr. Brightside", "artists": { "artist": { "id": "782756", "name": "The Killers" } }, "album": { "id": "174761", "name": "Hot Fuss", "image": "300" }, "stats": { "rank": "1456013", "likes": "0" }, "similar": "", "duration": "223", "styles": { "style": "252" }, "ownerId": "6571745", "aid": "99380464" },
                            { "id": "4967", "name": "Come as You Are", "artists": { "artist": { "id": "782736", "name": "Nirvana" } }, "album": { "id": "174942", "name": "Nevermind", "image": "444" }, "stats": { "rank": "1375820", "likes": "0" }, "similar": "", "duration": "254", "styles": { "style": "152" }, "ownerId": "1360359", "aid": "55787072" },
                            { "id": "401422", "name": "Well, You Needn't (Live)", "artists": { "artist": { "id": "783074", "name": "Miles Davis" } }, "album": { "id": "203723", "name": "Live and More (35 Tracks - Digital Remastered)", "image": "25943" }, "stats": { "rank": "1341725", "likes": "0" }, "similar": "", "duration": "483", "styles": { "style": "2" }, "ownerId": "63013039", "aid": "98439230" },
                            { "id": "4240", "name": "Somebody Told Me", "artists": { "artist": { "id": "782756", "name": "The Killers" } }, "album": { "id": "174761", "name": "Hot Fuss", "image": "300" }, "stats": { "rank": "1305211", "likes": "0" }, "similar": "", "duration": "197", "styles": { "style": "252" }, "ownerId": "2729225", "aid": "71163171" },
                            { "id": "28665", "name": "Take Me Out", "artists": { "artist": { "id": "782818", "name": "Franz Ferdinand" } }, "album": { "id": "176861", "name": "Franz Ferdinand", "image": "2238" }, "stats": { "rank": "1264852", "likes": "0" }, "similar": "", "duration": "240", "styles": { "style": "252" }, "ownerId": "1654626", "aid": "68642962" },
                            { "id": "42", "name": "Viva la Vida", "artists": { "artist": { "id": "782723", "name": "Coldplay" } }, "album": { "id": "174639", "name": "Viva La Vida or Death and All His Friends", "image": "4" }, "stats": { "rank": "1244024", "likes": "0" }, "similar": "", "duration": "223", "styles": { "style": "152" }, "ownerId": "7843745", "aid": "84199575" },
                            { "id": "30", "name": "Yellow", "artists": { "artist": { "id": "782723", "name": "Coldplay" } }, "album": { "id": "174638", "name": "Parachutes", "image": "3" }, "stats": { "rank": "1202328", "likes": "0" }, "similar": "", "duration": "268", "styles": { "style": "152" }, "ownerId": "8453076", "aid": "76640409" },
                            { "id": "3565", "name": "Californication", "artists": { "artist": { "id": "782731", "name": "Red Hot Chili Peppers" } }, "album": { "id": "174612", "name": "Greatest Hits", "image": "220" }, "stats": { "rank": "1163352", "likes": "0" }, "similar": "", "duration": "321", "styles": { "style": "152" }, "ownerId": "3334191", "aid": "38583864" },
                            { "id": "49", "name": "Fix You", "artists": { "artist": { "id": "782723", "name": "Coldplay" } }, "album": { "id": "174640", "name": "X&Y", "image": "5" }, "stats": { "rank": "1159831", "likes": "0" }, "similar": "", "duration": "297", "styles": { "style": "152" }, "ownerId": "8453076", "aid": "77621928" },
                            { "id": "17768", "name": "Chop Suey!", "artists": { "artist": { "id": "129072", "name": "System of a Down" } }, "album": { "id": "225436", "name": "Chop Suey!", "image": "1429" }, "stats": { "rank": "1131713", "likes": "0" }, "similar": "", "duration": "211", "styles": { "style": "154" }, "ownerId": "12140873", "aid": "103604487" },
                            { "id": "3339", "name": "Under the Bridge", "artists": { "artist": { "id": "782731", "name": "Red Hot Chili Peppers" } }, "album": { "id": "174611", "name": "Blood Sugar Sex Magik", "image": "219" }, "stats": { "rank": "1112072", "likes": "0" }, "similar": "", "duration": "264", "styles": { "style": "269" }, "ownerId": "574708", "aid": "93681891" },
                            { "id": "4972", "name": "Lithium", "artists": { "artist": { "id": "782736", "name": "Nirvana" } }, "album": { "id": "174942", "name": "Nevermind", "image": "444" }, "stats": { "rank": "1103258", "likes": "0" }, "similar": "", "duration": "257", "styles": { "style": "152" }, "ownerId": "6895598", "aid": "77081177" },
                            { "id": "8554", "name": "Starlight", "artists": { "artist": { "id": "782734", "name": "Muse" } }, "album": { "id": "175479", "name": "Black Holes And Revelations", "image": "728" }, "stats": { "rank": "1092100", "likes": "0" }, "similar": "", "duration": "240", "styles": { "style": "152" }, "ownerId": "20187403", "aid": "71073116" }]
                    }
                    : {
                        track: [
                            { "id": "4227", "name": "When You Were Young", "artists": { "artist": { "id": "782756", "name": "The Killers" } }, "album": { "id": "174762", "name": "Sam's Town", "image": "301" }, "stats": { "rank": "1089994", "likes": "0" }, "similar": "", "duration": "219", "styles": { "style": "252" }, "ownerId": "3272633", "aid": "48819329" },
                            { "id": "8556", "name": "Supermassive Black Hole", "artists": { "artist": { "id": "782734", "name": "Muse" } }, "album": { "id": "175479", "name": "Black Holes And Revelations", "image": "728" }, "stats": { "rank": "1089720", "likes": "0" }, "similar": "", "duration": "210", "styles": { "style": "152" }, "ownerId": "3178642", "aid": "40403700" },
                            { "id": "119766", "name": "TiK ToK", "artists": { "artist": { "id": "782939", "name": "Ke$ha" } }, "album": { "id": "184038", "name": "Animal", "image": "8926" }, "stats": { "rank": "1088279", "likes": "0" }, "similar": "", "duration": "195", "styles": { "style": "145" }, "ownerId": "63378505", "aid": "79664691" },
                            { "id": "28258", "name": "Sex On Fire", "artists": { "artist": { "id": "782760", "name": "Kings of Leon" } }, "album": { "id": "176778", "name": "Only By The Night", "image": "2151" }, "stats": { "rank": "1087844", "likes": "0" }, "similar": "", "duration": "204", "styles": { "style": "252" }, "ownerId": "11256", "aid": "61235136" },
                            { "id": "100168", "name": "Time to Pretend", "artists": { "artist": { "id": "782774", "name": "MGMT" } }, "album": { "id": "182423", "name": "Oracular Spectacular", "image": "7343" }, "stats": { "rank": "1062646", "likes": "0" }, "similar": "", "duration": "268", "styles": { "style": "152" }, "ownerId": "82587368", "aid": "137968062" },
                            { "id": "3567", "name": "Scar Tissue", "artists": { "artist": { "id": "782731", "name": "Red Hot Chili Peppers" } }, "album": { "id": "174612", "name": "Greatest Hits", "image": "220" }, "stats": { "rank": "1051654", "likes": "0" }, "similar": "", "duration": "217", "styles": { "style": "152" }, "ownerId": "6235545", "aid": "81448827" },
                            { "id": "9016", "name": "Time Is Running Out", "artists": { "artist": { "id": "782734", "name": "Muse" } }, "album": { "id": "175537", "name": "2004-12-20: Earl's Court, London, UK", "image": "782" }, "stats": { "rank": "1037846", "likes": "0" }, "similar": "", "duration": "237", "styles": { "style": "152" }, "ownerId": "8086345", "aid": "84632219" },
                            { "id": "28261", "name": "Use Somebody", "artists": { "artist": { "id": "782760", "name": "Kings of Leon" } }, "album": { "id": "176778", "name": "Only By The Night", "image": "2151" }, "stats": { "rank": "1030108", "likes": "0" }, "similar": "", "duration": "230", "styles": { "style": "252" }, "ownerId": "2013673", "aid": "86676312" },
                            { "id": "28985", "name": "Sweet Child o' Mine", "artists": { "artist": { "id": "137286", "name": "Guns N' Roses" } }, "album": { "id": "225477", "name": "Appetite for Destruction", "image": "2279" }, "stats": { "rank": "1027881", "likes": "0" }, "similar": "", "duration": "356", "styles": { "style": "154" }, "ownerId": "1412326", "aid": "82422311" },
                            { "id": "9685", "name": "Bohemian Rhapsody", "artists": { "artist": { "id": "782744", "name": "Queen" } }, "album": { "id": "175314", "name": "Classic Queen", "image": "847" }, "stats": { "rank": "1027464", "likes": "0" }, "similar": "", "duration": "355", "styles": { "style": "153" }, "ownerId": "16647589", "aid": "52124717" },
                            { "id": "3571", "name": "Otherside", "artists": { "artist": { "id": "782731", "name": "Red Hot Chili Peppers" } }, "album": { "id": "174612", "name": "Greatest Hits", "image": "220" }, "stats": { "rank": "1025993", "likes": "0" }, "similar": "", "duration": "255", "styles": { "style": "152" }, "ownerId": "131261", "aid": "151697" },
                            { "id": "4238", "name": "Smile Like You Mean It", "artists": { "artist": { "id": "782756", "name": "The Killers" } }, "album": { "id": "174761", "name": "Hot Fuss", "image": "300" }, "stats": { "rank": "1001861", "likes": "0" }, "similar": "", "duration": "234", "styles": { "style": "252" }, "ownerId": "-12658633", "aid": "69755238" },
                            { "id": "4242", "name": "All These Things That I've Done", "artists": { "artist": { "id": "782756", "name": "The Killers" } }, "album": { "id": "174761", "name": "Hot Fuss", "image": "300" }, "stats": { "rank": "999606", "likes": "0" }, "similar": "", "duration": "302", "styles": { "style": "252" }, "ownerId": "19234451", "aid": "108717778" },
                            { "id": "59888", "name": "Seven Nation Army", "artists": { "artist": { "id": "782777", "name": "The White Stripes" } }, "album": { "id": "179390", "name": "Elephant", "image": "4765" }, "stats": { "rank": "997148", "likes": "0" }, "similar": "", "duration": "230", "styles": { "style": "152" }, "ownerId": "86851645", "aid": "100815739" },
                            { "id": "3290", "name": "Dani California", "artists": { "artist": { "id": "782731", "name": "Red Hot Chili Peppers" } }, "album": { "id": "174610", "name": "Stadium Arcadium", "image": "218" }, "stats": { "rank": "980273", "likes": "0" }, "similar": "", "duration": "282", "styles": { "style": "152" }, "ownerId": "58278579", "aid": "79205750" },
                            { "id": "8993", "name": "Hysteria", "artists": { "artist": { "id": "782734", "name": "Muse" } }, "album": { "id": "175537", "name": "2004-12-20: Earl's Court, London, UK", "image": "782" }, "stats": { "rank": "971634", "likes": "0" }, "similar": "", "duration": "227", "styles": { "style": "152" }, "ownerId": "-20340949", "aid": "86569263" }]
                    };

                setTimeout(function () { onSuccess({ totalResults: 5000, query: searchParams.query, tracks: tracks }); }, offlineDelay);
            }
        },
        getGenres: function (onSuccess) {
            //if (!offlineDelay)
            //    ajax(urls.genres, onSuccess);
            //else
                //setTimeout(function () {
                    var response = { "genres": { "genre": [{ "id": "1", "name": "Hip Hop", "styles": { "style": [{ "id": "1", "name": "Rap" }, { "id": "2", "name": "Hip Hop" }, { "id": "3", "name": "Gangsta rap" }, { "id": "4", "name": "Alternative rap" }, { "id": "5", "name": "Hardcore rap" }, { "id": "6", "name": "Dirty south" }, { "id": "7", "name": "French rap" }, { "id": "8", "name": "Latin rap" }, { "id": "251", "name": "Grime" }] } }, { "id": "2", "name": "R&B", "styles": { "style": [{ "id": "141", "name": "R&B" }, { "id": "142", "name": "Neo Soul" }, { "id": "144", "name": "Urban" }] } }, { "id": "4", "name": "Pop", "styles": { "style": [{ "id": "145", "name": "Pop" }, { "id": "146", "name": "Latin pop" }, { "id": "147", "name": "French pop" }, { "id": "148", "name": "Italian pop" }, { "id": "149", "name": "Teen pop" }, { "id": "150", "name": "Dance" }, { "id": "151", "name": "Disco" }] } }, { "id": "3", "name": "Rock", "styles": { "style": [{ "id": "152", "name": "Alternative" }, { "id": "252", "name": "Indie rock" }, { "id": "253", "name": "Nu metal" }, { "id": "153", "name": "Classic rock" }, { "id": "154", "name": "Hard Rock" }, { "id": "155", "name": "Hardcore" }, { "id": "157", "name": "Metal" }, { "id": "159", "name": "Trash metal" }, { "id": "160", "name": "Death\/Black metal" }, { "id": "254", "name": "Progressive metal" }, { "id": "163", "name": "Gothic" }, { "id": "164", "name": "Punk" }, { "id": "255", "name": "Emo" }, { "id": "271", "name": "Rock'n'Roll" }, { "id": "272", "name": "Pop rock" }] } }, { "id": "5", "name": "House", "styles": { "style": [{ "id": "165", "name": "House" }, { "id": "166", "name": "Tech house" }, { "id": "167", "name": "Deep house" }, { "id": "168", "name": "Electro house" }, { "id": "169", "name": "Progressive house" }, { "id": "170", "name": "Tribal house" }, { "id": "171", "name": "Vocal house" }, { "id": "172", "name": "Acid house" }] } }, { "id": "9", "name": "Trance", "styles": { "style": [{ "id": "173", "name": "Trance" }, { "id": "180", "name": "Epic trance" }, { "id": "174", "name": "Tech trance" }, { "id": "175", "name": "Vocal trance" }, { "id": "176", "name": "Progressive trance" }, { "id": "177", "name": "Melodic trance" }, { "id": "178", "name": "Hard trance" }, { "id": "179", "name": "Euro trance" }] } }, { "id": "8", "name": "Techno", "styles": { "style": [{ "id": "181", "name": "Techno" }, { "id": "182", "name": "Minimal" }, { "id": "183", "name": "Detroit techno" }, { "id": "184", "name": "Deep techno" }, { "id": "185", "name": "Dub techno" }] } }, { "id": "13", "name": "Electronic", "styles": { "style": [{ "id": "186", "name": "Electronica" }, { "id": "187", "name": "Nu Disco" }, { "id": "188", "name": "Electro" }, { "id": "189", "name": "Trip hop" }, { "id": "190", "name": "Synthpop" }, { "id": "191", "name": "Chiptune" }, { "id": "192", "name": "Glitch" }, { "id": "193", "name": "Tribal" }, { "id": "194", "name": "8-Bit" }, { "id": "195", "name": "IDM" }] } }, { "id": "6", "name": "Breakbeat", "styles": { "style": [{ "id": "196", "name": "Drum&Bass" }, { "id": "256", "name": "Liquid funk" }, { "id": "197", "name": "Intelligent" }, { "id": "199", "name": "Dubstep" }, { "id": "200", "name": "Techstep" }, { "id": "203", "name": "Darkstep" }, { "id": "257", "name": "Ragga jungle" }, { "id": "204", "name": "Jump Up" }, { "id": "201", "name": "Breakbeat" }, { "id": "258", "name": "Progressive Breaks" }, { "id": "259", "name": "Nuskool breaks" }, { "id": "260", "name": "Funky Breaks" }, { "id": "261", "name": "2 step" }] } }, { "id": "10", "name": "Psychedelic", "styles": { "style": [{ "id": "207", "name": "Full on" }, { "id": "208", "name": "Psyprog" }, { "id": "209", "name": "Psytrance" }, { "id": "210", "name": "Darkpsy" }, { "id": "211", "name": "Psy Chill" }] } }, { "id": "12", "name": "Hardstyle", "styles": { "style": [{ "id": "262", "name": "Dark electro" }, { "id": "212", "name": "Hard techno" }, { "id": "263", "name": "Hardstep" }, { "id": "213", "name": "Hardcore" }, { "id": "264", "name": "Happy hardcore" }, { "id": "265", "name": "Speedcore" }, { "id": "266", "name": "Breakcore" }, { "id": "214", "name": "Hard Bass" }, { "id": "215", "name": "Jumpstyle" }, { "id": "216", "name": "Schranz" }, { "id": "217", "name": "Gabber" }] } }, { "id": "7", "name": "Chill out", "styles": { "style": [{ "id": "218", "name": "Chillout" }, { "id": "219", "name": "Lounge" }, { "id": "220", "name": "Ambient" }, { "id": "221", "name": "Downtempo" }, { "id": "222", "name": "Meditative" }, { "id": "223", "name": "New Age" }, { "id": "224", "name": "Reggae" }, { "id": "225", "name": "World" }] } }, { "id": "14", "name": "Classic", "styles": { "style": [{ "id": "226", "name": "Classical" }, { "id": "227", "name": "Neoclassical" }, { "id": "267", "name": "Classical crossover" }, { "id": "228", "name": "Impressionist" }, { "id": "229", "name": "Renaissance" }, { "id": "230", "name": "Baroque" }, { "id": "231", "name": "Choral" }, { "id": "232", "name": "Opera" }, { "id": "233", "name": "Piano" }] } }, { "id": "15", "name": "Blues", "styles": { "style": [{ "id": "268", "name": "Soul" }, { "id": "235", "name": "Classic Blues" }, { "id": "269", "name": "Modern blues" }, { "id": "236", "name": "Chicago blues" }, { "id": "234", "name": "Delta Blues" }, { "id": "237", "name": "Blues Rock" }, { "id": "238", "name": "Rhythem & blues" }, { "id": "239", "name": "Electric blues" }, { "id": "240", "name": "Motown" }, { "id": "273", "name": "Country" }] } }, { "id": "11", "name": "Jazz", "styles": { "style": [{ "id": "241", "name": "Smooth Jazz" }, { "id": "242", "name": "Vocal Jazz" }, { "id": "243", "name": "Nu Jazz" }, { "id": "244", "name": "Acid Jazz" }, { "id": "245", "name": "Cool Jazz" }, { "id": "246", "name": "Free Jazz" }, { "id": "270", "name": "Modern Jazz" }, { "id": "247", "name": "Classic Jazz" }, { "id": "248", "name": "Bossa Nova" }, { "id": "249", "name": "Soul Jazz" }, { "id": "250", "name": "Fusion" }] } }] } };
                    onSuccess(response);
                //}, offlineDelay);
        }
    };

    return elixirApi;
})