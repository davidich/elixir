// if console doesn't exists(IE)
if (!window.console) {
    window.console = {};
}
var debugLevels = ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"];
for (var i = 0; i < debugLevels.length; i++) {
    if (!window.console[debugLevels[i]] || typeof window.console[debugLevels[i]] != "function")
        window.console[debugLevels[i]] = function () {
        };
}


// place to keep some global values (I doubt we'll need it but let's have it for now)
GLOBAL = Global = global =
{
    appVer: "0.0.0"
};

// disable ajax caching (I don't we need it but anyways)
$.ajaxSetup({
    cache: false
});

require(["require-config"], function () {

    require(["pubSub", "domReady", "jqueryui"], function (pubSub, domReady) {
        var componets = ["vkApi", "soundManager"];
        var componentCount = componets.length;

        domReady(function () {
            pubSub.sub("componentInited", function (componentName) {
                var componentIndex = $.inArray(componentName, componets);
                componets.splice(componentIndex, 1);

                //report progress
                var completedEventCount = componentCount - componets.length;
                var progress = completedEventCount / componentCount;
                var barWidth = progress * $("#loaderContainer").width();
                $("#loaderBar").animate({ width: barWidth }, 250, "linear", function () {                    
                    if ($("#loaderBar").width() == $("#loaderContainer").width())
                        $("#splashContent").fadeOut("slow");    // hide splash once loaded
                });

                // did we get all awaited events?
                if (componets.length == 0) {
                    pubSub.unsub("componentInited");        // remove event subscription                
                    require(["app"], function () { });      // start app
                }
            });
        });

        // start VK initialization
        require(["vk"], function (vk) {
            vk.init(function () {
                window.vk = vk;
                pubSub.pub("componentInited", "vkApi");
            }, function () {
                alert("VK api initialization failed;");
            });
        });

        // start SoundManager2 initialization
        require(["soundmanager2"], function (soundManager) {
            // The following may help Flash see the global.
            window.soundManager = soundManager;

            // set manager params
            soundManager.setup({
                preferFlash: true,
                url: ' http://davidich.la.net.ua/elexir/APPLICATION/Scripts/Libs/soundmanager/swfs/',
                //allowScriptAccess: 'sameDomain',
                //debugMode: true,
                //debugFlash: true,
                //flashVersion: 9, // optional: shiny features (default = 8)
                //useFlashBlock: false, // optionally, enable when you're ready to dive in
                onready: function () {
                    pubSub.pub("componentInited", "soundManager");
                }
            });

            return soundManager;
        });
    });
});