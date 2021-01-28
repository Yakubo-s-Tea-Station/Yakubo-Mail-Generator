document.write("<script language=javascript src='js/avatars.js'></script>");
document.write("<script language=javascript src='js/messages-control.js'></script>");
document.write("<script language=javascript src='js/global-status.js'></script>");

function saveImage() {
    $("body").addClass("body-lock");
    document.body.scrollIntoView();
    let htmlDom = document.querySelector('#messages-canvas');
    html2canvas(htmlDom, {
        allowTaint: false,
        taintTest: true,
        useCORS: true,
        background: "#fff",
        scale: 2
    }).then(function (canvas) {
        var link = document.createElement("a");
        link.href = canvas.toDataURL('image/png');
        link.download = 'screenshot.png';
        link.click();
    });
    $("body").removeClass("body-lock");
}

function saveProjectFile() {

}

$(() => {
    // 说明.公告面板
    $("#close-help-menu a").on("click", function () {
        isClosed = $("#help-menu").hasClass("d-none");
        if (isClosed) {
            $("#help-menu").removeClass("d-none");
        } else {
            $("#help-menu").addClass("d-none");
        }
        $("#close-help-menu a").text((isClosed ? "展开" : "收起") + "说明");
    });
    $.ajax({
        type: "GET",
        url: "notifacations.html",
        dataType: "html",
        success: function (response) {
            $("#notification-contents").html(response);
        }
    });
    $.ajax({
        type: "GET",
        url: "manuals.html",
        dataType: "html",
        success: function (response) {
            $("#manuals-contents").html(response);
        }
    });

    loadData();
});