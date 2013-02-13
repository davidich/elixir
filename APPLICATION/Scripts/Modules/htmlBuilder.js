define([], function () {
    var builder = {
        build: function (onComplete) {
            var $allStubs = $(".stub");
            var stubToReplace = $allStubs.length;

            $allStubs.each(function () {

                var $domStub = $(this);
                $domStub.removeClass("stub");
                var sourceName = "Html/" + $domStub.attr("class") + ".html";

                $.get(sourceName, function (html) {
                    $domStub.replaceWith(html);
                    if (--stubToReplace == 0) onComplete();                   
                });
            });            
        }
    };

    return builder;
});