function load_coupon() {
    var sJson = JSON.stringify({
        uid: getLocalStorageItem("uid")
        //uid: 6//VIP
    });
    $.ajax({
        url: "http://123.59.68.12/cyms/return_coupon.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",

        success: function (data) {
            console.log(localStorage.getItem('uid'));

            for (var i = 0; i < data.objects.length; i++) {
                //console.log(data.objects[i].coupon_name + data.objects[i].amount + data.objects[i].coupon_unit);

                for (var j = 0; j < i; j++) {
                    if (data.objects[j].coupon_id == data.objects[i].coupon_id) {
                        data.objects[j].amount = (parseInt)(data.objects[j].amount) + (parseInt)(data.objects[i].amount);
                    }
                }
            }

            var content = "<table style='table-layout: fixed; width:100%; border: solid; '><tr><th style='border: solid'>种类</th><th style='border: solid'>数量</th></tr>";

            for (var i = 0; i < data.objects.length; i++) {
                var temp = 0
                for (var j = 0; j < i; j++) {
                    if (data.objects[j].coupon_id == data.objects[i].coupon_id) {
                        temp = 1;
                    }
                }

                if (temp == 0) {
                    content += "<tr><td style='border: solid'>" + data.objects[i].coupon_name + "</td>" + "<td style='border: solid'>" + data.objects[i].amount + data.objects[i].coupon_unit + "</td></tr>";
                    console.log(data.objects[i].coupon_id + data.objects[i].coupon_name + data.objects[i].amount + data.objects[i].coupon_unit);
                }
            }
            content += "</table>";
            $("#coupon").append(content);
        },
    });
};
