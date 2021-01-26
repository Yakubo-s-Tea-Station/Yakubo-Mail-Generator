document.write("<script language=javascript src='js/avatars.js'></script>");
document.write("<script language=javascript src='js/messages-control.js'></script>");
document.write("<script language=javascript src='js/global-status.js'></script>");
function closeHelp(close) {
    let links = document.querySelectorAll("#close-help-menu a");
    if (close) {
        document.getElementById("help-menu").classList.add("disabled");
        links[0].classList.add("disabled");
        links[1].classList.remove("disabled");
    } else {
        document.getElementById("help-menu").classList.remove("disabled");
        links[0].classList.remove("disabled");
        links[1].classList.add("disabled");
    }

    state.helpMenu = !close;
    state.checkedVersion = getNameVersion();
    saveLocalState();
}

function hideCloseHelp(elem) {
    // closeHelp(true);
    document.getElementById("control").classList.add("disabled")
    document.getElementById("save-button").remove();
    document.querySelector("#save-button img").remove();
}
function saveImage() {
    $("body").addClass("body-lock");
    document.body.scrollIntoView();
    let htmlDom = document.querySelector('#messages-canvas');
    // let htmlDom = document.querySelector('#test');
    html2canvas(htmlDom, {
        allowTaint: false,
        taintTest: true,
        useCORS: true,
        background: "#fff",
        scale: 2
    }).then(function (canvas) {
        var link = document.createElement("a");
        link.href = canvas.toDataURL('image/jpg');
        link.download = 'screenshot.jpg';
        link.click();
    });
    $("body").removeClass("body-lock");
}

$(()=>{
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
});