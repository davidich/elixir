define(["vkApiSource"], function (vkApi) {
    vkApi.args = getUrlParams();


    function getUrlParams() {
//        var params = {};
//        
//        var url = location.href;
//        url = url.replace(/.*\?(.*?)/, "$1");
//        var pairs = url.split("&");
//        for (var i = 0; i < pairs.length; i++) {
//            var parts = pairs[i].split("=");
//            var argName = parts[0];
//            var argValue = decodeURIComponent(parts[1].replace(/\+/g, " "));
//            params[argName] = argValue;
//        }

//        return params;
    }

    function getUrlParam(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    return vkApi;
});