define(["ko", "Vms/base"], function (ko, BaseVm) {

    function PeopleVm() {
        var self = this;

        $.extend(self, new BaseVm("people"));
        //self.addVm(new ...);        
    }

    return PeopleVm;
})