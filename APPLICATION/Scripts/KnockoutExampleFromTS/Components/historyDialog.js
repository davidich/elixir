define(["pubSub", "spc/tableBuilder"], function (pubSub, tableBuilder) {
    var _detailId,
        _table,
        _dialog;


    function init() {
        _dialog = $("#historyDialog");
        _table = $("#historyGrid");

        tableBuilder.history(_table, fnServerParams);

        _dialog.dialog({
            autoOpen: false,
            resizable: false,
            modal: true,
            height: 600,
            width: 800,
            buttons: {
                "OK": function () { $(this).dialog("close"); }
            }
        });
    }

    function fnServerParams(aoData) {
        aoData.push({
            name: "detailId",
            value: _detailId
        });
    }
    
    return {
        open: function (detailId) {
            _detailId = detailId;

            if (!_dialog)
                init();
            else
                _table.fnReloadAjax(null, "history is loading");

            _dialog.dialog("open");
        }
    };
})