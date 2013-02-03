define(["vkApiSource", "Types/Track"], function (vkApi, Track) {
    vkApi.args = (function() {
        var params = {};

        var url = location.href;
        if (url.indexOf("?") == -1) return params;
        
        url = url.replace(/.*\?(.*?)/, "$1");
        var pairs = url.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var parts = pairs[i].split("=");
            var argName = parts[0];
            var argValue = decodeURIComponent(parts[1].replace(/\+/g, " "));
            params[argName] = argValue;
        }

        return params;
    })();

    vkApi.constructTracks = function(metadata, callback) {
        var tracks = $.getNamedArray(metadata, "tracks");

        // format vk parameter
        var i, paramValue = "";
        for (i = 0; i < tracks.length; i++) {
            if (paramValue.length > 0) paramValue += ",";
            paramValue += tracks[i].ownerId + "_" + tracks[i].aid;
        }

        // query data
        vk.api("audio.getById", { audios: paramValue }, function (vkObj) {

            var constructedTracks = [];
            
            for (i = 0; i < vkObj.response.length; i++) {
                var vkTrack = vkObj.response[i];
                var match = $.grep(tracks, function (track) { return track.aid == vkTrack.aid; });
                if (match.length > 0) constructedTracks.push(new Track(match[0], vkTrack.url));                    
            }

            callback(constructedTracks);            
        });
    };

    return vkApi;
});