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
function activateFloatingPanel(name) {
    closeFloatingPanel();
    $("#" + name + "-panel").removeClass("d-none");
}
function closeFloatingPanel() {
    $(".floating-panel:not(.d-none)").addClass("d-none");
    $(".floating-button").removeClass("floating-button-activated");
}

function getDateFromString(strDate) {
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
        function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
    return date;
}

$(() => {
    // 两侧按钮
    $(document).on("click", ".floating-button", (e) => {
        let fn = $(e.target).attr("fbg-name");
        if(fn=="update-logs"){
            $(".new-info-point").addClass("d-none");
            $.cookie("since-update-logs",new Date().toDateString(),{ expires: 3650 });
        }
        activateFloatingPanel($(e.target).attr("fbg-name"));
        $(e.target).addClass("floating-button-activated");
    });
    $(document).on("click", ".floating-button-activated", (e) => {
        closeFloatingPanel();
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
    // 获取版本信息
    $.ajax({
        type:"GET",
        url:"version-info.json",
        dataType:"json",
        success: function(response){
            $(".version-number").text(response["version-number"]);
            pd = getDateFromString(response["publish-date"]);
            $(".publish-date").text(String(pd.getFullYear())+String(pd.getMonth()).padStart(2,'0')+String(pd.getDate()));
            sul = $.cookie("since-update-logs");
            if(!sul || pd>=getDateFromString($.cookie("since-update-logs"))){
                $(".new-info-point").removeClass("d-none");
            }
        }
    });
    loadData();
});