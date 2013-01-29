define(['soundmanager2', 'jquery'], function(soundManager, $) {
    // The following may help Flash see the global.
    window.soundManager = soundManager;
    
    // set manager params
    soundManager.setup({
        preferFlash: true,        
        url: ' http://davidich.la.net.ua/elexir/APPLICATION/Scripts/Libs/soundmanager/swfs/',
        allowScriptAccess: 'sameDomain',
        debugMode: true,
        debugFlash : true,
        //flashVersion: 9, // optional: shiny features (default = 8)
        //useFlashBlock: false, // optionally, enable when you're ready to dive in
        onready: function () {
            //$("#loader").hide();
            //$("#playerControls").show();            
            
            var mySound = soundManager.createSound({
                id: 'aSound',
                url: 'http://cs2-2.userapi.com/d2/e2a0d22b370d68.mp3'
            });
            
            //mySound.play();
                
        }
    });
    
    return soundManager;
});