define(["ko", "pubSub", "spvm/DetailVm", "spc/locationDialog", "spc/jobDialog", "spc/agreementDialog", "spc/employeeDialog", "spc/historyDialog"], function (ko, pubSub, DetailVm, locationDialog, jobDialog, agreementDialog, employeeDialog, historyDialog) {
    function viewModel() {
        var self = this;

        var _mapping = {
            ignore: ["isDefinedByAgreement"],
            details: {
                key: function (data) {
                    return ko.utils.unwrapObservable(data.id);
                },
                create: function (options) {
                    return new DetailVm(options.data, options.parent);
                }
            }
        };

        ko.mapping.fromJS(
            global.request,
            _mapping,
            self);

        self.detailTypes = ko.observableArray(global.detailTypes);
        self.requestTypes = ko.observableArray(global.requestTypes);
        self.businessUnits = ko.observableArray(global.businessUnits);

        self.agreementAnswer = ko.observable(global.request.isDefinedByAgreement ? "Yes" : "No");
        self.isDefinedByAgreement = ko.computed({
            read: function () { return self.agreementAnswer() == "Yes"; },
            write: function (value) { self.agreementAnswer(value ? "Yes" : "No"); },
            owner: self
        });

        self.notes = ko.observable();

        self.allSelectorState = function () {
            var hasChecked = false, hasUnchecked = false;
            $.each(self.details(), function () {
                if (this.isSelected()) hasChecked = true;
                if (!this.isSelected()) hasUnchecked = true;
            });
            if (hasChecked && !hasUnchecked) return true;
            if (!hasChecked && hasUnchecked) return false;
            return undefined;
        };
        self.allSelectorClass = ko.computed(function () {
            if (self.allSelectorState() === true) return 'checked';
            if (self.allSelectorState() === false) return 'unchecked';
            return 'intermediate';
        });

        self.selectedDetailIds = ko.computed(function () {
            var selection = [];
            $.each(self.details(), function () {
                if (this.isSelected()) selection.push(this.id());
            });
            return selection;
        });

        //behavior
        self.onAllSelectorClick = function () {
            var selectState = !self.allSelectorState();
            $.each(self.details(), function () { this.isSelected(selectState); });
        };
        self.onBulletClick = function (detail) {
            historyDialog.open(detail.id());
        };
        self.addDetailClick = function () {
            if (!self.isEditableOnSubmit()) return;
            pubSub.pub("detailsAdded", self);
        };
        self.addEmployeeClick = function () {
            if (!self.isEditableOnSubmit()) return;

            employeeDialog.open();
            employeeDialog.onClose(function (selectedEmployeeGuids) {
                if (selectedEmployeeGuids.length > 0)
                    pubSub.pub("detailsAdded", self, selectedEmployeeGuids);
            });
        };
        self.onJobClick = function (detail) {
            if (!self.isEditableOnSubmit()) return;
            jobDialog.onClose(detail.updateJob);
            jobDialog.open();
        };
        self.onLocationClick = function (detail) {
            if (!self.isEditableOnSubmit()) return;
            locationDialog.onClose(detail.updateLocation);
            locationDialog.open();
        };
        self.onStartClick = function (detail, event) {
            if (!self.isEditableOnSubmit()) return;
            onDateTimeClicked(event, detail.start, null, detail.end());
        };
        self.onEndClick = function (detail, event) {
            if (!self.isEditableOnSubmit()) return;
            onDateTimeClicked(event, detail.end, detail.start(), null);
        };
        self.onAggrementClick = function (detail, event) {
            if (!self.isEditableOnSubmit()) return;
            agreementDialog.open(detail);
        };
        self.onDeleteClick = function (detail, event) {
            if (!self.isEditableOnSubmit()) return;
            pubSub.pub("detailDeleted", self, detail);
        };

        self.submitClick = function () {
            if (!self.isEditableOnSubmit()) return;
            if (validateOnSubmit(self)) pubSub.pub("requestSubmitted", self);
        };

        self.approveClick = function () {
            if (self.mode() == 'qc')
                validateAndQcApprove(self);
            else
                pubSub.pub("detailsApproved", self);
        };
        self.rejectClick = function () {
            pubSub.pub("detailsRejected", self);
        };

        // persistance
        var persistedProps = [
            self.agreementAnswer,
            self.businessUnitId,
            self.description
        ];

        for (var i = 0; i < persistedProps.length; i++) {
            persistedProps[i].subscribe(function () {
                pubSub.pub("requestUpdated", self);
            });
        }

        // mode dependent props
        self.mode = ko.observable(global.mode);
        self.viewMode = ko.observable(global.mode == 'submit' ? "compact" : "full");
        self.hasPendingServerRequest = ko.observable(false);

        self.isEditableOnSubmit = ko.computed(function () {
            if (self.mode() != 'submit') return false;
            if (self.hasPendingServerRequest()) return false;
            return true;
        });

        self.isRowSelectorVisible = ko.computed(function () {
            return self.mode() != 'submit';
        });

        self.isAgreementVisible = ko.computed(function () {
            return self.isDefinedByAgreement() && self.mode() == 'submit';
        });
        self.isTaxableVisible = ko.computed(function () {
            return self.mode() == 'qc';
        });

        self.extInfoCaptionColSpan = ko.computed(function () {
            return self.isRowSelectorVisible() ? 2 : 1;
        });
        self.extInfoValueColSpan = ko.computed(function () {
            var minAmount = 8;
            if (self.isAgreementVisible()) minAmount++;
            if (self.isTaxableVisible()) minAmount++;
            return minAmount;
        });
    };

    function onDateTimeClicked(event, prop, min, max) {
        if (event.target.tagName == "INPUT")
            return;

        var $elem = $(event.delegateTarget),
            value = prop(),
            $input = $("<input type='text' style='width: 118px;font-size: 10px; font-family: verdana; border: none;background-color: white;' readonly='readonly'/>");

        $input.val(value);
        $elem.html($input);
        $input.datetimepicker({
            showTime: false,
            showWeek: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            changeMonth: true,
            changeYear: true,
            dateFormat: "mm/dd/y",
            timeFormat: "hh:mm TT",
            ampm: true,
            controlType: 'select',
            minDateTime: min ? new Date(min) : null,
            maxDateTime: max ? new Date(max) : null,
            stepMinute: 15,
            onSelect: function (datetimeText) {
                value = datetimeText;
            },
            onClose: function () {
                $input.datepicker("destroy");
                $input.remove();
                prop(value);
                $elem.html(value);
            }
        });

        $input.datetimepicker("show");
    }

    function clearValidationDescriptions(request) {
        $.each(request.details(), function () {
            this.validationDescription("");
        });
    }
    function validateOnSubmit(request) {

        clearValidationDescriptions(request);

        var hasValidationErrors = false;
        $.each(request.details(), function () {
            //Check if agreement is attached
            if (request.isDefinedByAgreement() && !this.agreement.fileName()) {
                this.validationDescription(this.validationDescription() + "attach agreement; ");
                hasValidationErrors = true;
            }

            //Check if detail has job value
            if (!this.job.jobGuid()) {
                this.validationDescription(this.validationDescription() + "select job; ");
                hasValidationErrors = true;
            }

            //Check if detail has location value
            if (!this.location.id()) {
                this.validationDescription(this.validationDescription() + "select location; ");
                hasValidationErrors = true;
            }

            //Check if detail has start value
            if (!this.start()) {
                this.validationDescription(this.validationDescription() + "set start value; ");
                hasValidationErrors = true;
            }

            //Check if detail has end value
            if (!this.end()) {
                this.validationDescription(this.validationDescription() + "set end value; ");
                hasValidationErrors = true;
            }
        });

        if (hasValidationErrors) {
            $.showMessage(
                "Warning",
                "Your request didn't pass validation succesfully. The problematic rows are highlighted with a red background and have a validation description underneath. Solve the issues and try again.",
                false);
            return false;
        }


        return !hasValidationErrors;
    }

    function validateAndQcApprove(request) {
        var detailIds = request.selectedDetailIds();
        if (detailIds.length == 0)
            pubSub.pub("detailsApproved", request); // dal will show generic warning about empty selection
        else {
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: global.urls.qcValidate,
                data: ko.toJSON(detailIds),
                contentType: "application/json; charset=utf-8",
                error: function (jqXHR) {
                    $.showMessage("Error", "Error " + jqXHR.status + ': ' + jqXHR.statusText);
                },
                success: function (validationResult) {
                    clearValidationDescriptions(request);

                    $.each(validationResult, function () {
                        var index = request.details.mappedIndexOf({ id: this.detailId });
                        request.details()[index].validationDescription(this.description);
                    });

                    if (validationResult.length == 0)
                        pubSub.pub("detailsApproved", request);
                    else
                        $.showMessage(
                            "Warning",
                            "Some warning are detected. The problematic rows are highlighted with a red background and have a validation description underneath. Do you really want to proceed?",
                            {
                                No: function () {
                                    $(this).dialog("close");
                                },
                                Yes: function () {
                                    pubSub.pub("detailsApproved", request);
                                    $(this).dialog("close");
                                }
                            },
                            false);
                }
            });
        }
    }

    return viewModel;
})
