define(['soundmanager2', 'jquery'], function(soundManager, $) {
    // The following may help Flash see the global.
    window.soundManager = soundManager;
    
    // set manager params
    soundManager.setup({
        url: 'Scripts/Libs/soundmanager/swfs/',
        flashVersion: 9, // optional: shiny features (default = 8)
        useFlashBlock: false, // optionally, enable when you're ready to dive in
        onready: function () {
            $("#loader").hide();
            $("#playerControls").show();            
        }
    });
    
    return soundManager;
});