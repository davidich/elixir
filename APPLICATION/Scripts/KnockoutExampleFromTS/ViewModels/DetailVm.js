define(["ko", "pubSub"], function (ko, pubSub) {

    function update(data, target) {
        ko.mapping.fromJS(
            data,
            { /*ignore: ["validationErrorDescription"] */},
            target);
    }

    return function (dto, request) {
        var self = this;

        update(dto, self);

        //behavior
        self.isSelected = ko.observable(false);
        self.isProcessing = ko.observable(false);
        self.validationDescription = ko.observable();
        
        //methods
        self.update = function (data) { update(data, self); };
        self.updateJob = function (data) { update(data, self.job); };
        self.updateLocation = function (data) { update(data, self.location); };
        self.updateAgreement = function (data) { update(data, self.agreement); };

        // persistance
        var persistedProps = [
            self.job.jobGuid,
            self.location.description,  //!!!don't use 'id' as description won't be updated properly
            self.start,
            self.end,
            self.detailTypeId,
            self.isTaxable
        ];

        for (var i = 0; i < persistedProps.length; i++) {
            persistedProps[i].subscribe(function () {
                pubSub.pub("detailUpdated", request, self);
            });
        }
    };
})