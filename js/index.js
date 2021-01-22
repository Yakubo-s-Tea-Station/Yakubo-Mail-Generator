let state;
if (window.localStorage) {
    state = JSON.parse(window.localStorage.getItem("state"));
    if (window.location.search) {
        let params = (new URL(document.location)).searchParams;
        if (params.get("resetState") != null) {
            state = null;
        }
    }
}

$(document).ready(function () {

    if (!state) {
        state = {
            messages: [],
            doc_expanded: true
        };
    } else {
        loadMessages();
    }
});
function loadMessages() {
    if (state.messages && state.messages.length > 0) {
        $(".messages-body>*").each(function () { $(this).remove(); });
        for (const message of state.messages) {
            if (message.type === "text") {
                addText(message.value, message.left ? "left" : "right");
            }
            if (message.type === "image") {
                addImage(message.img, message.wtr, message.left ? "left" : "right");
            }
            if (message.type === "datetime") {
                addDatetime(message.value);
            }
        }
    }
}
function saveMessages() {
    state.messages = [];
    $("div.messages-body > div").each(function () {
        if ($(this).hasClass("time-budge")) {
            state.messages.push({
                type: "datetime",
                value: $(this).text()
            });
        } else if ($(this).hasClass("text-block")) {
            state.messages.push({
                type: "text",
                left: $(this).hasClass("left-block"),
                value: $(this).find("[contenteditable]").html()
            });
        } else if ($(this).hasClass("image-block")) {
            state.messages.push({
                type: "image",
                left: $(this).hasClass("left-block"),
                img: $(this).find("img:nth-of-type(1)").attr("src"),
                wtr: $(this).find("img:nth-of-type(2)").attr("src")
            });
        }
    });
    if (window.localStorage) {
        window.localStorage.setItem("state", JSON.stringify(state));
    }
}
function saveImage() {
    $("body").addClass("body-lock");
    document.body.scrollIntoView()
    let htmlDom = document.querySelector('#messages-canvas')
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
function appendImageFromFile(file) {
    var reader = new FileReader();
    reader.addEventListener("load", function (event) {
        addImage(event.target.result);
    });
    reader.readAsDataURL(file);
}
function addImage(path, path_wtr, side = "left") {
    $("div.messages-body").append("<div class=\"basic-block image-block " + side + "-block\"><span><i class=\"far fa-times-circle fa-2x i-red\"></i><i class=\"fas fa-retweet fa-2x i-green\"></i><img crossorigin=\"anonymous\" src=\"" + path + "\"><img crossorigin=\"anonymous\"></span><img src=\"image/Avatar-Default.png\"></div>");
    saveMessages();
}
function addText(str, side = "left") {
    $("div.messages-body").append("<div class=\"basic-block text-block " + side + "-block\"><span><i class=\"far fa-times-circle fa-2x i-red\"></i><i class=\"fas fa-retweet fa-2x i-green\"></i><div contenteditable=\"true\">" + str + "</div></span><img src=\"image/Avatar-Default.png\"></div>");
    saveMessages();
}
function addDatetime(val) {
    $("div.messages-body").append("<div class=\"time-budge\"><span><i class=\"far fa-times-circle fa-2x i-red\"></i><span contenteditable=\"true\">" + val + "</span></span></div>");
    saveMessages();
}

$(document).ready(function () {
    $(document).on("load", "img", function (event) {
        event.target.setAttribute("data-loaded", "true");
    });
    // 文字输入按钮click事件
    $(document).on("click", "#enter-button", (function () {
        let new_msg = $("#text-input").val().trim();
        if (new_msg.length > 0) {
            addText(new_msg);
            $("#text-input").val("");
        }
        saveMessages();
        $("#text-input")[0].scrollIntoView();
        $("#text-input")[0].focus();
    }));
    // 拖拽载入图片事件
    $("body").bind("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
        files = event.originalEvent.dataTransfer.files
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                appendImageFromFile(files[0]);
            }
        }
    });
    $("body").bind("dragover", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });

    // 交换位置按钮
    $(document).on("click", ".fa-retweet", function () {
        block_root = $(this).parent().parent();
        new_class = block_root.hasClass("left-block") ? "right-block" : "left-block";
        block_root.removeClass("left-block").removeClass("right-block").addClass(new_class);
        saveMessages();
    });
    // 删除按钮
    $(document).on("click", ".fa-times-circle", function () {
        $(this).parent().parent().remove();
        saveMessages();
    });
    // 防止富文本污染 Issue#3
    $(document).on('paste', '[contenteditable]', function (e) {
        e.preventDefault();
        var text = null;

        if (window.clipboardData && clipboardData.setData) {
            // IE
            text = window.clipboardData.getData('text');
        } else {
            text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
        }
        if (document.body.createTextRange) {
            if (document.selection) {
                textRange = document.selection.createRange();
            } else if (window.getSelection) {
                sel = window.getSelection();
                var range = sel.getRangeAt(0);
                var tempEl = document.createElement("span");
                tempEl.innerHTML = "&#FEFF;";
                range.deleteContents();
                range.insertNode(tempEl);
                textRange = document.body.createTextRange();
                textRange.moveToElementText(tempEl);
                tempEl.parentNode.removeChild(tempEl);
            }
            textRange.text = text;
            textRange.collapse(false);
            textRange.select();
        } else {
            document.execCommand("insertText", false, text);
        }
    });

    $(document).on('focusout', '[contenteditable]', function () { saveMessages(); });
});
