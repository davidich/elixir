define(["jquery", "ko", "pubSub", "Vms/mainVM", "Vms/musicVM", "Vms/playerVM", "Vms/albumVM"], function ($, ko, pubSub, MainVM, MusicVM, PlayerVM, AlbumVM) {
    //alert("UserID: " + vk.args["user_id"]);        

    var mainVM = new MainVM("main");
    var $mainBlock = $("#mainContent");
    ko.applyBindings(mainVM, $mainBlock.get(0));

    var musicVM = new MusicVM("music");
    var $musicBlock = $("#musicContent");
    ko.applyBindings(musicVM, $musicBlock.get(0));
    musicVM.search(true);   //do initial search with empty params

    var playerVM = new PlayerVM("player");
    var $playerBlock = $("#playerContent");
    ko.applyBindings(playerVM, $playerBlock.get(0));
    global.player = playerVM;    
    
    var albumVM = new AlbumVM("album");
    var $albumBlock = $("#albumContent");
    ko.applyBindings(albumVM, $albumBlock.get(0));


    //pubSub.pub("viewChanged", "main");
    pubSub.pub("viewChanged", "album");
})