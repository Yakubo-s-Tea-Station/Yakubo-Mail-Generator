function importAvatarFile(file) {
    var reader = new FileReader();
    reader.addEventListener("load", function (event) {
        addAvatarToList(event.target.result);
    });
    reader.readAsDataURL(file);
}
function addAvatarToList(dataURL) {
    let new_block = $("#avatar-display-item-template").clone();
    new_block.removeAttr("id");
    new_block.removeClass("d-none");
    new_block.addClass("d-inline-block");
    new_block.find("img.avatar-icon").attr("src", dataURL);
    new_block.find("img.avatar-icon").attr("md5", md5(dataURL));
    $(".all-avatars").append(new_block);
    $("#all-avatars-common .avatar-icon").removeClass("selectable-avatar-icon");
    saveAvatars();
    refreshLocalStorageInfo();
}
function loadAvatars(dict) {
    for (const img of dict) {
        addAvatarToList(img);
    }
}
function saveAvatars() {
    if (window.localStorage) {
        avatars = [];
        $("#all-avatars-common .avatar-display-item.d-inline-block").each(
            function () {
                avatars.push($(this).find(".avatar-icon").attr("src"));
            });
        window.localStorage.setItem("avatars", JSON.stringify(avatars));
        refreshLocalStorageInfo();
    }
}
$(() => {
    $(".all-avatars-scroll-view").bind("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
        files = event.originalEvent.dataTransfer.files
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                importAvatarFile(files[i]);
            }
        }
    });
    $(".all-avatars-scroll-view").bind("dragover", function (event) {
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
                callback:
                    function (key, opt) {
                        let md5 = opt.$trigger.find(".avatar-icon").attr("md5");
                        $(".all-avatars .avatar-icon[md5='" + md5 + "']").parent().remove();
                        saveAvatars();
                    }
            }
        }
    });
});