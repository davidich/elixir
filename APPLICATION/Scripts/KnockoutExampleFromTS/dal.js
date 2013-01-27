define(["pubSub", "ko"], function (pubSub, ko) {

    function post(request, url, data, onComplete, onSuccess) {
        var needToSetPending = !request.hasPendingServerRequest();

        if (needToSetPending) request.hasPendingServerRequest(true);

        if (typeof data == "object")
            data = ko.toJSON(data);
        
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: url,
            data: data,
            contentType: "application/json; charset=utf-8",
            error: function (jqXHR) {
                $.showMessage("Error", "Error " + jqXHR.status + ': ' + jqXHR.statusText);
            },
            success: function (response) {
                if (typeof response == "string")
                    $.showMessage("Error", response);
                else {
                    ko.mapping.fromJS(response, request);
                    if (typeof onSuccess == "function")
                        onSuccess();
                }
            },
            complete: function () {
                if (typeof onComplete == "function")
                    onComplete();

                if (needToSetPending) request.hasPendingServerRequest(false);
            }
        });
    }

    function setStatuses(request, status) {
        var hasSomethingToSave = false;
        $.each(request.details(), function () {
            if (this.isSelected()) {
                hasSomethingToSave = true;
                this.isProcessing(true);
            }
        });

        if (!hasSomethingToSave) {
            $.showMessage("Warning", "You should select details first. For that use checkboxes in the beginning of each row.");
            return;
        }

        var url = global.urls.setStatuses;

        var data = {
            requestId: request.id(),
            status: status,
            notes: request.notes(),
            detailIds: request.selectedDetailIds()
        };


        post(request, url, data, function () {
            request.notes(null);
            $.each(request.details(), function () {
                this.isProcessing(false);
                this.isSelected(false);
            });
        });
    }

    pubSub.sub("requestSubmitted", function (request) {
        var url = global.urls.submitRequest;
        var data = {
            id: request.id(),
            description: request.description()
        };

        post(request, url, data, null, function () {
            $.showMessage("Info", "Your request have been succesfully submitted!");
        });
    });

    pubSub.sub("requestUpdated", function (request) {
        var url = global.urls.updateRequest;
        var data = {
            id: request.id(),
            requestTypeId: request.requestTypeId(),
            businessUnitId: request.businessUnitId(),
            description: request.description(),
            isDefinedByAgreement: request.isDefinedByAgreement(),
            rowVersion: request.rowVersion
        };

        post(request, url, data);
    });

    pubSub.sub("detailsAdded", function (request, empGuids) {
        var url = global.urls.addDetails;
        var data = {
            requestId: request.id(),
            empGuids: empGuids  // will be null when added one details and request.createBy value will be uses
        };

        post(request, url, data);
    });

    pubSub.sub("detailUpdated", function (request, detail) {
        var url = global.urls.updateDetail;
        var data = ko.mapping.toJSON(detail);

        detail.isProcessing(true);
        post(request, url, data, function () { detail.isProcessing(false); });
    });

    pubSub.sub("detailDeleted", function (request, detail) {
        var url = global.urls.deleteDetail;
        var data = {
            requestId: request.id(),
            detailId: detail.id(),
            rowVersion: detail.rowVersion()
        };

        detail.isProcessing(true);
        post(request, url, data, function () { detail.isProcessing(false); });
    });

    pubSub.sub("detailsApproved", function (request) {
        var status = request.mode() == 'qc'
            ? global.status.approvedByQC
            : global.status.approvedByApprover;
        setStatuses(request, status);
    });

    pubSub.sub("detailsRejected", function (request) {
        var status = request.mode() == 'qc'
            ? global.status.rejectedByQC
            : global.status.rejectedByApprover;
        setStatuses(request, status);
    });
})