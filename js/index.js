document.write("<script language=javascript src='js/messages-control.js'></script>");
document.write("<script language=javascript src='js/global-status.js'></script>");

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