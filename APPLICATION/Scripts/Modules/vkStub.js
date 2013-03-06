define([], function () {
    var tracks = [
        { "aid": 60886293, "owner_id": -5139236, "artist": "Grand Theft Auto", "title": "Billie Jean", "duration": 293, "url": "http:\/\/cs4192.vk.me\/u19494134\/audios\/6133865e7106.mp3" },
        { "aid": 108717778, "owner_id": 19234451, "artist": "The Killers", "title": "All These Things That I've Done", "duration": 302, "url": "http:\/\/cs4853.vk.me\/u19234451\/audios\/7732c371d133.mp3", "lyrics_id": "11448743", "album": "20510053" },
        { "aid": 100815739, "owner_id": 86851645, "artist": "The White Stripes ", "title": "Seven Nation Army", "duration": 232, "url": "http:\/\/cs1521.vk.me\/u190144\/audios\/de88687665ec.mp3", "lyrics_id": "6609221" },
        { "aid": 86710823, "owner_id": 71218845, "artist": "Amy Winehouse", "title": "Rehab", "duration": 215, "url": "http:\/\/cs4880.vk.me\/u71218845\/audios\/0ea3efaeb681.mp3" },
        { "aid": 91227338, "owner_id": 3080899, "artist": "Nirvana", "title": "About A Girl", "duration": 168, "url": "http:\/\/cs4780.vk.me\/u87620145\/audios\/9afa80d93122.mp3", "lyrics_id": "7707010" },
        { "aid": 77913129, "owner_id": 8453076, "artist": "Oasis", "title": "Don't Look Back In Anger", "duration": 286, "url": "http:\/\/cs4648.vk.me\/u8453076\/audios\/bac67bbf519c.mp3", "lyrics_id": "4779519", "album": "1942611" },
        { "aid": 103457945, "owner_id": 95696346, "artist": "Arctic Monkeys", "title": "I Bet You Look Good on the Dancefloor", "duration": 174, "url": "http:\/\/cs4860.vk.me\/u23618708\/audios\/f7680358a8c6.mp3", "lyrics_id": "11499247", "album": "14370372" },
        { "aid": 75215114, "owner_id": 10150365, "artist": "Blink-182", "title": "All the Small Things", "duration": 171, "url": "http:\/\/cs4636.vk.me\/u10150365\/audios\/ec28aae7d89b.mp3", "lyrics_id": "4288605", "album": "16805390" },
        { "aid": 95096932, "owner_id": 19611345, "artist": "Amy Winehouse", "title": "Back to Black", "duration": 240, "url": "http:\/\/cs1748.vk.me\/u15420955\/audios\/e09d0ac1c2b1.mp3", "lyrics_id": "3739481" },
        { "aid": 109234755, "owner_id": 49842069, "artist": "Arctic Monkeys", "title": "Fake Tales of San Francisco", "duration": 177, "url": "http:\/\/cs4512.vk.me\/u3066345\/audios\/75e1e16d3d1a.mp3", "lyrics_id": "5847893" },
        { "aid": 94585096, "owner_id": 762166, "artist": "Adele", "title": "Rolling in the Deep", "duration": 229, "url": "http:\/\/cs5074.vk.me\/u762166\/audios\/7a51bfc73f49.mp3", "lyrics_id": "8745137" },
        { "aid": 79756631, "owner_id": 7508264, "artist": "Nirvana", "title": "All Apologies", "duration": 232, "url": "http:\/\/cs4640.vk.me\/u7508264\/audios\/7d43a02e3263.mp3", "lyrics_id": "5279940", "album": "3174287" },
        { "aid": 40922737, "owner_id": 6052093, "artist": "AC\/DC", "title": "Back in Black", "duration": 254, "url": "http:\/\/cs1591.vk.me\/u6052093\/audios\/933d28a4a842.mp3", "lyrics_id": "484140" },
        { "aid": 42383591, "owner_id": 3071130, "artist": "Arctic Monkeys", "title": "Mardy Bum", "duration": 175, "url": "http:\/\/cs1040.vk.me\/u73873\/audios\/792e58c3f632.mp3", "lyrics_id": "4533488" },
        { "aid": 90837883, "owner_id": 1999426, "artist": "Amy Winehouse", "title": "You Know I'm No Good", "duration": 257, "url": "http:\/\/cs4781.vk.me\/u50549001\/audios\/a226d8d69575.mp3", "lyrics_id": "7485062" },
        { "aid": 98654430, "owner_id": 876845, "artist": "Radiohead", "title": "All I Need", "duration": 228, "url": "http:\/\/cs5059.vk.me\/u876845\/audios\/8320410d51b7.mp3", "lyrics_id": "6395334" },
        { "aid": 67316813, "owner_id": 50867787, "artist": "Radiohead", "title": "Airbag", "duration": 284, "url": "http:\/\/cs4293.vk.me\/u50867787\/audios\/eba8438fed96.mp3" },
        { "aid": 81677494, "owner_id": 4896445, "artist": "Queen", "title": "Another One Bites the Dust", "duration": 214, "url": "http:\/\/cs4529.vk.me\/u4896445\/audios\/4103e51313ad.mp3", "lyrics_id": "3506115" },
        { "aid": 91447062, "owner_id": 104281259, "artist": "Arctic Monkeys", "title": "Dancing Shoes", "duration": 141, "url": "http:\/\/cs5116.vk.me\/u90489945\/audios\/9ec5fa1125ac.mp3", "lyrics_id": "7817985" },
        { "aid": 57152951, "owner_id": 25349488, "artist": "Queens of the Stone Age", "title": "No One Knows", "duration": 278, "url": "http:\/\/cs4202.vk.me\/u25349488\/audios\/ff58bd05f6dc.mp3", "lyrics_id": "1377015" },
        { "aid": 90723062, "owner_id": -21608826, "artist": "The Beatles", "title": "All You Need Is Love", "duration": 228, "url": "http:\/\/cs4996.vk.me\/u109704500\/audios\/b94695791182.mp3", "lyrics_id": "7436038" },
        { "aid": 72449408, "owner_id": 9052888, "artist": "Three Days Grace", "title": "I Hate Everything About You", "duration": 233, "url": "http:\/\/cs4723.vk.me\/u17094745\/audios\/6c9d6fd524bb.mp3", "lyrics_id": "4144452" },
        { "aid": 88852837, "owner_id": 3862178, "artist": "Skrewdriver", "title": "Sweet Home Alabama", "duration": 228, "url": "http:\/\/cs4341.vk.me\/u20958508\/audios\/6e85db3f7e67.mp3" },
        { "aid": 90149544, "owner_id": 11400608, "artist": "The Offspring", "title": "The Kids Aren't Alright", "duration": 180, "url": "http:\/\/cs4761.vk.me\/u11400608\/audios\/edd2b2f61490.mp3", "lyrics_id": "6534423" },
        { "aid": 46474775, "owner_id": 5354, "artist": "Foo Fighters", "title": "All My Life", "duration": 265, "url": "http:\/\/cs1749.vk.me\/u05354\/audios\/6672f441a4e6.mp3", "lyrics_id": "805112" },
        { "aid": 206310, "owner_id": 1581373, "artist": "System of a Down", "title": "Aerials", "duration": 235, "url": "http:\/\/cs1040.vk.me\/u1581373\/audios\/e975a4e1fa25.mp3", "lyrics_id": "5524", "album": "1113212" },
        { "aid": 62900084, "owner_id": 11054800, "artist": "AC\/DC", "title": "Highway to Hell", "duration": 208, "url": "http:\/\/cs4237.vk.me\/u4694279\/audios\/3326f98d137e.mp3", "lyrics_id": "6151402" },
        { "aid": 542178, "owner_id": 43137, "artist": "Arctic Monkeys", "title": "Fluorescent Adolescent", "duration": 177, "url": "http:\/\/cs1044.vk.me\/u43137\/audios\/7b5e6f9c876f.mp3", "lyrics_id": "10627" },
        { "aid": 82424270, "owner_id": 9688799, "artist": "Blink-182", "title": "What's My Age Again?", "duration": 150, "url": "http:\/\/cs5064.vk.me\/u9688799\/audios\/fa584ce44e37.mp3", "lyrics_id": "5472593" },
        { "aid": 100890096, "owner_id": 36243132, "artist": "Radiohead", "title": "Subterranean Homesick Alien", "duration": 267, "url": "http:\/\/cs1084.vk.me\/u1016416\/audios\/3dfcc0c0d8cd.mp3", "lyrics_id": "9991352", "album": "9842668" }
    ];

    function getRandomTrack() {
        var randIndex = Math.floor((Math.random() * tracks.length));
        return tracks[randIndex];
    }

    var vkApi =
    {
        init: function(onComplete) {
            onComplete();
        },
        appendVkData: function (tracks, onSuccess) {
            var i,
                request = "";

            if (!$.isArray(tracks)) {
                request = tracks.appendVkRequest(request);
            } else {
                $.each(tracks, function () {
                    request = this.appendVkRequest(request);
                });
            }

            // stub VK response
            var vkData = {};
            var pairs = request.split(",");
            for (i = 0; i < pairs.length; i++) {
                var values = pairs[i].split("_");
                var stub = getRandomTrack();
                vkData[values[1]] = {
                    url: stub.url,
                    duration: stub.duration
                };
            }

            // obserb results
            if (!$.isArray(tracks)) {
                tracks.obserbVkData(vkData);
            } else {
                for (i = tracks.length - 1; i >= 0; i--) {
                    tracks[i].obserbVkData(vkData);
                    if (!tracks[i].url) {
                        tracks.splice(i, 1);
                    }
                }
            }

            onSuccess(tracks);
        }
    };

    return vkApi;
});