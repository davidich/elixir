var config = {
    waitSeconds: 60,
    paths: {
        knockout: 'Libs/knockout/knockout-2.2.1.debug',                 //don't remove that alias as it is needed for custom bindings
        ko: 'Libs/knockout/knockoutWrapper',                            //<- use this alias for Knockout
        autoNumeric: 'Libs/autoNumeric',
        pubSub: 'Libs/pubSub',
        json: 'Libs/json',
        tristate: 'Libs/tristate',
        vistaTextbox: 'Libs/vistaTextbox',
        Plupload: 'Libs/Plupload',
        soundManager: 'Libs/soundmanager/soundmanager2',        
        vkApiSource: 'http://vk.com/js/api/xd_connection.js?2',
        vk: 'Modules/vkWrapper',                                        //<- use this alias for VK Api
        elixir: 'Modules/elixirWrapper',
        htmlBuilder: 'Modules/htmlBuilder',
        jqueryui: 'Libs/jquery-ui-1.10.0',
        customFormElem: 'Libs/customFormElements',
        scroll: 'Libs/scroll/scrollWraper',
        slider: 'Libs/jquery.carouFredSel-6.2.0',

        placeHolder: ""
    },
    shim: {
        soundmanager2: {
            //These script dependencies should be loaded before loading soundmanager2            
            deps: [],
            //Once loaded, use the global 'soundManager' as the module value
            exports: 'soundManager'
        },
        vkApiSource: {
            deps: [],
            exports: 'VK'
        }
    }
};

if (global && global.appVer)
    config.urlArgs = "cacheFix=" + global.appVer;

require.config(config);