define(["ko"], function(ko) {
    function Track(track_vk) {
        var self = this;

        //VK FORMAT EXAMPLE
        //<aid>60830458</aid>
        //<owner_id>1234</owner_id>
        //<artist>Unknown</artist>
        //<title>Bosco</title>
        //<duration>195</duration>
        //<url>httр://cs40.vkоntakte.ru/u06492/audio/2ce49d2b88.mp3</url>
        self.id = ko.observable(track_vk.aid);
        self.url =  ko.observable(track_vk.url);
        self.artist = ko.observable(track_vk.artist);
        self.title =  ko.observable(track_vk.title);
        self.duration = ko.observable(track_vk.duration);
        self.time = ko.computed(function() {
            var mins = parseInt(self.duration() / 60);
            var secs = self.duration() % 60;
            return mins + ":" + (secs < 10 ? "0" + secs : secs);
        });
    }

    return Track;
})