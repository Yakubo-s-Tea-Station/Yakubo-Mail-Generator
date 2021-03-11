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
function activateFloatingPanel(name){
    closeFloatingPanel();
    $("#"+name+"-panel").removeClass("d-none");
}
function closeFloatingPanel(){
    $(".floating-panel:not(.d-none)").addClass("d-none");
    $(".floating-button").removeClass("floating-button-activated");
}

$(() => {
    // 两侧按钮
    $(document).on("click", ".floating-button", (e) => {
        activateFloatingPanel($(e.target).attr("fbg-name"));
        $(e.target).addClass("floating-button-activated");
    });
    $(document).on("click", ".floating-panel-close-button", (e) => {
        closeFloatingPanel();
    });
    // 说明.公告面板
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