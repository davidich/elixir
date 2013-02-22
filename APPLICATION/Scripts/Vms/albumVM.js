define(["ko", "Vms/viewBase", "pubSub"], function (ko, viewBase, pubSub) {

    function AlbumVM(viewName) {
        var self = this;

        self.setName(viewName);

        // Properties
        // nothing yet


        // Behavior

        self.afterVisibleApplied = function (isVisible) {
            if (isVisible) {
                $('.sliderBlock').carouFredSel({
                    circular: false,
                    width: 559,
                    height: 150,
                    infinite: false,
                    auto: false,
                    prev: '.slide_prev',
                    next: '.slider_next',
                    align: "left",
                    scroll: {
                        items: 2,
                        visible: 5
                    }
                });
            }
        };

        $('.albumCover').hover(function () {
            $(this).find('.albumLikeArea').fadeIn(300);
            $(this).find('.albumCoverHover').fadeIn(300);
        }, function () {
            $(this).find('.albumLikeArea').fadeOut(300);
            $(this).find('.albumCoverHover').fadeOut(300);
        });
    };

    AlbumVM.prototype = new viewBase();

    return AlbumVM;
})