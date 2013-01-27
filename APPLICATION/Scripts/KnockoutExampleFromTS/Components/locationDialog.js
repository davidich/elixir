define(["pubSub", "spc/tableBuilder", "spc/zipResolver", "dataTable"], function (pubSub, tableBuider, zipResolver) {
    var inited,
        _callback,
        selectionPreview = $("#selectionPreview"),
        tabs,
        usTab,
        foreignTab,
        dialog;

    var selection = {
        isValid: false,
        errorDesc: '',
        id: '',
        desc: '',
        reset: function () {
            selection.isValid = false;
            selection.id = '';
            selection.desc = '';

            usTab.table.clearSelection();
            usTab.table.fnFilter(''); //clear us global filter
            usTab.table.fnFilter('', 1); //clear us state filter

            //        foreignLocationGrid.clearSelection();
            //        foreignLocationGrid.fnFilter('');       //clear foreign global filter
            //        foreignLocationGrid.fnFilter('', 1);    //clear foreign country filter

            //        selectionPreview.text("");
            $("#locationDialog select, #locationDialog input:not(:submit)").val("");
        },
        update: function () {
            selection.isValid = false;
            selection.errorDesc = "You have to make selection.";
            selection.id = '';
            selection.desc = '';

            var rowData;
            //Us Locations
            if (tabs.tabs('option', 'selected') == 0) {
                rowData = usTab.table.getSelectedRowData();

                if (rowData != null) {
                    selection.id = rowData[0];
                    selection.desc = rowData[2] + ', ' + rowData[1];
                    selection.isValid = true;
                } else if (usTab.cantFindBlock.textbox.val().length > 0) {
                    selection.id = 1;
                    selection.desc = usTab.cantFindBlock.textbox.val();
                    selection.isValid = true;
                }
            }
            //Foreign Locations
            else {
                var cityName = foreignTab.additionalInfo.val();
                rowData = foreignTab.table.getSelectedRowData();

                if (rowData == null)
                    foreignTab.otherCityBlock.hide();
                else {
                    selection.id = rowData[0];
                    var country = rowData[1];
                    var location = rowData[2];
                    var cityRequired = location == '[Other]' || location == 'Other';
                    selection.desc = country + ', ' + (cityRequired ? cityName : location);

                    if (cityRequired)
                        foreignTab.otherCityBlock.show();
                    else
                        foreignTab.otherCityBlock.hide();

                    if (cityRequired && cityName.length == 0)
                        selection.errorDesc = "You have to type city name.";

                    if (!cityRequired || cityName.length > 0)
                        selection.isValid = true;
                }
            }

            selectionPreview.text(selection.desc).css('color', 'black');
        }
    };

    function canBeInited() {
        var error;
        if ($("#usLocationGrid tbody tr:first td").length == 1)
            error = "There is no a single US location in DB";
        else if ($("#foreignLocationGrid tbody tr:first td").length == 1)
            error = "There is no a single Foreign location in DB";

        if (!error)
            return true;

        pubSub.pub("ui/showMessage", "Warning", error);
        return false;
    }

    function init() {
        inited = false;
        if (!canBeInited()) return;
        inited = true;

        tabs = createTabControl();
        usTab = createUsaTab();
        foreignTab = createForeignTab();
        dialog = createDialog();

        pubSub.sub("locDialog/close", close);
    }

    function createTabControl() {
        return $("#locationTabs").tabs({
            select: function () {
                selection.reset();
                selection.update();
            }
        });
    }

    function createUsaTab() {
        var tab = {
            stateFilter: $("#stateInputFilter"),
            cityFilter: $("#cityCountyFilter"),
            table: tableBuider.usLocations($("#usLocationGrid")),
            cantFindBlock: new function () {
                var inst = this;
                inst.container = $("#cantFindUsLocationInputBlock");
                inst.button = $("#cantFindUsLocationButton").button().click(function () {
                    inst.textbox.val("");
                    inst.button.hide();
                    inst.container.show();
                });
                inst.textbox = $("#customUsLocation").keyup(function () {
                    tab.table.clearSelection();
                    selection.update();
                });
                inst.disable = function () {
                    inst.button.show();
                    inst.container.hide();
                };
            }
        };

        // Table
        tab.table.fnAddTooltips();
        tab.stateFilter.change(function () { tab.table.fnFilter(this.value, 1); });
        tab.cityFilter.keyup(function () { tab.table.fnFilter(this.value); });
        pubSub.sub("usRowClicked", function () {
            tab.cantFindBlock.disable();
            selection.update();
        });

        // Zip Resolver
        zipResolver.init();
        pubSub.sub("zipResolveStarted", function () {
            tab.stateFilter.attr('disabled', 'disabled');
            tab.cityFilter.attr('disabled', 'disabled');
        });
        pubSub.sub("zipResolveFinished", function (state, location) {
            tab.stateFilter.removeAttr('disabled').val(state).change();
            tab.cityFilter.removeAttr('disabled').val(location).keyup();
        });

        return tab;
    }

    function createForeignTab() {
        var tab = {
            countryFilter: $("#countryInputFilter"),
            locationFilter: $("#locationFilter"),
            otherCityBlock: $("#otherCityBlock"),
            table: tableBuider.foreignLocations($("#foreignLocationGrid")),
            additionalInfo: $("#additionalInfo")
        };

        // Table
        //tab.table
        tab.countryFilter.change(function () { tab.table.fnFilter(this.value, 1); });
        tab.locationFilter.keyup(function () { tab.table.fnFilter(this.value); });
        pubSub.sub("foreignRowClicked", function () {
            tab.additionalInfo.val("");
            selection.update();
        });

        tab.additionalInfo.keyup(function () {
            if ($(this).val().length > 0) usTab.table.clearSelection();
            selection.update();
        });

        return tab;
    }

    function createDialog() {
        return $("#locationDialog").dialog({
            autoOpen: false,
            modal: true,
            resizable: false,
            height: 712,
            width: 600,
            buttons: {
                "Cancel": function () { close(false); },
                "Ok": function () { close(true); }
            }
        });
    }

    function close(applyChanges) {
        if (applyChanges) {
            if (!selection.isValid) {
                selectionPreview.text(selection.errorDesc).css('color', 'red');
                return;
            }

            triggerLocactionChanged();
        }

        dialog.dialog("close");
        selection.reset();
    }

    // EVENT TRIGGERS
    function triggerLocactionChanged() {
        if (_callback)
            _callback({
                id: selection.id,
                description: selection.desc
            });        
    }

    // PUBLIC INTERFACE
    return {
        open: function () {
            if (!inited)
                init();

            if (inited) {
               
                tabs.tabs("select", 0);
                selection.update();
                dialog.dialog('open');
            }
        },
        onClose: function (callback/*fnc(location){}*/) {
            _callback = callback;
        }
    };

})