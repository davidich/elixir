define(["ko"], function (ko) {

    function Route(sRoute) {
        var self = this,
            parsed = {};

        self.isAbsolute = function() {
            return sRoute.substring(0, 1) == "/";
        };

        self.vm = function () {
            return (typeof parsed.vm == "undefined")
                ? parsed.vm = getPart(sRoute)
                : parsed.vm;
        };

        self.subVm = function () {
            return (typeof parsed.subVm == "undefined")
                ? parsed.subVm = getPart(self.subRoute())
                : parsed.subVm;
        };

        self.subRoute = function () {
            return (typeof parsed.subRoute == "undefined")
                ? parsed.subRoute = getPart(sRoute, true)
                : parsed.subRoute;
        };

        function getPart(str, isTrailingNeeded) {
            if (!str) return null;
            
            var index = str.indexOf("/");
            
            return !isTrailingNeeded 
                ? index == -1 ? str : str.substring(0, index)   // first part
                : index == -1 ? null : str.substring(index +1); // second part            
        }
    }

    function BaseVm(name) {
        var self = this;

        // Data
        self.name = name;
        self.vms = [];

        self.isVisible = ko.observable();
        self.visibleSubVm = ko.observable();

        // behavior
        self.addVm = function (vm) {
            self = this;
            self[vm.name] = vm;
            self.vms.push(vm);
        };

        self.navigate = function(sRoute) {
            var route = new Route(sRoute);

            if (route.isAbsolute()) {
                require("Vms/root").navigate(route.subRoute());
                return;
            }

            // if navigate is invoked and route is not absolute then show VM
            self.isVisible(true);

            // activate sub vm firts
            if (route.subVm())
                self[route.vm()].navigate(route.subRoute());

            // update vms visibility
            $.each(self.vms, function (index, vm) {
                if (route.vm() != vm.name)
                    vm.hide();
                else {
                    vm.show();
                    self.visibleSubVm(vm);
                }
                vm.isVisible(route.vm() == vm.name);
            });
        };

        self.hide = function () {
            $.each(self.vms, function() { this.hide(); });
            self.isVisible(false);
        };
        
        self.show = function () {
            self.isVisible(true);
        };
    };

    return BaseVm;
})