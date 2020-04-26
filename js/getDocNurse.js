function load_DocNurse() {
    var sJson = JSON.stringify({
        //uid: getLocalStorageItem("uid")
        uid: 6//VIP
    });
    $.ajax({
        url: api_url + "/cyms/return_patients_nursedoctoroperator.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",

        success: function (data) {
            console.log(localStorage.getItem('uid'));

            for (var i = 0; i < data.objects.length; i++) {
                if (data.objects[i].role == 2)
                    $("#nurse").append("护士:" + data.objects[i].name);

                else if (data.objects[i].role == 3)
                    $("#doctor").append("医生:" + data.objects[i].name);

                else if (data.objects[i].role == 0 || data.objects[i].role == 1)
                    $("#operator").append("机构管理者: " + data.objects[i].name);
            }
        },
    });
};