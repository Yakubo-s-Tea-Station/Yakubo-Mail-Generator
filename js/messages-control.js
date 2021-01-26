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
    new_block.find("img.avatar-icon").attr("src", avatar);
    new_block.find("img.primary-img").attr("src", path);
    if (path_wtr)
        new_block.find("img.water-print").attr("src", path_wtr);
    $("#messages-body").append(new_block);
    if (save) saveMessages();
}
function addText(str, right = false, avatar = "image/Avatar-Default.png", bgColor = "#ffdbff", fontColor = "#000000", save = true) {
    new_block = $("#text-block-template").clone();
    new_block.removeAttr("id");
    new_block.removeClass("d-none");
    new_block.addClass(right ? "right-block" : "left-block");
    new_block.find("img.avatar-icon").attr("src", avatar);
    new_block.find("[contenteditable]").html(str);
    new_block.children(".square").css("background-color", bgColor);
    new_block.children(".triangle").css("border-left-color", bgColor);
    new_block.children(".triangle").css("border-right-color", bgColor);
    new_block.find("[contenteditable]").css("color", fontColor);
    $("#messages-body").append(new_block);
    if (save) saveMessages();
}
function addDatetime(val, bgColor = "#ffdbff", fontColor = "#000000", save = true) {
    new_block = $("#time-block-template").clone();
    new_block.removeAttr("id");
    new_block.removeClass("d-none");
    new_block.find("[contenteditable]").html(val);
    new_block.children("span").css("background-color", bgColor);
    new_block.find("[contenteditable]").css("color", fontColor);
    $("#messages-body").append(new_block);
    if (save) saveMessages();
}

$(document).ready(function () {
    loadData();
    refreshAvatarSelect();
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
    // 每次更改文本框或者事件框时保存
    $(document).on('change', '[contenteditable]', function () { saveMessages(); });
    let publicItems = {
        top: {
            icon: "fa-level-up",
            name: "置顶",
            callback: function (key, opt) {
                opt.$trigger.parent().prepend(opt.$trigger);
                saveMessages();
            }
        },
        bottom: {
            icon: "fa-level-down",
            name: "置底",
            callback: function (key, opt) {
                opt.$trigger.parent().append(opt.$trigger);
                saveMessages();
            }
        },
        up: {
            icon: "fa-chevron-up",
            name: "上移",
            callback: function (key, opt) {
                opt.$trigger.prev().before(opt.$trigger);
                saveMessages();
            }
        },
        down:
        {
            icon: "fa-chevron-down",
            name: "下移",
            callback: function (key, opt) {
                opt.$trigger.next().after(opt.$trigger);
                saveMessages();
            }
        },
        remove:
        {
            icon: "fa-trash",
            name: "删除",
            callback: function (key, opt) {
                opt.$trigger.remove();
                saveMessages();
            }
        },
        duplicate:
        {
            icon: "fa-copy",
            name: "复制",
            callback: function (key, opt) {
                opt.$trigger.parent().append(opt.$trigger.clone().removeClass("context-menu-active"));
                saveMessages();
            }
        },
        "sep1": "---------"
    };
    let avatarItems = {
        changeAvatar: { type: "selectAvatar" }
    }
    let retweetItems = {
        changeSide: {
            icon: "fa-retweet",
            name: "换边",
            callback: function () {
                new_class = $(this).hasClass("left-block") ? "right-block" : "left-block";
                $(this).removeClass("left-block").removeClass("right-block").addClass(new_class);
                saveMessages();
            }
        }
    }
    let colorItems = {
        bgColor: {
            type: "text",
            name: "更换背景颜色"
        },
        fontColor:
        {
            type: "text",
            name: "更换字体颜色"
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
            },
            hide: function (opt) {
                new_data = $.contextMenu.getInputValues(opt);
                opt.$trigger.children("span").css("background-color", new_data.bgColor);
                opt.$trigger.find("[contenteditable]").css("color", new_data.fontColor);
                saveMessages();
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
            },
            hide: function (opt) {
                new_data = $.contextMenu.getInputValues(opt);
                opt.$trigger.children("span.square").css("background-color", new_data.bgColor);
                opt.$trigger.children(".triangle").css("border-left-color", new_data.bgColor);
                opt.$trigger.children(".triangle").css("border-right-color", new_data.bgColor);
                opt.$trigger.find("[contenteditable]").css("color", new_data.fontColor);
                saveMessages();
            }
        }
    });
});

function refreshAvatarSelect() {
    let new_scoll = $("#all-avatars-scroll-view").clone();
    new_scoll.find("#avatar-display-item-template").remove();
    new_scoll.find("*").removeAttr("id");
    new_scoll.find(".avatar-icon").addClass("selectable-avatar-icon");
    $.contextMenu.types.selectAvatar = function (item, opt, root) {
        $("<strong>更换头像</strong>" + new_scoll.prop("outerHTML"))
            .appendTo(this)
            .on('click', '.selectable-avatar-icon', function () {
                opt.$trigger.find(".avatar-icon").attr("src", $(this).prop("src"));
                saveMessages();
                root.$menu.trigger('contextmenu:hide');
            });
    };
}