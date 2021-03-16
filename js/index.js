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


function saveProjectFile() {
    var link = document.createElement("a");
    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(getProjectInfos()));
    link.setAttribute("download", 'new_project.json');
    link.click();
    $(link).remove();
}

$(() => {
    // 两侧按钮
    $(document).on("click", ".floating-button", (e) => {
        let fn = $(e.target).attr("fbg-name");
        if (fn == "update-logs") {
            $(".new-info-point").addClass("d-none");
            $.cookie("since-update-logs", new Date().toDateString(), { expires: 3650 });
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
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/Yakubo-s-Tea-Station/Mails-Storage/main/list.json",
        dataType: "json",
        success: function (response) {
            for (let group in response) {
                let new_tab = $("#nav-item-template").clone();
                new_tab.removeAttr("id");
                new_tab.removeClass("d-none");
                new_tab.find("a").attr("id", group + "-tab");
                new_tab.find("a").attr("aria-controls", group);
                new_tab.find("a>h6").text(group);
                $("#group-tabs").prepend(new_tab);

                let new_panel = $("#tab-panel-template").clone();
                new_panel.removeAttr("id");
                new_panel.removeClass("d-none");
                new_panel.find("a").attr("aria-labelledby", group + "-tab");
                $("#mail-panels").prepend(new_panel);

                new_panel.append("<footer class='blockquote-footer mx-4 py-1'>最后更新日期：" + response[group]["latest-update"] + "</footer>");
                for (let i = 0; i < response[group]["mail-files"].length; ++i) {
                    let mail = response[group]["mail-files"][i];
                    new_panel.find("ul").prepend('<li ><a href="#" file-size="' + mail[1] + '" date-string="' + mail[0] + '" group="' + group + '">' + mail[0] + "</a>  共计 " + mail[2] + " 封  " + (mail[1] / 1024 / 1024).toFixed(2) + 'MB</li>');
                }
                $("#daily-message-loading").addClass("d-none");
                $("#daily-message-tabs").removeClass("d-none");
            }
        },
        error:()=>{
            $("#daily-message-tabs").text("加载失败，请刷新页面重试");
        }
    });
    $(document).on("click", "a[date-string]", function (e) {
        $("#loading-mask").removeClass("d-none");
        closeFloatingPanel();
        $.ajax({
            type: "GET",
            url: "https://raw.githubusercontent.com/Yakubo-s-Tea-Station/Mails-Storage/main/"+$(e.target).attr("group")+"/"+$(e.target).attr("date-string")+".json",
            dataType: "json",
            success: function (response) {
                $("#messages-body").empty();
                localStorage['messages']=undefined;
                loadMessages(response);
                saveMessages();
                $("#loading-mask").addClass("d-none");
            },
            error: ()=>{
                $("#loading-mask").addClass("d-none");
            }
        })
    });
    // 获取版本信息
    $.ajax({
        type: "GET",
        url: "version-info.json",
        dataType: "json",
        success: function (response) {
            new_version = response["version-number"];
            $(".version-number").text(new_version);
            pd = getDateFromString(response["publish-date"]);
            $(".publish-date").text(String(pd.getFullYear()) + String(pd.getMonth()+1).padStart(2, '0') + String(pd.getDate()));
            sul = $.cookie("last-version");
            if (!sul || new_version != sul) {
                $(".new-info-point").removeClass("d-none");
                $.cookie("last-version", new_version);
            }
        }
    });
    loadData();
});