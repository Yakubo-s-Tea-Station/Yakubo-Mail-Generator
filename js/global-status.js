
var state;
$(document).ready(function () {
    if (!state) {
        state = {
            doc_expanded: true
        };
    }
});
function loadData() {
    if (!window.localStorage) {
        alert("您的浏览器不支持Local Storage特性，这意味着您无法自动保存会话状态")
    } else {
        state = JSON.parse(window.localStorage.getItem("state"));
        let messages = JSON.parse(window.localStorage.getItem("messages"));
        if (window.location.search) {
            let params = (new URL(document.location)).searchParams;
            if (params.get("resetState") != null) {
                state = null;
            }
        }
        loadMessages(messages);
    }
}
function loadMessages(dict) {
    for (const message of dict) {
        if (message.type === "text") {
            addText(message.value, message.right, "image/Avatar-Default.png", message.bgColor, message.fontColor, false);
        }
        if (message.type === "image") {
            addImage(message.img, message.wtr, message.right, "image/Avatar-Default.png", save = false);
        }
        if (message.type === "datetime") {
            addDatetime(message.value, message.bgColor, message.fontColor, false);
        }
    }
}

function saveMessages() {
    let new_messages = [];
    $("#messages-body > div").each(function () {
        if ($(this).hasClass("time-block")) {
            new_messages.push({
                type: "datetime",
                value: $(this).text().trim(),
                bgColor: $(this).children("span").css("background-color"),
                fontColor: $(this).find("[contenteditable]").css("color")
            });
        } else if ($(this).hasClass("text-block")) {
            new_messages.push({
                type: "text",
                right: $(this).hasClass("right-block"),
                value: $(this).find("[contenteditable]").html().trim(),
                bgColor: $(this).children("span.square").css("background-color"),
                fontColor: $(this).find("[contenteditable]").css("color")
            });
        } else if ($(this).hasClass("image-block")) {
            new_messages.push({
                type: "image",
                right: $(this).hasClass("right-block"),
                img: $(this).find("img.primary-img").attr("src"),
                wtr: $(this).find("img.water-print").attr("src")
            });
        }
    });
    if (window.localStorage) {
        window.localStorage.setItem("messages", JSON.stringify(new_messages));
        //console.log(window.localStorage.getItem("messages"));
    }
}