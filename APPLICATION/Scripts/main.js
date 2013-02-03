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

var showConsoleLog = false;
if (showConsoleLog) {
    $("<div/>")
        .attr("id", "debugOutput")
        .css("position", "absolute")
        .css("top", 0)
        .css("left", 0)
        .css("z-index", 5)
        .css("background", "rgba(238, 238, 238, 0.7)")
        .css("padding", 5)
        .css("min-width", 200)
        .css("border", "1px solid #333")
        .hide()
        .appendTo($("body"));

    window.console.log = function (text) {
        var div = $("<div/>").text("*: " + text);
        $("#debugOutput").append(div);
    };
}

window.console.error = window.console.log;


// place to keep some global values (I doubt we'll need it but let's have it for now)
GLOBAL = Global = global =
{
    appVer: "0.0.0"
};

// for getting wrongly parsed XML colletions
$.getNamedArray = function (source, collectionName) {
    if (!source[collectionName])
        return [];

    var propName = collectionName.substring(0, collectionName.length - 1);
    var collection = source[collectionName][propName];

    return $.isArray(collection)
        ? collection
        : [collection];
};

require(["require-config"], function () {
    require(["pubSub", "domReady", "jqueryui"], function (pubSub, domReady) {
        var componets = ["vkApi", "soundManager"];
        var componentCount = componets.length;

        domReady(function () {
            pubSub.sub("componentInited", function (componentName) {
                console.log("component event received: " + componentName);

                var componentIndex = $.inArray(componentName, componets);
                componets.splice(componentIndex, 1);
                console.log("component to wait: " + componets.length);

                //report progress
                var completedEventCount = componentCount - componets.length;
                var progress = completedEventCount / componentCount;
                var barWidth = progress * $("#loaderContainer").width();
                $("#loaderBar").animate({ width: barWidth }, /*25*/0, "linear", function () {
                    if ($("#loaderBar").width() == $("#loaderContainer").width())
                        $("#splashContent").fadeOut("slow");    // hide splash once loaded
                });

                // did we get all awaited events?
                if (componets.length == 0) {
                    pubSub.unsub("componentInited");        // remove event subscription                
                    console.log("starting app.js");
                    require(["app"], function () { });      // start app                                       
                }
            });
        });


        // start VK initialization
        if (window.location.href.indexOf("localhost") != -1) {
            pubSub.pub("componentInited", "vkApi");
            pubSub.pub("componentInited", "soundManager");
        } else {
            try {
                require(["vk"], function (vk) {
                    vk.init(function () {
                        window.vk = vk;
                        console.log("vk has finished initialization");
                        pubSub.pub("componentInited", "vkApi");
                    }, function () {
                        alert("VK api initialization failed;");
                    });
                });
            } catch (e) {
                console.log("Exception in vk.init: " + e);
            }

            // start SoundManager2 initialization
            console.log("before sm module load");
            require(["soundmanager2"], function (soundManager) {
                console.log("sm module loaded");
                try {
                    soundManager.setup({
                        preferFlash: true,
                        url: 'Scripts/Libs/soundmanager/swfs/reg/',
                        allowScriptAccess: "always", //"sameDomain",
                        onready: function () {
                            window.sm = soundManager;
                            console.log("sm has finished initialization");
                            pubSub.pub("componentInited", "soundManager");
                        }
                    });
                } catch (e) {
                    console.log("Exception in sm.setup: " + e);
                }
            });
        }
    });
});