define(["ko", "Types/Track"], function (ko, Track) {   
    var TrackSearcher = {
        search: function(query, result) {
            var searchParams = {
                q: query,
                auto_complete: 1,   // enable correction from Иуфдуы to Beatles
                sort: 2,            // sort by popularity
                count: 10,          // item per response
                offset: 0           // response offset
            };
            
            vk.api("audio.search", searchParams, function(obj) {
                result.totalCount(obj.response[0]);
                
                result.tracks.removeAll();
                
                for (var i = 1; i < obj.response.length; i++) {
                    result.tracks.push(new Track(obj.response[i]));
                }
            });
        }          
    };

    return TrackSearcher;
})