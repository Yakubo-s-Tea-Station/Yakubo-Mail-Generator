function changeBanner(url) {
    let reader = new FileReader();
    reader.addEventListener("load", function (event) {
        $(".messages-header").attr("src", event.target.result);
    });
    reader.readAsDataURL(url);
}
function changeBackground(url) {
    let reader = new FileReader();
    reader.addEventListener("load", function (event) {
        $("#messages-canvas").css("background-image", "url(" + event.target.result + ")");
    });
    reader.readAsDataURL(url);
}
function changeFooter(url) {
    let reader = new FileReader();
    reader.addEventListener("load", function (event) {
        $(".messages-footer").attr("src", event.target.result);
        $(".messages-footer-placeholder").attr("src", event.target.result);
    });
    reader.readAsDataURL(url);
}
function loadFromFormat(format) {
    let warningInfo = "";
    if (!IsFileExists("image/" + format + "/Header-Default.png"))
        warningInfo += "题头图片Header-Default.png不存在！<br>";
    else
        $(".messages-header").attr("src", "image/" + format + "/Header-Default.png");
    if (!IsFileExists("image/" + format + "/Background-Default.png"))
        warningInfo += "背景图片Background-Default.png不存在！<br>";
    else{
        console.log("url(../image/" + format + "/Background-Default.png)");
        
        $("#messages-canvas").css("background-image", "url('image/" + format + "/Background-Default.png')");
    }
       
    if (!IsFileExists("image/" + format + "/Background-Default.png"))
        warningInfo += "落款图片Footer-Default.png不存在！<br>";
    else {
        $(".messages-footer").attr("src", "image/" + format + "/Footer-Default.png");
        $(".messages-footer-placeholder").attr("src", "image/" + format + "/Footer-Default.png");
    }
    let new_default_avatar_path = "image/" + format + "/Avatar-Default.png";
    current_left_avatar = IsFileExists(new_default_avatar_path) ? new_default_avatar_path : "image/Avatar-Default.png";
    console.log(current_left_avatar);
    let new_default_secondary_avatar_path = "image/" + format + "/Avatar-Secondary-Default.png";
    current_right_avatar = IsFileExists(new_default_secondary_avatar_path) ? new_default_secondary_avatar_path : current_left_avatar;
}
function IsFileExists(filepath) {
    let xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", filepath, false);
    xmlhttp.send();
    if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) return true; //url存在
        else return false;//其他状态 
    }
}