document.write("<script language=javascript src='js/messages-control.js'></script>");
document.write("<script language=javascript src='js/global-status.js'></script>");

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
// $(document).on("mousedown", ".basic-block", function (e) {
//     if(e.which==3){

//     }
// });
// $(document).on("contextmenu", ".basic-block", function (e) {
//     return false;
// });
$(document).ready(function () {
    loadData();
    let publicItems = {
        up: {
            icon: "fa-level-up",
            name: "上移",
            callback: function (key, opt) {
                opt.$trigger.prev().before(opt.$trigger);
                saveMessages();
            }
        },
        down:
        {
            icon: "fa-level-down",
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
                opt.$trigger.parent().append(opt.$trigger.clone());
                saveMessages();
            }
        },
        "sep1": "---------"
    };
    let avatarItems = {
        changeAvatar:
        {
            icon: "fa-user",
            name: "更换头像"
        }
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
            name: "更换背景颜色",
            events: {
            }
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
                opt.$trigger.children("span.triangle").css("border-left-color", new_data.bgColor);
                opt.$trigger.children("span.triangle").css("border-right-color", new_data.bgColor);
                opt.$trigger.find("[contenteditable]").css("color", new_data.fontColor);
                saveMessages();
            }
        }
    });
});
