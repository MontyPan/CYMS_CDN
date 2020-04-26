
// 取得健檢人數 start
var json;
$.ajax({
    url: api_url + "/cyms/return_health_check_time.php",
    type: "GET",
    cache: false,
    async: false,
    dataType: "json",
    success: function (data) {
        console.log(data.objects);//取出物件長度  
        json = data.objects;
    }
});
var healthCheckPeopleAppend = '';
for (var i = 0; i < json.length; i++) {
    healthCheckPeopleAppend += '<input style="margin: 10px" type="radio" name="People" value="' + json[i].htid + '" id="htid_' + json[i].htid + '"><label for="htid_' + json[i].htid + '">' + json[i].time + '</label><br>';
}
$("#healthCheckPeople").append(healthCheckPeopleAppend);
// 取得健檢人數 end

//取得用戶訊息start
var sJson = JSON.stringify({
    uid: getLocalStorageItem("uid")
});
var Uname = getLocalStorageItem("name");
var Uphone = getLocalStorageItem("patient_phone");
var Uid_number = getLocalStorageItem("patient_ID");
var Ugender = getLocalStorageItem("gender");
// $.ajax({
//     url: api_url + "/cyms/return_user_information.php",   //存取Json的網址
//     data: { "requestObject": sJson },
//     type: "POST",
//     cache: false,
//     dataType: 'json',
//     success: function (data) {
//         console.log(data.objects[0]);
//         Uname= data.objects[0].name;
//         Uphone=data.objects[0].phone;
//     },
//     error: function (xhr, ajaxOptions, thrownError) {
//         alert(xhr.status);
//         alert(thrownError);
//     }
// });
//取得用戶訊息 end

// 取得get資訊 start
function getValue(varname) {
    var url = window.location.href;
    var qparts = url.split("?");
    if (qparts.length == 0) { return ""; }
    var query = qparts[1];
    var vars = query.split("&");
    var value = "";
    for (i = 0; i < vars.length; i++) {
        var parts = vars[i].split("=");
        if (parts[0] == varname) {
            value = parts[1];
            break;
        }
    }
    value = unescape(value);
    value.replace(/\+/g, " ");
    return value;
}
// 取得get資訊 end

// 初始給值 start
var selectedDate;
var hid;
var ahid;
var xhid;
var ahid_info;
var hid_info;
var xhid_info;
var uid;
var total_price = 0;
window.onload = function () {
    uid = getLocalStorageItem("patient_uid");
    selectedDate = getValue("selectedDate");
    hid = getValue("hid");
    ahid = getValue("addItem");
    xhid = getValue("xItem");
    document.getElementById('selectTime').innerHTML = selectedDate;
    $("#check_reservation2").css("display", "none");
    set_HealthCheckName();
}
// 初始給值 end

