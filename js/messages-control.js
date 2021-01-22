function appendImageFromFile(file) {
    var reader = new FileReader();
    reader.addEventListener("load", function (event) {
        addImage(event.target.result);
    });
    reader.readAsDataURL(file);
}
function addImage(path, path_wtr = undefined, right = false, avatar = "image/Avatar-Default.png", save = true) {
    new_block = $("#image-block-template").clone();
    new_block.removeAttr("id");
    new_block.removeClass("d-none");
    new_block.addClass(right ? "right-block" : "left-block");
    new_block.find("img.avatar-icon").attr("src",avatar);
    new_block.find("img.primary-img").attr("src",path);
    if (path_wtr)
        new_block.find("img.water-print").attr("src",path_wtr);
    $("#messages-body").append(new_block);
    if (save) saveMessages();
}
function addText(str, right = false, avatar = "image/Avatar-Default.png",bgColor="#ffdbff",fontColor="#000000", save = true) {
    new_block = $("#text-block-template").clone();
    new_block.removeAttr("id");
    new_block.removeClass("d-none");
    new_block.addClass(right ? "right-block" : "left-block");
    new_block.find("img.avatar-icon").attr("src",avatar);
    new_block.find("[contenteditable]").text(str);
    new_block.children("span.square").css("background-color", bgColor);
    new_block.children("span.triangle").css("border-left-color", bgColor);
    new_block.children("span.triangle").css("border-right-color", bgColor);
    new_block.find("[contenteditable]").css("color", fontColor);
    $("#messages-body").append(new_block);
    if (save) saveMessages();
}
function addDatetime(val,bgColor="#ffdbff",fontColor="#000000", save = true) {
    new_block = $("#time-block-template").clone();
    new_block.removeAttr("id");
    new_block.removeClass("d-none");
    new_block.find("[contenteditable]").text(val);
    new_block.children("span").css("background-color", bgColor);
    new_block.find("[contenteditable]").css("color", fontColor);
    $("#messages-body").append(new_block);
    if (save) saveMessages();
}

$(document).ready(function () {
    $(document).on("load", "img", function (event) {
        event.target.setAttribute("data-loaded", "true");
    });
    // 拖拽载入图片事件
    $("#messages-body").bind("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
        files = event.originalEvent.dataTransfer.files
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                appendImageFromFile(files[i]);
            }
        }
    });
    $("#messages-body").bind("dragover", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });
    $(document).bind("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });
    $(document).bind("dragover", function (event) {
        event.preventDefault();
        event.stopPropagation();
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
