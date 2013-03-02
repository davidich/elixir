// if console doesn't exists(IE)
if (!window.console) {
    window.console = {};
}
var debugLevels = ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd", "time", "timeEnd"];
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

//window.console.error = window.console.log;


// place to keep some global values (I doubt we'll need it but let's have it for now)
GLOBAL = Global = global =
{
    appVer: "0.0.0",
    tracksHeaderHeight: 90,
    tracksItemHeight: 34,
    searchDelay: 1000
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
        var componets = ["vkApi", "soundManager", "genreSelector", "customFormElement", "html"];
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
                $("#loaderBar").animate({ width: barWidth }, 250, "linear", function() {
                    if ($("#loaderBar").width() == $("#loaderContainer").width()) {
                        $("#splashContent").fadeOut("slow");
                    }
                });

                // did we get all awaited events?
                if (componets.length == 0) {
                    pubSub.unsub("componentInited");        // remove event subscription                                    

                    // set active vm
                    require(["ko", "Vms/root"], function (ko, rootVm) {
                        ko.applyBindings(rootVm);
                        //rootVm.navigate("search.music.tracks");
                        rootVm.navigate("welcome");
                    });
                }
            });
        });

        initVk(function () {
            pubSub.pub("componentInited", "vkApi");

            setTimeout(function () {
                initHtml(function () {
                    pubSub.pub("componentInited", "html");
                });

                initSm(function () {
                    pubSub.pub("componentInited", "soundManager");
                });

                initGenreSelector(function () {
                    pubSub.pub("componentInited", "genreSelector");
                });

                initCustomFormElement(function () {
                    pubSub.pub("componentInited", "customFormElement");
                });
            }, 500);
        });
    });

    function initVk(onComplete) {
        require(["vk", "pubSub"], function (vk, pubSub) {
            //if (window.location.href.indexOf("localhost") != -1) {
            //    pubSub.pub("componentInited", "vkApi");
            //} else {
            try {
                vk.init(function () {
                    window.vk = vk;
                    console.log("vk has finished initialization");
                    onComplete();
                }, function () {
                    alert("VK api initialization failed;");
                });

            } catch (e) {
                console.log("Exception in vk.init: " + e);
                onComplete();
            }
            //}
        });
    }

    function initSm(onComplete) {
        require(["soundManager"], function () {
            console.log("sm module loaded");
            try {
                soundManager.setup({
                    preferFlash: true,
                    url: 'Scripts/Libs/soundmanager/swfs/reg/',
                    allowScriptAccess: "always", //"sameDomain",
                    onready: function () {
                        onComplete();
                    }
                });
            } catch (e) {
                console.error("Exception in sm.setup: " + e);
            }
        });
    }

    function initGenreSelector(onComplete) {
        require(["Types/GenreSelector"], function (selector) {
            selector.preloadGenres(onComplete);
        });
    }

    function initCustomFormElement(onComplete) {
        require(["domReady", "customFormElem"], function (domReady, customFormElem) {
            domReady(function () {
                customFormElem.init();
                onComplete();
            });
        });
    }

    function initHtml(onComplete) {
        require(["htmlBuilder"], function (builder) {
            builder.build(onComplete);
        });
    }
});