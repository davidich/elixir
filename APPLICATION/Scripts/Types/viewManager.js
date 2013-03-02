define(["pubSub", "Vms/search"], function(pubSub, SearchVm) {

    function ViewManger() {
        var self = this;
            

        var subVms = {
            search: new SearchVm()
        };

        var key, vm, container;
        for (key in vms) {
            vm = vms[key];
            container = getElementById(vm.containerId);
            ko.applyBindings(vm, container);
        }

        self.addVm = function(newVm) {
            vms[newVm.name] = newVm;
        };
        
        self.activate = function (route) {
            var subRouteIndex = route.indexOf("."),
                vmName = subRouteIndex == -1 ? route : route.substring(0, subRouteIndex),
                subRoute = subRouteIndex == -1 ? null : route.substring(subRouteIndex);
            
            var activeView = vms[vmName];
            if (subRoute) activeView.activate(subRoute);
            
            
            if (parts.length > 1) {
                activeView.activateSubView(parts[1]);
            }
        };        
    }

    return ViewManger;
})