// if console doesn't exists(IE)
if (!window.console) {
    window.console = {};
}
var debugLevels = ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"];
for (var i = 0; i < debugLevels.length; i++) {
    if (!window.console[debugLevels[i]] || typeof window.console[debugLevels[i]] != "function")
        window.console[debugLevels[i]] = function() {
        };
}


// place to keep some global values (I doubt we'll need it but let's have it for now)
GLOBAL =
    Global =
        global =
        {
            appVer: "0.0.0"
        };

var config = {
    waitSeconds: 60,
    paths: {
        knockout: 'Libs/knockout/knockout-2.1.1.debug',     //don't remove that alias as it is needed for custom bindings
        ko: 'Libs/knockout/knockoutWrapper',
        autoNumeric: 'Libs/autoNumeric',
        pubSub: 'Libs/pubSub',
        json: 'Libs/json',
        tristate: 'Libs/tristate',
        vistaTextbox: 'Libs/vistaTextbox',
        Plupload: 'Libs/Plupload',
        soundmanager2: 'Libs/soundmanager/soundmanager2',
        sm2: 'Libs/soundmanager/soundmanagerWrapper'
    },
    shim: {
        'soundmanager2': {
            //These script dependencies should be loaded before loading soundmanager2            
            deps: [],
            //Once loaded, use the global 'soundManager' as the module value
            exports: 'soundManager'
        }
    }
};

if (global && global.appVer)
    config.urlArgs = "cacheFix=" + global.appVer;

requirejs.config(config);


// Start the main app logic.
require(["jquery", "domReady", "sm2"],
    function ($, domReady, sm2) {
        
        $.ajaxSetup({
            cache: false
        });

        domReady(function () {
            $("#playPause").click(function () {
                var buttonText = $(this).text();
                if (buttonText == ">")
                    play();
                else
                    pause();
            });

            $("#stop").click(stop);

            $("#muteUnmute").click(function () {
                var button = $(this);

                if (!sm2.muted)
                    sm2.mute();
                else
                    sm2.unmute();

                button.text(button.text() == "mute" ? "unmute" : "mute");
                sm2.toggleMute("curSound");
            });

            $("#songs button").click(function () { playSong(this); });
        });

        function play() {
            var soundUrl = $("#soundUrl").val();
            if (!sm2.canPlayURL(soundUrl)) {
                alert("bad url");
                return;
            }

            $("#playPause").text("||");

            var curSong = sm2.getSoundById("curSong");
            if (curSong && curSong.url == soundUrl)
                curSong.resume();
            else {
                sm2.destroySound("curSong");

                var curSoung = sm2.createSound({
                    id: 'curSong',
                    url: soundUrl
                });

                curSoung.play();
            }
        }

        function pause() {
            $("#playPause").text(">");
            sm2.pauseAll();
        }

        function playSong(songButton) {
            var $button = $(songButton);
            $("#soundUrl").val($button.data("url"));
            play();
        }

        function stop() {
            $("#soundUrl").val("");
            $("#playPause").text(">");
            sm2.destroySound("curSong");
        }
    });