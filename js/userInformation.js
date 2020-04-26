function load_userInformation() {
    var sJson = JSON.stringify({
        uid: getLocalStorageItem("uid")
        //uid : 5//VIP
    });
    $.ajax({
        url: api_url + "/cyms/return_user_information.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",

        success: function (data) {
            console.log(localStorage.getItem('uid'));

            document.getElementById("uid").value = "";
            document.getElementById("name").value = "";
            document.getElementById("birth").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("img").src = "";
            $("#vip_tag").text("");

            document.getElementById("name").disabled = true
            document.getElementById("birth").disabled = true
            document.getElementById("phone").disabled = true

            console.log("uid:" + data.objects[0].uid);
            document.getElementById("uid").value = data.objects[0].uid;
            console.log("name:" + data.objects[0].name);
            document.getElementById("name").value = data.objects[0].name;
            console.log("birth:" + data.objects[0].birth);
            document.getElementById("birth").value = data.objects[0].birth;
            console.log("phone:" + data.objects[0].phone);
            document.getElementById("phone").value = data.objects[0].phone;
            console.log("vip_tag:" + data.objects[0].vip_tag);
            // if (data.objects[0].vip_tag == 0) {
            //     $("#vip_tag").append("会员等级: 普通");
            // } else if (data.objects[0].vip_tag == 1) {
            //     $("#vip_tag").append("会员等级: VIP");
            // } else if (data.objects[0].vip_tag == 2) {
            //     $("#vip_tag").append("会员等级: 尊荣普通");
            // } else if (data.objects[0].vip_tag == 3) {
            //     $("#vip_tag").append("会员等级: 尊容会员");
            // }
            console.log("pic:" + data.objects[0].imgurl);
            document.getElementById("img").src = data.objects[0].imgurl;

            console.log("comeTime:" + data.objects[0].comeTime);
            document.getElementById("comeTime").value = data.objects[0].back_date;

            console.log("leaveTime:" + data.objects[0].leaveTime);
            document.getElementById("leaveTime").value = data.objects[0].leaveTime;

            console.log("leaveProvince:" + data.objects[0].leaveProvince);
            document.getElementById("leaveProvince").value = data.objects[0].leaveProvince;

            console.log("leaveCity:" + data.objects[0].leaveCity);
            document.getElementById("leaveCity").value = data.objects[0].leaveCity;

            console.log("back_date:" + data.objects[0].back_date);
            if ((data.objects[0].leaveProvince == "无" && data.objects[0].leaveCity == "无")
                || data.objects[0].leaveProvince == "" && data.objects[0].leaveCity == "") {
                document.getElementById("where0").checked = true;
                $(".from_where").css("display", "none");
            }
            else {
                document.getElementById("where1").checked = true;
                $(".from_where").css("display", "block");
            }

            console.log("sick:" + data.objects[0].sick);
            if (data.objects[0].sick.text == "是") {
                document.getElementById("sick1").checked = true;
            }
            else {
                document.getElementById("sick0").checked = true;
            }

            console.log("self_management_start_date:" + data.objects[0].self_management_start_date);
            document.getElementById("start_date").value = data.objects[0].self_management_start_date;
        },
    });
};

function update() {
    var comeTime = $("#comeTime").val().replace("/\//g", "-");
    var leaveTime = $("#leaveTime").val().replace("/\//g", "-");
    var leaveProvince = $("#leaveProvince").val();
    var leaveCity = $("#leaveCity").val();
    if (document.getElementById("sick1").checked)
        sick = "是";
    else
        sick = "否";

    if (document.getElementById("where0").checked) {
        comeTime = "无";  
        leaveTime = "无";  
        leaveProvince = "无";  
        leaveCity = "无";  
    }

    var sJson = JSON.stringify({
        uid: $("#uid").val(),
        name: $("#name").val(),
        birth: $("#birth").val().replace("/\//g", "-"),
        phone: $("#phone").val(),
        comeTime: comeTime,
        leaveTime: leaveTime,
        leaveProvince: leaveProvince,
        leaveCity: leaveCity,
        start_date: $("#start_date").val().replace("/\//g", "-"),
        sick: sick
    });

    $.ajax({
        type: "POST",
        data: { "requestObject": sJson },
        dataType: "json",
        url: api_url + "/cyms/action_UpdateUserinformation.php",
        success: function (data) {
            alert("修改完成");
            console.log(data);
            location.reload();
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function modify() {
    document.getElementById("name").disabled = false
    document.getElementById("birth").disabled = false
    document.getElementById("phone").disabled = false
    document.getElementById("comeTime").disabled = false
    document.getElementById("leaveTime").disabled = false
    document.getElementById("leaveProvince").disabled = false
    document.getElementById("leaveCity").disabled = false
    document.getElementById("where1").disabled = false
    document.getElementById("where0").disabled = false
    // document.getElementById("start_date").disabled = false
    document.getElementById("sick1").disabled = false
    document.getElementById("sick0").disabled = false
    console.log("disable");
}