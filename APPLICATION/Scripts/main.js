// if console.log does't exists(IE)
if (!console || !console.log || typeof console.log != "function")
    console = { log: function () { } };

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
requirejs(['jquery'],
function ($) {
    $.ajaxSetup({
        cache: false
    });


});