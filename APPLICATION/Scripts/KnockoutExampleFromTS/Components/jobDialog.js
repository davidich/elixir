define(["pubSub", "spc/tableBuilder"], function (pubSub, tableBuilder) {
    var inited,
        _callback,
        _selectedJob,
        tabs,
        myJobsTable,
        allJobsTable,
        dialog;

    function init() {

        inited = true;

        tabs = $("#jobTabs");
        myJobsTable = $('#myJobsGrid');
        allJobsTable = $('#allJobsGrid');

        tabs.tabs();
        tableBuilder.myJobsTable(myJobsTable);
        tableBuilder.allJobsTable(allJobsTable);

        pubSub.sub("jobSelected", function (job) { _selectedJob = job; });
        pubSub.sub("closeJobDialog", close);

        dialog = $("#jobDialog").dialog({
            autoOpen: false,
            modal: true,
            height: 605,
            width: 600,
            resizable: false,
            buttons: {
                "Cancel": function () { close(false); },
                "Ok": function () { close(true); }
            }
        });
    }

    function close(applyChanges) {
        if (applyChanges) triggerJobChanged();
        dialog.dialog("close");
    }

    //EVENTS TRIGGERS
    function triggerJobChanged() {
        if (_callback) _callback(_selectedJob);       
    }

    //PUBLIC METHODS
    return {
        open: function () {
            if (!inited)
                init();

            if (inited) {                
                _selectedJob = undefined;
                myJobsTable.clearSelection();
                allJobsTable.clearSelection();
                dialog.dialog('open');
            }
        },
        onClose: function (callback/*fnc(job){}*/) {
            _callback = callback;
        }        
    };
})