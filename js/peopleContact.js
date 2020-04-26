// 初始給值 start
var hid;
var uid;
var uid_name;
var healthCheckItemAppend = [];
$(document).ready(function () {
    var llll1ll1l1l1l1l1l = getFuncInfo();
    if(lllllllllllllllll) {
        var user = getUserDetail();
    }
    uid = getLocalStorageItem("uid");
    uid_name = getLocalStorageItem("name");
});

var getList = function() {
    var html = "";
    var sJson = JSON.stringify({
        uid: uid,
        action: 'getPeople'
    });
    $.ajax({
        url: api_url + "/cyms/action_contact_people.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects);
            if (data.objects.length == 0) {
                html += "<div class='activity-row' style='padding: 10px 0px;margin: 0'><div class='row' style='margin:0'><li class='setList_btn row_title' data-i18n='no_contact_history'></li></div></div>";
            } else {
                for (var i = 0; i < data.objects.length; i++) {
                    html += "<div class='activity-row' style='padding: 10px 0px;margin: 0'>";
                    html += "<div class='row' style='margin:0'>";
                    html += "<div class='setList_btn col-xs-12'>";
                    html += "<li class='row_title'>" + $.i18n("name_is") + data.objects[i].contact_name;
                    html += "</li>";
                    html += "<li class='row_title'>" + $.i18n("phone_is") + data.objects[i].contact_phone + "</li>";
                    html += "</div>";
                    html += "</div>";
                    html += "</div>";
                }
            }
        }
    });
    $("#list").html(html);
};

var showInsertModal = function() {
    $("#exampleModal").modal("show");
};

var contactCheck = function() {
    var error = false;
    var name = $("#contact-name").val();
    var phone = $("#contact-phone").val();
    if(name.trim() == "") {
        error = true;
        $("#name-hint").css("display", "inline-block");
    }
    if(phone.trim() == "") {
        error = true;
        $("#phone-hint").css("display", "inline-block");
    }
    if(!error) {
        $("#name-hint").css("display", "none");
        $("#phone-hint").css("display", "none");
        insertPerson(name, phone);
    }
}

var insertPerson = function(name, phone) {
    var sJson = JSON.stringify({
        uid: uid,
        contact_name: name,
        contact_phone: phone,
        action: 'insert'
    });
    $.ajax({
        url: api_url + "/cyms/action_contact_people.php",
        type: "POST",
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            $("#exampleModal").modal("hide");
            $("#contact-name").val("");
            $("#contact-phone").val("");
            getList();
        }
    });
};