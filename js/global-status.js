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

        let tfn = window.localStorage.getItem("format-name");
        if (tfn) $("#format-url-input").val(tfn);

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
    for (const message of dict) {
        if (message.type === "text") {
            let found = false;
            let searchResult = "image/Avatar-Default.png";
            $("#all-avatars-common .avatar-display-item.d-inline-block").each(function () {
                if (!found) {
                    if ($(this).find("img.avatar-icon").attr("md5") == message.avatarMD5) {
                        searchResult = $(this).find("img.avatar-icon").attr("src");
                        found = true;
                    }
                }
            });
            addText(message.value, message.right, searchResult, message.bgColor, message.fontColor, false);
        }
        if (message.type === "image") {
            let found = false;
            let searchResult = "image/Avatar-Default.png";
            $("#all-avatars-common .avatar-display-item.d-inline-block").each(function () {
                if (!found) {
                    if ($(this).find("img.avatar-icon").attr("md5") == message.avatarMD5) {
                        searchResult = $(this).find("img.avatar-icon").attr("src");
                        found = true;
                    }
                }
            });
            addImage(message.img, message.wtr, message.right, searchResult, save = false);
        }
        if (message.type === "datetime") {
            addDatetime(message.value, message.bgColor, message.fontColor, false);
        }
    }
}
function saveMessages() {
    if (window.localStorage) {
        window.localStorage.setItem("messages", getProjectInfos());
        refreshLocalStorageInfo();
    }
}