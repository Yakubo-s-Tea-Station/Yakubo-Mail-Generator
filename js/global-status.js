var current_left_avatar = ""
var current_right_avatar = ""
var color_format_default = {
    "current_left_bg_color": "rgb(255, 219, 239)",
    "current_left_color": "rgb(0, 0, 0)",
    "current_right_bg_color": "rgb(255, 169, 218)",
    "current_right_color": "rgb(0, 0, 0)",
    "current_datetime_bg_color": "rgb(255, 169, 218)",
    "current_datetime_color": "rgb(255, 255, 255)",
}
function loadData() {
    if (!window.localStorage) {
        alert("您的浏览器不支持Local Storage特性，这意味着您无法自动保存会话状态")
    } else {
        if (window.location.search) {
            let params = (new URL(document.location)).searchParams;
            if (params.get("resetState") != null) {
                state = null;
            }
        }

        all_color_fields = ["current_left_bg_color", "current_left_color", "current_right_bg_color", "current_right_color", "current_datetime_bg_color", "current_datetime_color"]
        for (let field in all_color_fields) {
            field = all_color_fields[field];
            let fv = window.localStorage.getItem(field);
            if (fv == undefined || fv == "") {
                console.log(field + " and " + color_format_default[field]);
                window.localStorage.setItem(field, color_format_default[field]);
            }
            $("[field=" + field + "]").css("background-color", window.localStorage.getItem(field));
        }

        let tfn = window.localStorage.getItem("format-name");
        if (tfn) $("#format-url-input").val(tfn);
        if (tfn == undefined || tfn == "")
            tfn = "Yakubo Mio";
        loadFromFormat(tfn);

        let avatars = window.localStorage.getItem("avatars");
        if (avatars)
            try {
                avatars = JSON.parse(avatars);
            } catch (error) {
                avatars = undefined;
            }
        else
            if (!avatars)
                avatars = [];
        loadAvatars(avatars);

        let messages = window.localStorage.getItem("messages");
        if (messages)
            try {
                messages = JSON.parse(messages);
            } catch (error) {
                messages = undefined;
            }
        if (!messages)
            messages = [];
        loadMessages(messages);

        refreshLocalStorageInfo();
    }
}
function getProjectInfos() {
    let new_messages = [];
    $("#messages-body > div.basic-block").each(function () {
        if ($(this).hasClass("time-block")) {
            new_messages.push({
                type: "datetime",
                value: $(this).text().trim(),
                bgColor: $(this).children("span").css("background-color"),
                fontColor: $(this).find("[contenteditable]").css("color"),
                avatarMD5: md5($(this).find("img.avatar-icon").attr("src"))
            });
        } else if ($(this).hasClass("text-block")) {
            new_messages.push({
                type: "text",
                right: $(this).hasClass("right-block"),
                value: $(this).find("[contenteditable]").html().trim(),
                bgColor: $(this).children(".square").css("background-color"),
                fontColor: $(this).find("[contenteditable]").css("color"),
                avatarMD5: md5($(this).find("img.avatar-icon").attr("src"))
            });
        } else if ($(this).hasClass("image-block")) {
            new_messages.push({
                type: "image",
                right: $(this).hasClass("right-block"),
                img: $(this).find("img.primary-img").attr("src"),
                wtr: $(this).find("img.water-print").attr("src"),
                avatarMD5: md5($(this).find("img.avatar-icon").attr("src"))
            });
        }
    });
    return JSON.stringify(new_messages);
}
function refreshLocalStorageInfo() {
    if (window.localStorage) {
        let size = 0;
        for (item in window.localStorage) {
            if (window.localStorage.hasOwnProperty(item)) {
                size += window.localStorage.getItem(item).length;
            }
        }
        let cur = (size / 1024).toFixed(2);
        $("#local-storage-info").val(cur + ' / 5120 KB  (' + (cur / 51.20).toFixed(2) + '%)');
    }
}
function loadMessages(dict) {
    for (let message of dict) {
        if (message.type === "datetime") {
            addDatetime(message.value, message.bgColor, message.fontColor, false);
        } else {
            let found = false;
            let searchResult = message.right ? current_right_avatar : current_left_avatar;
            $("#all-avatars-common>.avatar-display-item>.avatar-icon").each(function () {
                if (!found) {
                    if ($(this).attr("md5") == message.avatarMD5) {
                        searchResult = $(this).attr("src");
                        found = true;
                    }
                }
            });
            if (message.type === "text")
                addText(message.value, message.bgColor, message.fontColor, message.right, searchResult, false);
            else if (message.type === "image")
                addImage(message.img, message.wtr, message.right, searchResult, save = false);
        }
    }
}
function saveMessages() {
    if (window.localStorage) {
        window.localStorage.setItem("messages", getProjectInfos());
        refreshLocalStorageInfo();
    }
}
function loadProjectFile(file) {
    var reader = new FileReader();
    reader.addEventListener("load", function (event) {
        let json_text = event.target.result;
        $("#messages-body").children(".left-block").remove();
        $("#messages-body").children(".time-block").remove();
        localStorage['messages'] = undefined;
        loadMessages(eval('(' + json_text + ')'));
        $("#messages-body").append($("#messages-body").find(".right-block"));
        saveMessages();
    });
    reader.readAsText(file);
}

$(() => {
    $(document).on('blur', '#format-url-input',
        function () {
            window.localStorage.setItem("format-name", $("#format-url-input").val());
        });
})