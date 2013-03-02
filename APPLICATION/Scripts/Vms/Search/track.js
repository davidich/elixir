define(["ko", "Vms/base"], function (ko, BaseVm) {

    function TrackVm() {
        var self = this,
            i;

        $.extend(self, new BaseVm("track"));

        
    }

    return new TrackVm();
})