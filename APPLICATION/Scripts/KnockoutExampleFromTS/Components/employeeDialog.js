define(["pubSub", "spc/tableBuilder"], function (pubSub, tableBuilder) {
    var inited,
        _callback,
        _empSearchKey = $("#empSearchKey"),
        _empDivisionKey = $("#employeeDivisions"),
        _table = $('#employeeTable'),
        _dialog = $("#employeeDialog");

    var selectedEmpGuids = [];

    function init() {
        inited = true;

        _dialog.dialog({
            autoOpen: false,
            modal: true,
            height: 570,
            width: 600,
            resizable: false,
            buttons: {
                "Cancel": function () { close(false); },
                "Ok": function () { close(true); }
            }
        });

        tableBuilder.employeeTable(_table);

        pubSub.sub("employeeTableRedrawn", syncEmployeeSelection);

        _table.on("change", "input.empSelector", function () {
            var tr = $(this).closest("tr")[0];
            var empGuid = _table.fnGetData(tr).empGuid;

            if ($(this).prop("checked"))
                selectedEmpGuids.push(empGuid);
            else
                removeFromArray(selectedEmpGuids, empGuid);
        });

        _empSearchKey.keyup(function () {
            _table.fnFilter(this.value);        // global search
        });
        _empDivisionKey.change(function () {
            _table.fnFilter(this.value, 0);     // column specific search (0 value is virtual and handled properly on a server)
        });
    }

    function syncEmployeeSelection() {
        $("tbody tr", _table).each(function () {
            var empGuid = _table.fnGetData(this).empGuid;
            var isSelected = $.inArray(empGuid, selectedEmpGuids) > -1;
            $(this).find(".empSelector").prop("checked", isSelected);            
        });
    }

    function removeFromArray(arr /*, values to remove */) {
        var what, a = arguments, l = a.length, ax;
        while (l > 1 && arr.length) {
            what = a[--l];
            while ((ax = $.inArray(what, arr)) != -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }


    function close(applyChanges) {
        if (applyChanges) triggerJobChanged();
        _dialog.dialog("close");
    }

    //EVENTS TRIGGERS
    function triggerJobChanged() {
        if (_callback) _callback(selectedEmpGuids);
    }

    //PUBLIC METHODS
    return {
        open: function () {
            if (!inited)
                init();

            if (inited) {
                _table.clearSelection();
                selectedEmpGuids = [];
                syncEmployeeSelection();
                _dialog.dialog('open');
            }
        },
        onClose: function (callback/*fnc(job){}*/) {
            _callback = callback;
        }
    };
})