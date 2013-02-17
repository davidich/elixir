define(["knockout"], function (ko) {

    ko.bindingHandlers['toggleButton'] = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var $element = $(element);
            var value = valueAccessor();
            
            $(element)
                .click(function() {
                    value(!value());
                })
                .data("activeCssClass", allBindingsAccessor().activeCss || "active")
                .data("inactiveCssClass", allBindingsAccessor().inactiveCss || "inactive");
            
            setState($element, value());
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var $element = $(element);
            var value = valueAccessor();
            var toggleCallback = allBindingsAccessor().onToggle;
            setState($element, value());

            if (typeof toggleCallback == "function")
                toggleCallback();
        }
    };
    
    function setState($elem, state) {
        if (state)
            $elem.addClass($elem.data("activeCssClass")).removeClass($elem.data("inactiveCssClass"));
        else
            $elem.addClass($elem.data("inactiveCssClass")).removeClass($elem.data("activeCssClass"));       
    }
})