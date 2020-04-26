function Request() {
    var url = location.href;

    //再來用去尋找網址列中是否有資料傳遞(QueryString)
    if (url.indexOf('?') != -1) {
        //doctor_name, date, time, division, room;//醫師名 日期 上午下午诊 科別
        //在此直接將各自的參數資料切割放進ary中
        var ary = url.split('?')[1].split('&');
        //下迴圈去搜尋每個資料參數
        for (i = 0; i <= ary.length - 1; i++) {
            //如果資料名稱為id的話那就把他取出來
            if (ary[i].split('=')[0] == 'doctor_name') {
                doctor_name = decodeURI(ary[i].split('=')[1]);
            } else if (ary[i].split('=')[0] == 'Date') {
                date = decodeURI(ary[i].split('=')[1]);
            } else if (ary[i].split('=')[0] == 'time') {
                time = decodeURI(ary[i].split('=')[1]);
            } else if (ary[i].split('=')[0] == 'division') {
                division = decodeURI(ary[i].split('=')[1]);
            }
            // else if (ary[i].split('=')[0] == 'room') {
            //     room = decodeURI(ary[i].split('=')[1]);
            // }
        }

    }
    //alert(doctor_name);
    //alert(date);
    //alert(time);
    //alert(division);
    document.getElementById('select_division').innerHTML = "预约科别: " + division;//+ ' <br>诊间: ' + room;
    document.getElementById('select_doctor').innerHTML = "预约医生: " + doctor_name;
    document.getElementById('selectDate').innerHTML = "预约时间: " + date + " <br>时段: " + time;
    //querytime();


}
window.onload = function () {
    //querytime();
    Request();
    $("#time_select").empty();
    querytime();
    $(".reservation_message").hide();
    $(".person_message").hide();
    $(".sel_time").hide();

}
//显示预约的时间
function querytime() {
    morning_index = Array();//存取被预约的index
    afternoon_index = Array();//存取被预约的index
    night_index = Array();//存取被预约的index
    //這裡還須從資料庫抓資料
    var sel_date = date.split(' ')[0].replace(/\//g, "-");

    sel_date_temp = sel_date.split('-');
    if (sel_date_temp[1] < 10) {
        sel_date_temp[1] = '0' + sel_date_temp[1];
    }
    if (sel_date_temp[2] < 10) {
        sel_date_temp[2] = '0' + sel_date_temp[2];
    }
    sel_date_formate = sel_date_temp[0] + '-' + sel_date_temp[1] + '-' + sel_date_temp[2];
    //alert(time);//时段
    //alert(division);
    var sJson = JSON.stringify({
        sel_date: sel_date_formate,
        division: division,
        sel_time: time
    });
    $.ajax({
        url: api_url + "/cyms/return_expert_time.php",   //存取Json的網址
        data: { "requestObject": sJson },
        type: "POST",
        cache: false,
        dataType: 'json',
        success: function (data) {
            console.log(data.objects);//拿到哪些时段已被预约
            for (var i = 0; i < data.objects.length; i++) {
                if (data.objects[i].type == '上午') {
                    morning_index.push(data.objects[i].time);
                }
                if (data.objects[i].type == '下午') {
                    afternoon_index.push(data.objects[i].time);
                }
                if (data.objects[i].type == '晚间') {
                    night_index.push(data.objects[i].time);
                }
            }

            //alert(time);
            morning = Array('8:00至08:30', '08:30至09:00', '09:00至09:30', '09:30至10:00', '10:00至10:30', '10:30至11:00', '11:00至11:30', '11:30至12:00');
            afternoon = Array('13:30至14:00', '14:00至14:30', '14:30至15:00', '15:00至15:30', '15:30至16:00', '16:00至16:30', '16:30至17:00');
            night = Array('17:30至18:00', '18:00至18:30', '18:30至19:00', '19:00至19:30', '19:30至20:00', '20:00至20:30');
            if (time == "上午") {
                if (division == "心理谘询") {
                    morning = ["8:00", "10:00"];
                }
                $("#time_select").empty();
                var check = 0;
                for (var i = 0; i < morning.length; i++) {
                    $("#time_select").append('<input id="morning_' + (i) + '" style="margin: 10px" type="radio" name="location" value="' + (i) + '"><label style="font-size: 3.7vmax;;" for="morning_' + i + '" id="l_morning_' + (i) + '">' + morning[i] + '</label><br>');
                }
                //disable以选取的时间
                for (var i = 0; i < morning_index.length; i++) {
                    var id = "morning_" + morning_index[i];
                    var label_id = "l_morning_" + morning_index[i];
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#808080";
                    document.getElementById(label_id).innerHTML = morning[morning_index[i]] + '(已约)';
                }
            }
            if (time == "下午") {
                $("#time_select").empty();
                var check = 0;
                for (var i = 0; i < afternoon.length; i++) {
                    $("#time_select").append('<input id="afternoon_' + (i) + '" style="margin: 10px" type="radio" name="location" value="' + (i) + '"><label style="font-size: 3.7vmax;;" for="afternoon_' + i + '" id="l_afternoon_' + (i) + '">' + afternoon[i] + '</label><br>');
                }
                //disable以选取的时间
                for (var i = 0; i < afternoon_index.length; i++) {
                    var id = "afternoon_" + afternoon_index[i];
                    var label_id = "l_afternoon_" + afternoon_index[i];
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#808080";
                    document.getElementById(label_id).innerHTML = afternoon[afternoon_index[i]] + '(已约)';
                }

            }
            if (time == "晚间") {
                $("#time_select").empty();
                var check = 0;
                for (var i = 0; i < night.length; i++) {
                    $("#time_select").append('<input id="night_' + (i) + '" style="margin: 10px" type="radio" name="location" value="' + (i) + '"><label style="font-size: 3.7vmax;;" for="night_' + i + '"id="l_night_' + (i) + '">' + night[i] + '</label><br>');
                }
                //disable以选取的时间
                for (var i = 0; i < night_index.length; i++) {
                    var id = "night_" + night_index[i];
                    var label_id = "l_night_" + night_index[i];
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#808080";
                    document.getElementById(label_id).innerHTML = night[night_index[i]] + '(已约)';
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });
}

function check_time() {

    if (time == "上午") {
        var mes = $("input[type='radio']:checked").val();
        if (mes == undefined) {
            alert("尚未选取时段");
        } else {
            document.getElementById("selectTime").innerHTML = '预约时段: ' + morning[$("input[type='radio']:checked").val()];
            $(".reservation_message").show();
            $(".person_message").show();
            $(".sel_time").show();
            $(".choose_time").hide();
        }
    }
    if (time == "下午") {
        var mes = $("input[type='radio']:checked").val();
        if (mes == undefined) {
            alert("尚未选取时段");
        } else {
            document.getElementById("selectTime").innerHTML = '预约时段: ' + afternoon[$("input[type='radio']:checked").val()];
            $(".reservation_message").show();
            $(".person_message").show();
            $(".sel_time").show();
            $(".choose_time").hide();
        }
    }
    if (time == "晚间") {
        var mes = $("input[type='radio']:checked").val();
        if (mes == undefined) {
            alert("尚未选取时段");
        } else {
            document.getElementById("selectTime").innerHTML = '预约时段: ' + night[$("input[type='radio']:checked").val()];
            $(".reservation_message").show();
            $(".person_message").show();
            $(".sel_time").show();
            $(".choose_time").hide();
        }
    }
}
function cho_time() {
    $(".reservation_message").hide();
    $(".person_message").hide();
    $(".sel_time").hide();
    $(".choose_time").show();
}
//按下预约
function reservation() {

    $("#reser_btn").show();
    document.getElementById('mal_select_division').innerHTML = "预约科别: " + division;
    document.getElementById('mal_select_doctor').innerHTML = "预约医生: " + doctor_name;
    document.getElementById('mal_selectDate').innerHTML = date + ' <br>' + document.getElementById("selectTime").innerHTML;

    var sJson = JSON.stringify({
        uid: getLocalStorageItem("patient_uid")
    });
    $.ajax({
        url: api_url + "/cyms/return_user_information.php",   //存取Json的網址
        data: { "requestObject": sJson },
        type: "POST",
        cache: false,
        dataType: 'json',
        success: function (data) {
            console.log(data.objects[0]);
            document.getElementById('mal_petientname').innerHTML = "名字:" + data.objects[0].name;
            document.getElementById('mal_petientphone').innerHTML = "电话:" + data.objects[0].phone;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });
}




function real_check() {
    //var input_name = document.getElementById('inputname').value;
    //var input_id = document.getElementById('input_ID').value;
    //var input_phone = document.getElementById('input_phone').value;
    //选取哪一时间index
    var time_index = $("input[type='radio']:checked").val();
    //alert($("input[type='radio']:checked").val());
    //选取医生名字
    //alert(document.getElementById('select_doctor').innerHTML.split(': ')[1]);
    var doctor_name = document.getElementById('select_doctor').innerHTML.split(': ')[1];
    //选取科别
    var branch = document.getElementById('select_division').innerHTML.split(': ')[1];
    //alert(document.getElementById('select_division').innerHTML.split(': ')[1]);
    //选取日其
    var sel_date = date.split(' ')[0].replace(/\//g, "-");

    //處理日期要 2019-07-01
    sel_date_temp = sel_date.split('-');
    if (sel_date_temp[1] < 10) {
        sel_date_temp[1] = '0' + sel_date_temp[1];
    }
    if (sel_date_temp[2] < 10) {
        sel_date_temp[2] = '0' + sel_date_temp[2];
    }
    sel_date_formate = sel_date_temp[0] + '-' + sel_date_temp[1] + '-' + sel_date_temp[2];

    //alert(date.split(' ')[0].replace(/\//g, "-"));
    //选取早中晚
    var mor_aft_nig = time.split(': ')[0];
    //alert(time.split(': ')[0]);


    var sJson = JSON.stringify({
        time_index: time_index,
        doctor: doctor_name,
        branch: branch,
        sel_date: sel_date_formate,
        mor_aft_nig: mor_aft_nig,
        input_id: getLocalStorageItem("patient_uid"),
        action: "check"
    });

    $.ajax({
        url: api_url + "/cyms/insert_expert_reservation.php",   //存取Json的網址
        data: { "requestObject": sJson },
        type: "POST",
        cache: false,
        async: false,
        dataType: 'json',
        success: function (data) {
            console.log(data.objects[0]);
            if (data.objects[0].check == true) {
                //串接微信支付- 找到醫師價格
                find_docter_fee(doctor_name);
                //showSusses();
                //發微信
                //find_openid(getLocalStorageItem("patient_uid"), doctor_name, sel_date, mor_aft_nig, branch, time_index);
            } else if (data.objects[0].check == "repeat") {
                showrepeat(doctor_name, sel_date, mor_aft_nig, branch);
            } else {
                showfail(doctor_name, sel_date, mor_aft_nig, branch);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });
}
//微信支付
function find_docter_fee(doctor_name){
    var fee=0;
    var sJson = JSON.stringify({
		name: doctor_name
	});
	$.ajax({
		url: api_url + "/cyms/return_expert_information.php",   //存取Json的網址   
		data: { "requestObject": sJson },
		type: "POST",
		cache: false,
		dataType: 'json',
		async:false,
		success: function (data) {
			console.log(data.objects);
			for (var i = 0; i < data.objects.length; i++) {
				if (data.objects[i].type == '6') {
                    fee = parseInt(data.objects[i].text);
                    //串微信支付
                    createWxPayOrder(fee);
				}
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			//alert(xhr.status);
			//alert(thrownError);
		}
	});
}
var createWxPayOrder = function(fee) {
    fee = fee*100;
    var sJson = JSON.stringify
    ({
        uid: getLocalStorageItem("patient_uid"),
        body: "南京明基健康管家-专家预约",
        total_fee: fee
    });
    $.ajax({
        type: "POST",
        data: { "requestObject": sJson },
        dataType: "json",
        async: false,
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
        data: { "requestObject": sJson },
        dataType: "json",
        async: false,
        url: api_url + "/wechat/cyms/wxpay/GetOrder.php",
        success: function (data) {
            console.log(data);
            $("#info").append(JSON.stringify(data) + "<br>");
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
            insert_reservation();
        }
    }); 
}
//微信支付結束

//確認insert 
function insert_reservation() {
    //选取哪一时间index
    var time_index = $("input[type='radio']:checked").val();
    //选取医生名字
    var doctor_name = document.getElementById('select_doctor').innerHTML.split(': ')[1];
    //选取科别
    var branch = document.getElementById('select_division').innerHTML.split(': ')[1];
    //选取日其
    var sel_date = date.split(' ')[0].replace(/\//g, "-");

    //處理日期要 2019-07-01
    sel_date_temp = sel_date.split('-');
    if (sel_date_temp[1] < 10) {
        sel_date_temp[1] = '0' + sel_date_temp[1];
    }
    if (sel_date_temp[2] < 10) {
        sel_date_temp[2] = '0' + sel_date_temp[2];
    }
    sel_date_formate = sel_date_temp[0] + '-' + sel_date_temp[1] + '-' + sel_date_temp[2];
    //选取早中晚
    var mor_aft_nig = time.split(': ')[0];
    var sJson = JSON.stringify({
        time_index: time_index,
        doctor: doctor_name,
        branch: branch,
        sel_date: sel_date_formate,
        mor_aft_nig: mor_aft_nig,
        input_id: getLocalStorageItem("patient_uid"),
        action: "insert"
    });

    $.ajax({
        url: api_url + "/cyms/insert_expert_reservation.php",   //存取Json的網址
        data: { "requestObject": sJson },
        type: "POST",
        cache: false,
        async: false,
        dataType: 'json',
        success: function (data) {
            console.log(data.objects[0]);
            if (data.objects[0].check == true) {
                showSusses();
                //發微信
                find_openid(getLocalStorageItem("patient_uid"), doctor_name, sel_date, mor_aft_nig, branch, time_index);
            } else if (data.objects[0].check == "repeat") {
                showrepeat(doctor_name, sel_date, mor_aft_nig, branch);
            } else {
                showfail(doctor_name, sel_date, mor_aft_nig, branch);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });

}
function showSusses() {
    //显示预约成功 跳回主页
    $('#mal_select_doctor').show();
    $('#mal_petientname').show();
    $('#mal_petientphone').show();

    document.getElementById('mal_select_division').innerHTML = "专家预约成功 ";
    document.getElementById('mal_select_doctor').innerHTML = "";
    document.getElementById('mal_selectDate').innerHTML = "";
    document.getElementById('mal_petientname').innerHTML = "";
    document.getElementById('mal_petientphone').innerHTML = "";
    $('#exampleModalBtn').empty();
    $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" onclick="window.location.href=' + "'Home.html'" + '">确定</button>');
}
function showfail(doctor_name, sel_date, mor_aft_nig, branch) {
    document.getElementById('mal_select_division').innerHTML = "此时段已在刚刚被预约，请选择其它时段 ";
    $('#mal_selectDate').hide();
    $('#mal_select_doctor').hide();
    $('#mal_petientname').hide();
    $('#mal_petientphone').hide();
    $('#exampleModalBtn').empty();
    $('#exampleModalBtn').append('<button type="button" style="background: #247724;" class="btn" onclick="window.location.href=' + "'Doctor_reservation.html?doctor_name=" + doctor_name + '&Date=' + sel_date + '&time=' + mor_aft_nig + '&division=' + branch + "'" + '">确定</button>');
}
function showrepeat(doctor_name, sel_date, mor_aft_nig, branch) {
    document.getElementById('mal_select_division').innerHTML = "您于今日此科别，已有预约，请勿重复预约 ";
    $('#mal_selectDate').hide();
    $('#mal_select_doctor').hide();
    $('#mal_petientname').hide();
    $('#mal_petientphone').hide();
    $('#exampleModalBtn').empty();
    $('#exampleModalBtn').append('<button type="button" style="background: #247724;" class="btn" onclick="window.location.href=\'userCheck.html\'">确定</button>');
}

function find_openid(uid, doctor_name, sel_date, mor_aft_nig, branch, time_index) {
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
        async: false,
        success: function (data) {
            if (data.objects.length > 0) {
                var openid = data.objects[0].openid;
                submit(openid, doctor_name, sel_date, mor_aft_nig, branch, time_index);
            }

        },
        error: function (xhr, textStatus, thrownError) {
            //alert(textStatus);
        }
    });
}
function submit(openid, doctor_name, sel_date, mor_aft_nig, branch, time_index) {
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
    //凑信息
    var sel_time;//时段
    morning = Array('8:00至08:30', '08:30至09:00', '09:00至09:30', '09:30至10:00', '10:00至10:30', '10:30至11:00', '11:00至11:30', '11:30至12:00');
    afternoon = Array('13:30至14:00', '14:00至14:30', '14:30至15:00', '15:00至15:30', '15:30至16:00', '16:00至16:30', '16:30至17:00');
    night = Array('17:30至18:00', '18:00至18:30', '18:30至19:00', '19:00至19:30', '19:30至20:00', '20:00至20:30');
    if (division == "心理谘询") {
        morning = ["8:00", "10:00"];
    }
    if (mor_aft_nig == "上午") {
        sel_time = morning[time_index];
    } else if (mor_aft_nig == "下午") {
        sel_time = afternoon[time_index];
    } else if (mor_aft_nig == "晚间") {
        sel_time = night[time_index];
    }
    //处理日期
    //處理日期要 2019年09月01日
    sel_date_temp = sel_date.split('-');
    if (sel_date_temp[1] < 10) {
        sel_date_temp[1] = '0' + sel_date_temp[1];
    }
    if (sel_date_temp[2] < 10) {
        sel_date_temp[2] = '0' + sel_date_temp[2];
    }
    sel_date_formate = sel_date_temp[0] + '年' + sel_date_temp[1] + '月' + sel_date_temp[2] + '日';
    var openid = openid;
    //var msg = "您好！您已成功预约" + sel_date_formate + " " + mor_aft_nig + " " + sel_time + " " + doctor_name + " " + branch + "门诊，特此提醒!如有疑问请致电025-52238800-5500，明基国际医疗中心关心您！"
    if (getLocalStorageItem("patient_gender") == "M") {
        var msg = "尊敬的" + getLocalStorageItem("patient_name") + "先生您好！您已成功预约:";
    } else if (getLocalStorageItem("patient_gender") == "F") {
        var msg = "尊敬的" + getLocalStorageItem("patient_name") + "女士您好！您已成功预约:";
    }
    var sJson = JSON.stringify
        ({
            "touser": openid,
            "template_id": "SPGk__ktWmGFHgYqniTRQ-gT1p0eM5fKZnjfIAFcG6g",
            "topcolor": "#FF0000",
            "data": {
                "first": {
                    "value": msg,
                    "color": "#173177"
                },
                "keyword1": {
                    "value": branch + " " + doctor_name,
                    "color": "#173177"
                },
                "keyword2": {
                    "value": sel_date_formate + " " + mor_aft_nig + " " + sel_time,
                    "color": "#173177"
                },
                "keyword3": {
                    "value": getLocalStorageItem("patient_name"),
                    "color": "#173177"
                },
                "keyword4": {
                    "value": getLocalStorageItem("patient_phone"),
                    "color": "#173177"
                },
                "keyword5": {
                    "value": "明基醫院尊容中心",
                    "color": "#173177"
                },
                "remark": {
                    "value": "如有疑问请致电025-52238800-5500，明基国际医疗中心关心您！",
                    "color": "#173177"
                }
            }
        }
        );

    $.ajax({
        type: "POST",
        url: api_url + "/wechat/cyms/chat/sendMessageTemplete.php",
        data: sJson,
        dataType: 'jsonp',
        aync: false,
        cache: false,
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, textStatus, thrownError) {
            console.log(textStatus);
            console.log(xhr);
        }
    });

};