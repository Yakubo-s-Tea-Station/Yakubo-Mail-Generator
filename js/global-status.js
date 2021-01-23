$(document).ready(function () {
    $("#all-avatars-scroll-view").bind("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
        files = event.originalEvent.dataTransfer.files
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                importAvatarFile(files[i]);
            }
        }
    });
    $("#all-avatars-scroll-view").bind("dragover", function (event) {
        event.preventDefault();
        event.stopPropagation();
    });
    $.contextMenu({
        selector: ".avatar-display-item",
        zIndex: 100,
        items: {
            remove:
            {
                icon: "fa-trash",
                name: "删除",
                callback: function (key, opt) {
                    opt.$trigger.remove();
                    saveAvatars();
                }
            }
        }
    });
});
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
        let messages = JSON.parse(window.localStorage.getItem("messages"));
        if (!messages) messages = [];
        let avatars = JSON.parse(window.localStorage.getItem("avatars"));
        if (!avatars) avatars = [];
        loadAvatars(avatars);
        loadMessages(messages);
        refreshLocalStorageInfo();
    }
}
function loadMessages(dict) {
    for (const message of dict) {
        if (message.type === "text") {
            let found = false;
            let searchResult = "image/Avatar-Default.png";
            $("#all-avatars .avatar-display-item.d-inline-block").each(function () {
                if(!found){
                    if($this.find("img.avatar-icon").attr("md5")==message.avatarMD5)
                    {
                        searchResult = $this.find("img.avatar-icon").attr("src");
                        found = true;
                    }
                }
            });
            addText(message.value, message.right, searchResult, message.bgColor, message.fontColor, false);
        }
        if (message.type === "image") {
            let found = false;
            let searchResult = "image/Avatar-Default.png";
            $("#all-avatars .avatar-display-item.d-inline-block").each(function () {
                if(!found){
                    if($this.find("img.avatar-icon").attr("md5")==message.avatarMD5)
                    {
                        searchResult = $this.find("img.avatar-icon").attr("src");
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
    let new_messages = [];
    $("#messages-body > div").each(function () {
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
                wtr: $(this).find("img.water-print").attr("src")
            });
        }
    });
    if (window.localStorage) {
        window.localStorage.setItem("messages", JSON.stringify(new_messages));
        refreshLocalStorageInfo();
        //console.log(window.localStorage.getItem("messages"));
    }
}
function importAvatarFile(file) {
    var reader = new FileReader();
    reader.addEventListener("load", function (event) {
        addAvatarToList(event.target.result);
    });
    reader.readAsDataURL(file);
}
function addAvatarToList(dataURL) {
    new_block = $("#avatar-display-item-template").clone();
    new_block.removeAttr("id");
    new_block.removeClass("d-none");
    new_block.addClass("d-inline-block");
    new_block.find("img.avatar-icon").attr("src", dataURL);
    new_block.find("img.avatar-icon").attr("md5", md5(dataURL));
    $("#all-avatars").append(new_block);
    saveAvatars();
}
function loadAvatars(dict) {
    for (const img of dict) {
        addAvatarToList(img);
        refreshLocalStorageInfo();
    }
}
function saveAvatars() {
    if (window.localStorage) {
        avatars = [];
        $("#all-avatars .avatar-display-item.d-inline-block").each(function () {
            avatars.push($(this).find(".avatar-icon").attr("src"));
        });
        window.localStorage.setItem("avatars", JSON.stringify(avatars));
        refreshLocalStorageInfo();
        //console.log(window.localStorage.getItem("avatars"));
    }
}