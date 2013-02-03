define([], function() {
    function FancyDropItem(value, text, iconClass) {
        var self = this;

        self.value = value;
        self.text = text;
        self.iconClass = iconClass;
    }

    return FancyDropItem;
})