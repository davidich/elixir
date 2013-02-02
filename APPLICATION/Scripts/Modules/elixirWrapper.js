define([], function () {
    var baseUrl = "http://api.elixirvk.com/services/";

    var elixirApi = {
        //by: all, artist, title
        searchTracks: function (by) {
            var _by;

            $.get("http://api.elixirvk.com/services/tracks/?by=all&genre=4&style=0&query=us&hq=0&order=interesting&timerange=year&page=1&artist=0&json=1", function(data) {
                console.log(data);
            });

            switch (by) {
                case "all":
                    by = "all";
                    break;
                case "artist":
                    by = "artist_name";
                    break;
                case "title":
                    by = "track_name";
                    break;
            }


        }
    };
})