﻿define(["jquery", "domReady", "ko", "pubSub", "Vms/mainVM", "Vms/musicVM", "Vms/playerVM"], function ($, domReady, ko, pubSub, MainVM, MusicVM, PlayerVM) {
    domReady(function () {
        //alert("UserID: " + vk.args["user_id"]);        

        var mainVM = new MainVM("main");
        var $mainBlock = $("#mainContent");
        ko.applyBindings(mainVM, $mainBlock.get(0));
        
        var musicVM = new MusicVM("music");
        var $musicBlock = $("#musicContent");
        ko.applyBindings(musicVM, $musicBlock.get(0));
        
        var playerVM = new PlayerVM();
        var $playerBlock = $("#playerContent");
        ko.applyBindings(playerVM, $playerBlock.get(0));
        
        // set main as active view
        pubSub.pub("viewChanged", "main");

        //REMOVE AFTER DEBUG
        window.mainVM = window.parent.mainVM = mainVM;
        window.musicVM = window.parent.musicVM = musicVM;
        window.playerVM = window.parent.playerVM = playerVM;        
    });
    
    $("#playPause").click(function () {
        var buttonText = $(this).text();
        if (buttonText == ">")
            play();
        else
            pause();
    });

    $("#stop").click(stop);

    $("#muteUnmute").click(function () {
        var button = $(this);

        if (!sm2.muted)
            sm2.mute();
        else
            sm2.unmute();

        button.text(button.text() == "mute" ? "unmute" : "mute");
        sm2.toggleMute("curSound");
    });

    $("#songs button").click(function () { playSong(this); });

    function play() {
        var soundUrl = $("#soundUrl").val();
        if (!sm2.canPlayURL(soundUrl)) {
            alert("bad url");
            return;
        }

        $("#playPause").text("||");

        var curSong = sm2.getSoundById("curSong");
        if (curSong && curSong.url == soundUrl)
            curSong.resume();
        else {
            sm2.destroySound("curSong");

            var curSoung = sm2.createSound({
                id: 'curSong',
                url: soundUrl
            });

            curSoung.play();
        }
    }

    function pause() {
        $("#playPause").text(">");
        sm2.pauseAll();
    }

    function playSong(songButton) {
        var $button = $(songButton);
        $("#soundUrl").val($button.data("url"));
        play();
    }

    function stop() {
        $("#soundUrl").val("");
        $("#playPause").text(">");
        sm2.destroySound("curSong");
    }
})