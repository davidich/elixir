define(["jquery", "ko", "pubSub", "Vms/mainVM", "Vms/musicVM", "Vms/playerVM", "Vms/albumVM", "slider"], function ($, ko, pubSub, MainVM, MusicVM, PlayerVM, AlbumVM) {
    //alert("UserID: " + vk.args["user_id"]);        

    var mainVM = new MainVM("main");
    var $mainBlock = $("#mainContent");
    ko.applyBindings(mainVM, $mainBlock.get(0));

    var musicVM = new MusicVM("music");
    var $musicBlock = $("#musicContent");
    ko.applyBindings(musicVM, $musicBlock.get(0));
    //musicVM.search(true);   //do initial search with empty params

    var playerVM = new PlayerVM("player");
    var $playerBlock = $("#playerContent");
    ko.applyBindings(playerVM, $playerBlock.get(0));
    global.player = playerVM;    
    
    //var albumVM = new AlbumVM("album");
    //var $albumBlock = $("#albumContent");
    //ko.applyBindings(albumVM, $albumBlock.get(0));


    //pubSub.pub("viewChanged", "main");
    pubSub.pub("viewChanged", "music");
    //pubSub.pub("viewChanged", "album");


    //var itemsPerPage = 15;

    //var roll = $('#container').rollbar({
    //    minThumbSize: '25%',
    //    pathPadding: '3px',
    //    zIndex: 100,
    //    headerHeight: 75,
    //    footerHeight: 50,
    //    itemHeight: 50,
    //    itemsPerPage: itemsPerPage,

    //    onPageChanged: function (pageNmb) {
    //        $("#pageNmb").text(pageNmb);
    //    },
    //    onAjaxLoad: function (nextPageNmb) {
    //        $("#requestedPageNmb").text($("#requestedPageNmb").text() + nextPageNmb + ",");
    //    }
    //});

    //var $results = $("#results");
    //var itemNmb = 0;
    //$("button").click(function () {
    //    itemNmb++;
    //    var page = parseInt((itemNmb - 1) / itemsPerPage) + 1;
    //    $("<div/>")
    //        .text("Page: " + page + "; item #" + itemNmb)
    //        .addClass("block").css("background-color", rndColor()).appendTo($results);
    //    roll.update();
    //});

    //function rndColor() {
    //    var color = "#";
    //    color += Math.floor(Math.random() * 100);
    //    color += Math.floor(Math.random() * 100);
    //    color += Math.floor(Math.random() * 100);

    //    return color;
    //}
})