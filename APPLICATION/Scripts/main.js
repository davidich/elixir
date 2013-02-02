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
//$.ajaxSetup({
//    cache: false
//});

// for getting wrongly parsed XML colletions
$.getNamedArray = function(source, collectionName) {
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
                var componentIndex = $.inArray(componentName, componets);
                componets.splice(componentIndex, 1);

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
                    require(["app"], function () { });      // start app                                       
                }
            });
        });
        
       
        // start VK initialization
        if (window.location.href.indexOf("localhost") != -1) {
            pubSub.pub("componentInited", "vkApi");
            pubSub.pub("componentInited", "soundManager");
        } else {            
            require(["vk"], function (vk) {
                vk.init(function () {
                    pubSub.pub("componentInited", "vkApi");
                    window.vk = vk;
                    //window.parent.vk = vk;                                        
                }, function () {
                    alert("VK api initialization failed;");
                });
            });
        
            // start SoundManager2 initialization
            require(["soundmanager2"], function (soundManager) {
                soundManager.setup({
                    preferFlash: true,
                    url: 'Scripts/Libs/soundmanager/swfs/reg/',
                    //allowScriptAccess: 'sameDomain',
                    //debugMode: true,                    
                    onready: function () {
                        pubSub.pub("componentInited", "soundManager");
                        window.sm = soundManager;                        
                    }
                });                
            });
        }
    });
});