function appendImageFromFile(file) {
    var reader = new FileReader();
    reader.addEventListener("load", function (event) {
        addImage(event.target.result);
    });
    reader.readAsDataURL(file);
}
function initiateBasicBlock(dom) {
    dom.removeAttr("id");
    dom.removeClass("d-none");
}
function initiateAvateredBlock(dom, right, avatar) {
    initiateBasicBlock(dom);
    dom.addClass(right ? "right-block" : "left-block");
    if (avatar == undefined)
        avatar = right ? current_right_avatar : current_left_avatar;
    dom.find("img.avatar-icon").attr("src", avatar);
}
function addImage(path, path_wtr = undefined, right = false, avatar = undefined, save = true) {
    new_block = $("#image-block-template").clone();
    initiateAvateredBlock(new_block, right, avatar);
    new_block.find("img.primary-img").attr("src", path);
    if (path_wtr)
        new_block.find("img.water-print").attr("src", path_wtr);
    $("#messages-body").append(new_block);
    if (save) saveMessages();
}
function addText(str, bgColor = undefined, fontColor = undefined, right = false, avatar = undefined, save = true) {
    if (bgColor == undefined)
        bgColor = current_left_bg_color;
    if (fontColor == undefined)
        fontColor = "#000000";
    new_block = $("#text-block-template").clone();
    initiateAvateredBlock(new_block, right, avatar);
    new_block.find("[contenteditable]").html(str);
    new_block.children(".square").css("background-color", bgColor);
    new_block.children(".triangle").css("border-left-color", bgColor);
    new_block.children(".triangle").css("border-right-color", bgColor);
    new_block.find("[contenteditable]").css("color", fontColor);
    $("#messages-body").append(new_block);
    if (save) saveMessages();
}
function addDatetime(val, bgColor = undefined, fontColor = undefined, save = true) {
    if (bgColor == undefined)
        bgColor = current_datetime_bg_color;
    if (fontColor == undefined)
        fontColor = "white";
    new_block = $("#time-block-template").clone();
    initiateBasicBlock(new_block);
    new_block.find("[contenteditable]").html(val);
    new_block.children("span").css("background-color", bgColor);
    new_block.find("[contenteditable]").css("color", fontColor);
    $("#messages-body").append(new_block);
    if (save) saveMessages();
}

