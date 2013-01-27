define(["pubSub"], function (pubSub) {
    var button,
        textbox,
        form;

    function init() {
        button = $("#findZipCodeButton");
        button.hide(); //will be shown once something is typed in textBox

        textbox = $("#zipFilter");
        textbox.keyup(showHideButton);

        form = $("#ZipCodeResolveForm");
        form.submit(submit);
    }

    function showHideButton() {
        if ($(this).val().length > 0)
            button.fadeIn();
        else
            button.fadeOut();
    }

    function submit(event) {
        event.preventDefault(); //prevent submition

        $("#zipResolveAnimation").show();
        pubSub.pub("zipResolveStarted");

        $.post(this.action, $(this).serialize(), function(response) {
            textbox.val('').keyup();

            var state = response[0] || '';
            var location = response[1] || '';

            $("#zipResolveAnimation").hide();
            pubSub.pub("zipResolveFinished", state, location);            
        });
    }

    return {
        init: init
    };
})