define(["pubSub", "Plupload"], function (pubSub, Plupload) {
    var _uploader,
        _detail,
        $uploaderBlock = $("#uploaderBlock"),
        $downloadBlock = $("#downloadBlock"),
        $downloadLink = $("#downloadLink"),
        $fileName = $("#fileName"),
        $deleteLink = $("#deleteLink"),
        $attachInfo = $("#attachInfo"),
        $dialog = $("#agreementDialog"),
        $animation = $dialog.find(".animation"),
        $start = $("#agreementStart"),
        $end = $("#agreementEnd");

    function start(value) {
        if (arguments.length == 0)
            return _detail.agreement.start();

        _detail.agreement.start(value);
        $start.val(value);
        $end.datepicker("option", "minDate", value || null);
    }

    function end(value) {
        if (arguments.length == 0)
            return _detail.agreement.end();

        _detail.agreement.end(value);
        $end.val(value);
        $start.datepicker("option", "maxDate", value || null);
    }

    function fileName(value) {
        if (arguments.length == 0)
            return $fileName.val();

        _detail.agreement.fileName(value);
        $fileName.val(value);
        if (value == undefined) _uploader.files.length = 0;
    }


    function init() {
        var datepickerCommonSettings = {
            showOn: "button",
            dateFormat: "mm/dd/y",
            buttonImage: global.urls.calendarImg,
            buttonImageOnly: true
        };

        $start.datepicker($.extend(
                { onClose: function (dateText) { start(dateText); } },
                datepickerCommonSettings)
        );

        $end.datepicker($.extend(
                { onClose: function (dateText) { end(dateText); } },
                datepickerCommonSettings)
        );

        $deleteLink.click(onDeleteClicked);

        $dialog.dialog({
            autoOpen: false,
            resizable: false,
            modal: false,
            width: 360,
            buttons: {
                Close: function () {
                    $(this).dialog("close");
                },
                Save: function () {
                    onSaveClicked();
                }
            },
            open: function () {
                _uploader = new Plupload.Uploader({
                    runtimes: 'html4',
                    browse_button: 'browseButton',
                    container: 'uploaderBlock',
                    max_file_size: '10mb'
                });

                _uploader.init();

                //!!! I have you fucking IE !!!
                $("#uploaderBlock form").css('left', 143).css('top', 4); //fix for browse button in IE

                _uploader.bind('FilesAdded', function (uploader, files) {
                    fileName(files[0].name);
                });

                _uploader.bind('FileUploaded', function (up, file, params) {
                    onSaveResponse(params.response);
                });

                _uploader.bind('Error', function (up, err) {
                    $.showMessage("Error", "Error: " + err.code + ", Message: " + err.message);
                });

                refreshUI();
            },
            close: function () {
                _uploader.destroy();
            }
        });




    }

    function refreshUI() {
        $dialog.dialog("option", "title", $.trim(_detail.employee()));

        start(_detail.agreement.start());
        end(_detail.agreement.end());

        if (!_detail.agreement.detailId()) {
            $downloadBlock.hide();
            $uploaderBlock.show();
        } else {
            $downloadBlock.show();
            $uploaderBlock.hide();
        }

        $downloadLink.attr("href", global.urls.downloadAgreement + "?detailId=" + _detail.id());
        fileName(_detail.agreement.fileName());
        $attachInfo.text(_detail.agreement.attachInfo() || "");
    }

    function onSaveClicked() {
        if (!start()) {
            $.showMessage("Warning", "Specify 'Agreement Start Date' to proceed with saving");
            return;
        }

        if (!end()) {
            $.showMessage("Warning", "Specify 'Agreement End Date' to proceed with saving");
            return;
        }

        if (!fileName()) {
            $.showMessage("Warning", "Select 'File' to proceed with saving");
            return;
        }

        showAnimation();

        if (_uploader.files.length == 0) {
            var url = global.urls.saveAgreement + '?detailId=' + _detail.id() + "&start=" + $start.val() + "&end=" + $end.val();
            $.post(url, function (response) {
                onSaveResponse(response);
            });
        }
        else {
            _uploader.settings.url = global.urls.saveAgreement + '?detailId=' + _detail.id() + "&start=" + $start.val() + "&end=" + $end.val();
            _uploader.start();
        }
    }

    function onDeleteClicked() {
        showAnimation();
        var url = global.urls.deleteAgreement + "?detailId=" + _detail.id();
        $.post(url, function () {
            hideAmimation();
            _detail.agreement.detailId(undefined);
            start(undefined);
            end(undefined);
            fileName(undefined);
            _detail.agreement.attachInfo(undefined);
            refreshUI();
        });
    }

    function onSaveResponse(response) {
        hideAmimation();

        // strip out HTML tags (if answer came from frame form)
        if (typeof (response) == "string" && response[0] != "{")
            response = $(response).text();

        if (response.length > 0)
            eval('response = ' + response);

        if (typeof (response) == "string") {
            $.showMessage("Error", response);
            fileName(undefined);
        }
        else {
            _detail.updateAgreement(response);
            $dialog.dialog("close");
        }
    }

    function showAnimation() {
        $animation.width($dialog.width());
        $animation.height($dialog.height());
        $animation.show().position({ of: "#" + $dialog.attr("id") });
    }

    function hideAmimation() {
        $animation.hide();
    }

    return {
        open: function (detail) {
            if (!_uploader)
                init();

            _detail = detail;
            $dialog.dialog("open");
        }
    };
})