//取得當次健檢套餐項目資訊 start
function set_HealthCheckName() {
    var sJson = JSON.stringify({
        choose: 1,
        hid: hid
    });
    //取套餐 名稱.價錢.簡介
    $.ajax({
        url: api_url + "/cyms/return_health_check_oneSet.php",
        type: "POST",
        cache: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects);
            hid_info = data.objects;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
    //附加項目
    if (ahid) {
        var addJson = JSON.stringify({
            choose: 2,
            ahid: ahid
        });
        $.ajax({
            url: api_url + "/cyms/return_health_check_addItem.php",
            type: "POST",
            cache: false,
            data: { "requestObject": addJson },
            dataType: "json",
            success: function (data) {
                console.log(data.objects);
                ahid_info = data.objects;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    }
    //X套餐
    if (xhid) {
        var sJson = JSON.stringify({
            choose: 2,
            xhid: xhid
        });
        //取套餐 名稱.價錢.簡介
        $.ajax({
            url: api_url + "/cyms/return_health_check_oneSet.php",
            type: "POST",
            cache: false,
            data: { "requestObject": sJson },
            dataType: "json",
            success: function (data) {
                console.log(data.objects);
                xhid_info = data.objects;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });

    }
}
//取得當次健檢套餐項目資訊 end

// 按下"下一步"傳值 start
function Next() {
    var check = checkInfo(1);
    if (check == false) {
        showfunction();//跳出警告視窗
    }
    else {
        var People = $("input[name='People']:checked").next("label").text();//抓时段
        var noticeWay = $('input:radio[name="noticeWay"]:checked').next("label").text();//取得提醒方式
        var noticeTime = $('input:radio[name="noticeTime"]:checked').val();//取得提醒時間
        var healthCheckInfoAppend = '';
        healthCheckInfoAppend += '<li class="contentList"><strong>预约时间：</strong>' + selectedDate + ' ' + People + '</li>';
        // healthCheckInfoAppend += '<li class="contentList"><strong>提醒设置：</strong>提前' + noticeTime + '分钟 ' + noticeWay + '提醒</li>';
        healthCheckInfoAppend += '<li class="contentList"><strong>预约内容：</strong>' + hid_info[0].name + '</li>';
        total_price = parseFloat(hid_info[0].price);
        if (ahid_info) {
            healthCheckInfoAppend += '<li class="contentList"><strong>附加项目内容：</strong>' + ahid_info[0].content;
            total_price = parseFloat(hid_info[0].price) + parseFloat(ahid_info[0].price);
            for (var i = 1; i < ahid_info.length; i++) {
                healthCheckInfoAppend += '、' + ahid_info[i].content;
                total_price += parseFloat(ahid_info[i].price);
            }
            healthCheckInfoAppend += '</li>';
        }
        if (xhid_info) {
            healthCheckInfoAppend += '<li class="contentList"><strong>"X"专项选择：</strong>' + xhid_info[0].name;
            total_price = total_price + parseFloat(xhid_info[0].price);
            for (var i = 1; i < xhid_info.length; i++) {
                healthCheckInfoAppend += '、' + xhid_info[i].name;
                total_price += parseFloat(xhid_info[i].price);
            }
            healthCheckInfoAppend += '</li>';
        }
        healthCheckInfoAppend += '<li class="contentList"><strong>总金额：</strong><light> ¥' + total_price + '</li>';
        $("#info").append(healthCheckInfoAppend);
        $("#check_reservation1").css("display", "none");//隱藏輸入提醒訊息
        $("#check_reservation2").css("display", "block");//顯示確定预约
    }
}
// 按下"下一步"傳值  end

//警告視窗 start
function showfunction() {
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "警告";
    $('#modal-body').append('输入资料尚未完整');
    $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>');
    $("#exampleModalLong").modal("show");
};
//警告視窗 end

//再次確認視窗 start
function showAgainfunction() {

    if (checkInfo(1) == false || checkInfo(2) == false) {
        showfunction();//跳出警告視窗
    }
    else {
        var healthCheckInfoAppend = '';
        //取资料
        var People = $("input[name='People']:checked").next("label").text();//抓时段
        var noticeWay = $('input:radio[name="noticeWay"]:checked').next("label").text();//取得提醒方式
        var noticeTime = $('input:radio[name="noticeTime"]:checked').val();
        var name = getLocalStorageItem("name");
        var phone = getLocalStorageItem("phone");
        var id_number = getLocalStorageItem("ID");

        healthCheckInfoAppend += '<li class="contentList"><strong>预约时间：</strong>' + selectedDate + ' ' + People + '</li>';
        // healthCheckInfoAppend += '<li class="contentList"><strong>提醒设置：</strong>提前' + noticeTime + '分钟 ' + noticeWay + '提醒</li>';
        healthCheckInfoAppend += '<li class="contentList"><strong>预约内容：</strong>' + hid_info[0].name + '</li>';
        if (ahid_info) {
            healthCheckInfoAppend += '<li class="contentList"><strong>附加项目内容：</strong>' + ahid_info[0].content;
            for (var i = 1; i < ahid_info.length; i++) {
                healthCheckInfoAppend += '、' + ahid_info[i].content;
            }
            healthCheckInfoAppend += '</li>';
        }
        if (xhid_info) {
            healthCheckInfoAppend += '<li class="contentList"><strong>"X"专项选择：：</strong>' + xhid_info[0].name;
            for (var i = 1; i < xhid_info.length; i++) {
                healthCheckInfoAppend += '、' + xhid_info[i].name;
            }
            healthCheckInfoAppend += '</li>';
        }
        healthCheckInfoAppend += '<li class="contentList"><strong>总金额：</strong><light> ¥' + total_price + '</li>';
        healthCheckInfoAppend += '<li class="contentList"><strong>姓名:</strong>' + Uname + '</li>';
        healthCheckInfoAppend += '<li class="contentList"><strong>身份证:</strong>' + Uid_number + '</li>';
        healthCheckInfoAppend += '<li class="contentList"><strong>电话:</strong>' + Uphone + '</li>';
        //跳出确认视窗
        $('#modal-body').empty();
        $('#exampleModalBtn').empty();
        document.getElementById('exampleModalLongTitle').innerHTML = "请再次确认发出";
        $('#modal-body').append(healthCheckInfoAppend);
        $('#exampleModalBtn').append('<button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>' +
            '<button type="button" class="btn btn-primary" data-dismiss="modal"onclick="Reservation(1)">确定</button>');
        $("#exampleModalLong").modal("show");
    }

};
//再次確認視窗 end


//點選更改 start
function change() {
    $("#info").empty();
    $("#check_reservation1").css("display", "block");//顯示輸入提醒訊息
    $("#check_reservation2").css("display", "none");//隱藏確定预约
}
//點選更改 end

//按下预约 start
function Reservation(choose) {
    var check;
    var People = $('input:radio[name="People"]:checked').val();//取得時段
    var noticeWay = $('input:radio[name="noticeWay"]:checked').val();//取得提醒方式
    var noticeTime = $('input:radio[name="noticeTime"]:checked').val();//取得提醒時間

    var sJson = JSON.stringify({
        hid: hid,
        uid: uid,
        Rtime: People,
        Rdate: selectedDate,
        way: noticeWay,
        waytime: noticeTime,
        name: Uname,
        phone: Uphone,
        id_number: Uid_number,
        ahid: ahid,
        xhid: xhid,
        total_price: total_price,
        choose:choose //1是檢查 2是已付費新增
    });
    $.ajax({
        url: "http:///jkgl.cymsimc.com/cyms/insert_health_check_reservation.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects[0]);
            check = data.objects[0].check;

            //檢查->支付
            if(choose==1){
                if (data.objects[0].check == true) {
                    createWxPayOrder(hid_info[0].name,total_price);
                }
                else if (data.objects[0].check == "repeat") {
                    showError("repeat");
                }
                else {
                    showError("error");
                }
            }
            //新增->推播
            else if(choose==2){
                if (data.objects[0].check == true) {
                    find_openid(getLocalStorageItem("patient_uid"));
                    showSusses();
                }
                else {
                    showError("error");
                }
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });

}
//按下预约 end

//预约成功跳视窗 start
function showSusses() {
    //显示预约成功 跳回主页
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "信息";
    $('#modal-body').append('健检预约成功!');
    $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" onclick="window.location.href=' + "'Home.html'" + '">确定</button>');
    $("#exampleModalLong").modal("show");
}
//预约成功跳视窗 end

//錯誤視窗 start
function showError(data) {
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "错误";
    if (data == "repeat") {
        $('#modal-body').append('很抱歉!您当天已预约过，请重新选择');
    }
    else {
        $('#modal-body').append('很抱歉!此时段已额满，请重新选择');
    }
    $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="window.location.href=' + "'healthCheck3.html?hid=" + hid + "'" + '">确定</button>');
    $("#exampleModalLong").modal("show");
};
//錯誤視窗 end

//检查资料完整 start
function checkInfo(checkPart) {
    var People = $('input:radio[name="People"]:checked').val();//取得時段
    var noticeWay = $('input:radio[name="noticeWay"]:checked').val();//取得提醒方式
    var noticeTime = $('input:radio[name="noticeTime"]:checked').val();//取得提醒時間

    if (checkPart == 1) {
        if (People == null || noticeWay == null || noticeTime == null || People == undefined || noticeWay == undefined || noticeTime == undefined) {
            return false;
        }
        else {
            return true;
        }
    }
    else if (checkPart == 2) {
        if (Uname == "" || Uphone == "" || Uid_number == "" || Uname == undefined || Uphone == undefined || Uid_number == undefined) {
            return false;
        }
        else {
            return true;
        }
    }
}
//检查资料完整 end

//推播 start
function find_openid(uid) {
    var uid = uid;
    var sJson = JSON.stringify
        ({
            uid: uid
        });
    $.ajax({
        type: "POST",
        url: api_url + "/cyms/return_user_openid.php",
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            // alert(data);
            if (data.objects.length > 0) {
                var openid = data.objects[0].openid;
                submit(openid);
            }

        },
        error: function (xhr, textStatus, thrownError) {
            alert(textStatus);
        }
    });
}
function submit(openid) {
    //凑信息
    var time = selectedDate + " " + $("input[name='People']:checked").next("label").text();//抓时段
    var openid = openid;
    var first = "";
    if (Ugender == "M") {
        first = "尊敬的" + Uname + "先生您好!您已成功预约:"
    }
    else {
        first = "尊敬的" + Uname + "女士您好!您已成功预约:"
    }

    var msg = "";
    msg += hid_info[0].name;
    if (xhid_info) {
        msg += "•'X'专项选择：" + xhid_info[0].name;
        for (var i = 1; i < xhid_info.length; i++) {
            msg += "、" + xhid_info[i].name;
        }
    }
    if (ahid_info) {
        msg += "•附加项目内容：" + ahid_info[0].content;
        for (var i = 1; i < ahid_info.length; i++) {
            msg += "、" + ahid_info[i].content;
        }
    }
    //接token
    // var token = "";
    // $.ajax({
    //     type: "GET",
    //     url: api_url + "/wechat/cyms/chat/getToken.php",
    //     cache: false,
    //     async: false,
    //     dataType: "text",
    //     success: function (data) {
    //         token = data;
    //     },
    //     error: function (xhr, textStatus, thrownError) {
    //         console.log(textStatus);
    //     }
    // });

    //预约成功通知
    var sJson = JSON.stringify
        ({
            touser: openid,
            template_id: "SPGk__ktWmGFHgYqniTRQ-gT1p0eM5fKZnjfIAFcG6g",
            topcolor: "#FF0000",
            data: {
                first: {//開頭
                    value: first,
                    color: "#173177"
                },
                keyword1: {//預約內容
                    value: msg,
                    color: "#173177"
                },
                keyword2: {//預約時間
                    value: time,
                    color: "#173177"
                },
                keyword3: {//預約人
                    value: Uname,
                    color: "#173177"
                },
                keyword4: {//預約人電話
                    value: Uphone,
                    color: "#173177"
                },
                keyword5: {
                    value: "明基国际医疗中心",
                    color: "#173177"
                },
                remark: {
                    value: "如有疑问请致电025-52238800-5500，明基国际医疗中心关心您！",
                    color: "#173177"
                }
            }

        });

    $.ajax({
        type: "POST",
        url: api_url + "/wechat/cyms/chat/sendMessageTemplete.php",
        data: sJson,
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.status === 0) {
                //alert("success");
            }
            else {
                //alert("error");
            }
        },
        error: function (xhr, textStatus, thrownError) {
            console.log(textStatus);
        }
    });

};
//推播 end


//付費訂單 start
var showCreateOrderModal = function() {
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "支付提醒";
    $('#modal-body').append('支付订单建立中，请稍等，谢谢！');
    $("#exampleModalLong").modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#exampleModalLong').data('bs.modal').options.backdrop = 'static';
};
var createWxPayOrder = function(item,itemprice) {
    showCreateOrderModal();
    var sJson = JSON.stringify
    ({
        uid: uid,
        body: "南京明基健康管家--"+item,
        total_fee: itemprice*100
    });
    $.ajax({
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        url: api_url + "/wechat/cyms/wxpay/CreateOrder.php",
        success: function (data) {
            if(data.success === 200) {
                prepay_id = data.prepay_id;
                getWxPayOrder(prepay_id);
            }
        },
    });
};
var getWxPayOrder = function(prepay_id) {
    var sJson = JSON.stringify
    ({
        uid: getLocalStorageItem("uid"),
        prepay_id: prepay_id
    });
    $.ajax({
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        url: api_url + "/wechat/cyms/wxpay/GetOrder.php",
        success: function (data) {
            console.log(data);
            if(data.success === 200) {
                var data = data.data;
                if (typeof WeixinJSBridge == "undefined") {
                    console.log("undefined onBridgeReady");
                    if(document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    }
                    else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                }
                else {
                    console.log("call onBridgeReady");
                    $("#exampleModalLong").modal("hide");
                    onBridgeReady(data.appId, data.timeStamp, data.nonceStr, data.package, data.signType, data.paySign);
                }
            }

            
        },
    });
};

function onBridgeReady(appId, timeStamp, nonceStr, package, signType, paySign){
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId": appId,     //公众号名称，由商户传入     
            "timeStamp": timeStamp,         //时间戳，自1970年以来的秒数     
            "nonceStr": nonceStr, //随机串     
            "package": package,     
            "signType": signType,         //微信签名方式：     
            "paySign": paySign //微信签名 
        },
        function(res){
        if(res.err_msg == "get_brand_wcpay_request:ok" ){
			//進去預約
            Reservation(2);
        }
    }); 
}
//付費訂單 end





