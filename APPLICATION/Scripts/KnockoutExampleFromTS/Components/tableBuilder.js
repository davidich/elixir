define(['pubSub', 'sp/urls', 'dataTable'], function (pubSub, urls) {
    var jobTableSettins = {
        bJQueryUI: true,
        bAutoWidth: false,
        sDom: 'frtsCpi',
        bPaginate: true,
        bProcessing: true,
        iDisplayLength: 20,
        bLengthChange: false,
        aaSorting: [[4, 'asc']],
        aoColumns: [
            { mDataProp: "jobGuid", bVisible: false },
            { mDataProp: "coNo", bVisible: false },
            { mDataProp: "dvNo", bVisible: false },
            { mDataProp: "jobNo", bVisible: false },
            { mDataProp: function (source) { return source.coNo + '-' + source.dvNo + '-' + source.jobNo; }, bVisible: true, sWidth: 120 },
            { mDataProp: "jobName", bVisible: true, bSortable: true }
        ],
        fnRowClick: function (data) {
            pubSub.pub("jobSelected", data);
        },
        fnRowDbClick: function (data) {
            pubSub.pub("jobSelected", data);
            pubSub.pub("closeJobDialog", true);
        },
        bServerSide: true,
        fnServerData: function (sSource, aoData, fnCallback) {
            $.ajax({
                dataType: 'json',
                type: "POST",
                url: sSource,
                data: aoData,
                success: fnCallback
            });
        }
    };

    function formatAttacherColumn(source) {
        var deleteButton = $("<span>"),
            attacher = $("<span>"),
            contentHolder = $("<span>");

        attacher.text(source.AttachedBy);
        contentHolder.append(attacher);

        if (source.IsEditable) {
            deleteButton.addClass("bullet deleteIcon deleteAtt").css({ "vertical-align": "middle;", "display": "inline-block", "float": "right", "margin-right": "5px" });
            contentHolder.append(deleteButton);
        }

        return contentHolder.html();
    }

    function formatFileNameColumn(source) {
        var link = $("<a>").attr("href", urls.downloadAttachment + '?id=' + source.Id).text(source.FileName);
        return $("<div>").append(link).html();
    }

    return {
        employeeTable: function (table) {
            table.dataTable({
                bServerSide: true,
                sAjaxSource: urls.loadEmployeeList,
                aoColumns: [
                    { mDataProp: "empGuid", bVisible: false },
                    { mDataProp: function () { return "<input type='checkbox' class='empSelector' />"; }, bVisible: true, bSortable: false, sWidth: 20 },
                    { mDataProp: "empNo", bVisible: true, sWidth: 90 },
                    { mDataProp: "empName", bVisible: true }
                ],
                aaSorting: [[2, 'asc']],
                bJQueryUI: true,
                bAutoWidth: false,
                sDom: 'rtsCpi',
                bPaginate: true,
                bProcessing: true,
                iDisplayLength: 20,
                bLengthChange: false,
                fnDrawCallback: function () { pubSub.pub("employeeTableRedrawn"); }
            });
        },
        myJobsTable: function (table) {
            var settings = $.extend(
                jobTableSettins, {
                    sAjaxSource: urls.loadMyJobList
                });

            table.dataTable(settings);
        },
        allJobsTable: function (table) {
            var settings = $.extend(
                jobTableSettins, {
                    sAjaxSource: urls.loadAllJobList
                });

            table.dataTable(settings);
        },
        usLocations: function (table) {
            return table.dataTable({
                //aaData: global.usLocations,
                bFilter: true,
                bJQueryUI: true,
                bAutoWidth: false,
                bPaginate: true,
                iDisplayLength: 20,
                sDom: 'tspCi',
                aoColumnDefs: [
                    { "bVisible": false, "aTargets": [0] },
                    { "bVisible": true, "aTargets": [1, 2, 3] }
                ],
                fnDrawCallback: function () { this.fnAddTooltips(); },
                fnRowClick: function (row) { pubSub.pub("usRowClicked", row); },
                fnRowDbClick: function (row) {
                    pubSub.pub("usRowClicked", row);
                    pubSub.pub("locDialog/close", true);
                }
            });
        },
        foreignLocations: function (table) {
            return table.dataTable({
                //aaData: global.foreignLocations,
                bFilter: true,
                bJQueryUI: true,
                bAutoWidth: false,
                bPaginate: true,
                iDisplayLength: 20,
                sDom: 'tspCi',
                aoColumnDefs: [
                    { "bVisible": false, "aTargets": [0] },
                    { "bVisible": true, "aTargets": [1, 2] }
                ],
                fnRowClick: function (row) {
                    pubSub.pub("foreignRowClicked", row);
                },

                fnRowDbClick: function (row) {
                    pubSub.pub("foreignRowClicked", row);
                    pubSub.pub("locDialog/close", true);
                }
            });
        },
        attachments: function (table, fnServerParams) {
            return table.dataTable({
                bFilter: true,
                bProcessing: false,
                bJQueryUI: true,
                bAutoWidth: false,
                bPaginate: true,
                iDisplayLength: 20,
                oLanguage: { sEmptyTable: "There are no attachments yet" },
                sDom: 'tspi',
                sAjaxSource: urls.loadAttachmentTableData,
                fnServerParams: fnServerParams,
                aoColumns: [
                    { mDataProp: "Id", bVisible: false },
                    { mDataProp: formatFileNameColumn, bVisible: true },
                    { mDataProp: "Date", bVisible: true, bSortable: true, sType: "date", sWidth: 80 },
                    { mDataProp: formatAttacherColumn, bVisible: true, bSortable: false }
                ]
            });
        },
        history: function (table, fnServerParams) {
            return table.dataTable({
                bFilter: true,
                bJQueryUI: true,
                bAutoWidth: false,
                bPaginate: true,
                iDisplayLength: 20,
                oLanguage: { sEmptyTable: "No changes were made on that entry" },
                sDom: 'tpi',
                sAjaxSource: global.urls.loadDetailHistory,
                fnServerParams: fnServerParams,
                aaSorting: [[2, 'desc']],
                aoColumns: [
                    { mDataProp: "Status", bVisible: true, bSortable: false, sWidth: 100 },
                    { mDataProp: "ChangedBy", bVisible: true, bSortable: false, sWidth: 150 },
                    { mDataProp: "Date", bVisible: true, bSortable: true, sType: "date", sWidth: 80 },
                    { mDataProp: "Notes", bVisible: true, bSortable: false }
                ]
            });
        },
        validationWarnings: function (table) {
            return table.dataTable({
                bFilter: true,
                bJQueryUI: true,
                bAutoWidth: false,
                bPaginate: true,
                iDisplayLength: 1000,
                sDom: 'tspi',
                aoColumns: [
                    { mDataProp: "Name", bVisible: true, bSortable: true, sWidth: 200 },
                    { mDataProp: "Date", bVisible: true, bSortable: true, sType: "date", sWidth: 80 },
                    { mDataProp: "Warning", bVisible: true, bSortable: true }
                ]
            });
        }
    };
});