$(function () {
    $(document).on("load", "img", function (event) {
        event.target.setAttribute("data-loaded", "true");
    });
    // 拖拽载入图片事件
    $("#messages-body").on("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
        files = event.originalEvent.dataTransfer.files
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                appendImageFromFile(files[i]);
            }
        }
    });
    $("#messages-body").on("dragover", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });
    $(document).on("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });
    $(document).on("dragover", function (event) {
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
    // 回车添加文本框
    $("#text-input").on('keydown', function (e) {
        if (e.keyCode == 13) {
            addText($('#text-input').val());
            $('#text-input').val('');
        }
    });
    // 中键删除basic-block
    $(document).on("mousedown", ".basic-block", (e) => {
        if (e.button == 1) {
            e.preventDefault();
            if ($(e.target).hasClass("basic-block"))
                $(e.target).remove();
            else
                $(e.target).parents(".basic-block").remove();
            saveMessages();
        }
    });
    // 每次更改文本框或者事件框时保存
    $(document).on('blur', '[contenteditable]:not(#format-url-input)', function () { saveMessages(); });

    let publicItems = {
        top: {
            name: "置顶",
            callback: function (_key, opt) {
                opt.$trigger.parent().prepend(opt.$trigger);
                saveMessages();
            }
        },
        up: {
            name: "上移",
            callback: function (_key, opt) {
                opt.$trigger.prev().before(opt.$trigger);
                saveMessages();
            }
        },
        down:
        {
            name: "下移",
            callback: function (_key, opt) {
                opt.$trigger.next().after(opt.$trigger);
                saveMessages();
            }
        },
        bottom: {
            name: "置底",
            callback: function (_key, opt) {
                opt.$trigger.parent().append(opt.$trigger);
                saveMessages();
            }
        },
        "sep1": "---------",
        remove:
        {
            name: "删除",
            callback: function (_key, opt) {
                opt.$trigger.remove();
                saveMessages();
            }
        },
        duplicate:
        {
            name: "复制",
            callback: function (_key, opt) {
                opt.$trigger.parent().append(opt.$trigger.clone().removeClass("context-menu-active"));
                saveMessages();
            }
        },
        "sep2": "---------"
    };
    $.contextMenu.types.selectAvatar = function (_item, opt, root) {
        let newView = $(".all-avatars-scroll-view").clone();
        newView.find("#all-avatars-common").removeAttr("id");
        newView.find(".avatar-icon").addClass("selectable-avatar-icon");
        $("<strong>更换头像</strong>" + newView.prop("outerHTML"))
            .appendTo(this)
            .on('click', '.selectable-avatar-icon', function () {
                opt.$trigger.find(".avatar-icon").attr("src", $(this).prop("src"));
                saveMessages();
                root.$menu.trigger('contextmenu:hide');
            });
    };
    let avatarItems = {
        changeAvatar: { type: "selectAvatar" }
    }
    let retweetItems = {
        changeSide: {
            name: "换边",
            callback: function () {
                let new_class = $(this).hasClass("left-block") ? "right-block" : "left-block";
                $(this).removeClass("left-block").removeClass("right-block").addClass(new_class);
                let new_bg_color = $(this).children("span").css("background-color");
                if (new_class == "right-block" && $(this).children("span").css("background-color") == current_left_bg_color) {
                    new_bg_color = current_right_bg_color;
                }
                else if (new_class == "left-block" && $(this).children("span").css("background-color") == current_right_bg_color) {
                    new_bg_color = current_left_bg_color;
                }
                $(this).children("span.square").css("background-color", new_bg_color);
                $(this).children(".triangle").css("border-left-color", new_bg_color);
                $(this).children(".triangle").css("border-right-color", new_bg_color);
                if ($(this).find(".avatar-icon").attr("src") == current_left_avatar || $(this).find(".avatar-icon").attr("src") == current_right_avatar)
                    $(this).find(".avatar-icon").attr("src", new_class == "left-block" ? current_left_avatar : current_right_avatar);
                saveMessages();
            }
        }
    }
    let colorItems = {
        "sep10": "---------",
        bgColor: {
            type: "text",
            name: "更换背景颜色"
        },
        fontColor:
        {
            type: "text",
            name: "更换字体颜色"
        },
        changeColor:
        {
            name: "更改颜色",
            icon: "edit",
            callback: function (itemKey, opt, rootMenu, originalEvent) {
                new_data = $.contextMenu.getInputValues(opt);
                opt.$trigger.children("span.square").css("background-color", new_data.bgColor);
                opt.$trigger.children(".triangle").css("border-left-color", new_data.bgColor);
                opt.$trigger.children(".triangle").css("border-right-color", new_data.bgColor);
                opt.$trigger.find("[contenteditable]").css("color", new_data.fontColor);
                saveMessages();
            }
        }
    }
    $.contextMenu({
        selector: ".time-block",
        zIndex: 100,
        items: Object.assign({}, publicItems, colorItems),
        events: {
            show: function (opt) {
                $.contextMenu.setInputValues(opt,
                    {
                        bgColor: opt.$trigger.children("span").css("background-color"),
                        fontColor: opt.$trigger.find("[contenteditable]").css("color")
                    }
                );
            }
        }
    });
    let imageItems = Object.assign({}, Object.assign({}, publicItems, retweetItems), avatarItems);
    $.contextMenu({
        selector: ".image-block",
        zIndex: 100,
        items: imageItems
    });
    $.contextMenu({
        selector: ".text-block",
        zIndex: 100,
        items: Object.assign({}, imageItems, colorItems),
        events: {
            show: function (opt) {
                $.contextMenu.setInputValues(opt,
                    {
                        bgColor: opt.$trigger.children("span").css("background-color"),
                        fontColor: opt.$trigger.find("[contenteditable]").css("color")
                    }
                );
            }
        }
    });

});