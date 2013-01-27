define(["pubSub", "PerDiem/tableBuilder", "PerDiem/urls", "Plupload"], function (pubSub, tableBuilder, urls, Plupload) {
    var _requestGuid,
        _employee,
        _table,
        _uploader,
        _dialog,
        _uploadCounter = 0;

    function init() {
        var attachButtonId = "btn-attach";
        _dialog = $("#attachmentDialog");
        _table = $("#attachmentList");
        
        tableBuilder.attachments(_table, fnServerParams);

        _dialog.dialog({
            autoOpen: false,
            resizable: false,
            modal: false,
            height: 630,
            width: 600,
            buttons: [{
                id: "btn-close",
                text: "Close",
                click: function () {
                    $(this).dialog("close");
                }
            }, {
                id: attachButtonId,
                text: "Attach",
                click: function () {
                }
            }],
            open: function () {
                initUploader(attachButtonId);
            },
            close: function () {
                var attAmount = _table.fnGetData().length;
                _employee.setAttachmentAmount(attAmount);

                _uploader.destroy();
            }
        });

        _table.on("click", "tr:not('.loading') .deleteAtt", onDeleteClicked);
    }

    function fnServerParams(aoData) {
        aoData.push({
            name: "requestGuid",
            value: _requestGuid
        });

        aoData.push({
            name: "employeeGuid",
            value: _employee.EmpGuid
        });
    }

    function initUploader(buttonId) {
        var buttonSetId = _dialog.siblings(".ui-dialog-buttonpane").find(".ui-dialog-buttonset").attr("id", "buttonSetid_" + Plupload.guid()).attr("id");

        _uploader = new Plupload.Uploader({
            runtimes: 'html4',
            browse_button: buttonId,
            container: buttonSetId,
            max_file_size: '10mb',
            url: urls.uploadAttachment + "?requestGuid=" + _requestGuid + "&attachedTo=" + _employee.EmpGuid
        });

        _uploader.init();

        _uploader.bind('FilesAdded', _uploader.start);
        _uploader.bind('BeforeUpload', showUploadAnimation);
        _uploader.bind('UploadComplete', hideUploadAnimation);

        _uploader.bind('FileUploaded', function (up, file, params) {
            var data = $(params.response).text();
            if (data.length > 0)
                eval('data = ' + data);

            if (!data.Error)
                _table.fnAddData(data.Data);
            else
                pubSub.pub("ui/showMessage", "Error", data.Error);
        });

        _uploader.bind('Error', function (up, err) {
            pubSub.pub("ui/showMessage", "Error", "Error: " + err.code + ", Message: " + err.message);
        });
    }

    function onDeleteClicked() {
        var tr = $(this).closest("tr");
        tr.addClass("loading");
        var data = _table.fnGetData(tr[0]);
        triggerDeleteAtt(data.Id, tr[0]);
    }

    function showUploadAnimation() {
        if (_uploadCounter++ == 0) {
            $("#uploadAnimation").width($("#attachmentDialog").width());
            $("#uploadAnimation").height($("#attachmentDialog").height());
            $("#uploadAnimation").show().position({ of: "#attachmentDialog" });
        }
    }

    function hideUploadAnimation() {
        if (--_uploadCounter == 0)
            $("#uploadAnimation").hide();
    }

    function triggerDeleteAtt(id, tr) {
        pubSub.pub("deleteAttachment", id, function () {
            _table.fnDeleteRow(tr);
        });
    }

    return {
        open: function (requestGuid, employee) {
            _requestGuid = requestGuid;
            _employee = employee;

            if (!_dialog)
                init();
            else
                _table.fnReloadAjax(null, "Attachment list is being loaded");

            _dialog.dialog("option", "title", $.trim(employee.EmpNo) + " " + $.trim(employee.EmpName));
            _dialog.dialog("open");
        }
    };
})