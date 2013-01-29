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
    require(["vk"], function (vk) {
        vk.init(function () {
            window.vk = vk;
            require(["app"]); //bootsrap app
        }, function () {
            alert("VK api initialization failed;");
        });
    });
});