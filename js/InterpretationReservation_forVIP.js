// 取得get資訊 start
// function getValue(varname){
//     var url = window.location.href;
//     var qparts = url.split("?");
//     if (qparts.length == 0){return "";}
//     var query = qparts[1];
//     var vars = query.split("&");
//     var value = "";
//     for (i=0; i<vars.length; i++)
//     {
//       var parts = vars[i].split("=");
//       if (parts[0] == varname)
//       {
//         value = parts[1];
//         break;
//       }
//     }
//     value = unescape(value);
//     value.replace(/\+/g," ");
//     return value;
//   }
// 取得get資訊 end

// 初始給值 start
var hid;
var json;
window.onload = function () {
    // hid = getValue("hid");
    $("#time_select").hide();
    $(".choose_time").hide();

    querytime();

    //$(".choose_time").hide();
    // $(".person_message").hide();
    // $(".sel_time").hide();
}
// $(document).ready(function () {
//     //取可预约和約滿日期
//     $.ajax({
//         url: api_url + "/cyms/return_health_check_reservation_date.php",
//         type: "GET",
//         cache: false,
//         async: false,
//         dataType: "json",
//         success: function (data) {
//             console.log(data.objects);//取出物件長度  
//             json = data.objects[0];
//             var reservation = json.reservation;
//         }
//     });

// });
// 初始給值 end


// 取得 可预约 約滿 之日期 start
$.ajax({
    url: api_url + "/cyms/return_interpretation_reservation_forvip_date.php",
    type: "GET",
    cache: false,
    async: false,
    dataType: "json",
    success: function (data) {
        console.log(data.objects);//取出物件長度  
        json = data.objects[0];
    }
});
//可预约
var reservation = json.reservation;
var strs = new Array();
strs = reservation.split("&");
var strsSum = strs.length;
var healthCheckDateAppend = '';
for (var i = 0; i < strsSum; i++) {
    healthCheckDateAppend += '<li>' + strs[i] + '</li>';
}
$("#reservableDate").append(healthCheckDateAppend);

//約滿 
var unreservableDate = json.unreservableDate;
if (unreservableDate != null) {
    strs = new Array();
    strs = unreservableDate.split("&");
    strsSum = strs.length;
    healthCheckDateAppend = '';
    for (var i = 0; i < strsSum; i++) {
        healthCheckDateAppend += '<li>' + strs[i] + '</li>';
    }
    $("#unreservableDate").append(healthCheckDateAppend);
}
// 取得 可预约 約滿 之日期 end 

//製作日曆 start
const nowYear = new Date().getFullYear()
const nowMonth = new Date().getMonth()

var curYear;
var curMonth;
var monthArray = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
$(document).ready(function () {
    toToday();
});

// 页面根据每个月显示不同的日历
function drawRili(year, month) {
    $("#monthText").html(year + "年 " + monthArray[month]);
    var monthStr = month + "";
    if (month <= 8) {
        monthStr = "0" + (month + 1);
    } else {
        monthStr = "" + (month + 1);
    }
    var riliDateFirst = year + "-" + monthStr + "-" + "01";

    var riliDate = new Date(riliDateFirst);
    var weekNum = riliDate.getDay();//星期几
    month = parseInt(month, 10) + 1;
    var maxDayDate = new Date(year, month, 0);
    var maxDay = maxDayDate.getDate();
    $(".date_nr_ul").empty();
    for (var i = 0; i < (maxDay + weekNum); i++) {
        if (i < weekNum) {
            $(".date_nr_ul").append("<li>&nbsp;</li>");
        } else {
            var dayNum = i - weekNum + 1;
            var text = dayNum + "";
            if (dayNum <= 9) {
                text = "0" + dayNum;
            }
            $(".date_nr_ul").append("<li id='day_" + dayNum + "'>" + text + "</li>");
        }
    }
    //setYueman(28);
    //读取可预约日期
    var datePrefix = year + "-" + monthStr;
    $("#reservableDate").find('li').each(function (index, liEl) {
        var resDate = $(this).html();
        if (resDate.indexOf(datePrefix) >= 0) {
            var dayNum = parseInt(resDate.replace(datePrefix + "-", ""));
            setKeyue(dayNum);
        }
    });
    //讀取約滿的日期
    $("#unreservableDate").find('li').each(function (index, liEl) {
        var resDate = $(this).html();
        if (resDate.indexOf(datePrefix) >= 0) {
            var dayNum = parseInt(resDate.replace(datePrefix + "-", ""));
            setYueman(dayNum);
        }
    });
}
function preMonth() {
    if (curMonth == 0) {
        curYear = curYear - 1;
        curMonth = 11;
    } else {
        curMonth = curMonth - 1;
    }
    if (curMonth == nowMonth && curYear == nowYear) {
        toToday()
    } else {
        drawRili(curYear, curMonth);
    }
}
function nextMonth() {
    if (curMonth == 11) {
        curYear = curYear + 1;
        curMonth = 0;
    } else {
        curMonth = curMonth + 1;
    }
    if (curMonth == nowMonth && curYear == nowYear) {
        toToday()
    } else {
        drawRili(curYear, curMonth);
    }
}

//获取今天日期
function toToday() {
    var mydate = new Date();
    curYear = mydate.getFullYear(); //获取完整的年份(4位,1970-????)
    curMonth = mydate.getMonth(); //获取当前月份(0-11,0代表1月)

    drawRili(curYear, curMonth);
    //标识当前日期
    var curDay = mydate.getDate();
    var curDayEl = $("#day_" + curDay);
    var text = curDay + "";
    if (curDay <= 9) {
        text = "0" + curDay;
    }

    var dayStr = getCurDate(text);
    const today = curDayEl.children().hasClass('data_bgcol')
    if (today) {
        curDayEl.empty();
        curDayEl.append("<a  class='data_bgcol2'>" + text + "</a>");
    } else {
        curDayEl.empty();
        curDayEl.append("<a class='data_bgcol2'>" + text + "</a>");
    }

}
function getCurDate(dayNum) {
    var curDay = dayNum + "";
    if (dayNum <= 9) {
        curDay = "0" + dayNum;
    }
    var monthStr = curMonth + "";
    if (curMonth <= 8) {
        monthStr = "0" + (curMonth + 1);
    } else {
        monthStr = "" + (curMonth + 1);
    }
    var dayStr = curYear + "-" + monthStr + "-" + curDay;
    return dayStr;
}
//約滿
function setYueman(dayNum) {
    var curDayEl = $("#day_" + dayNum);
    var curDay = dayNum + "";
    if (dayNum <= 9) {
        curDay = "0" + dayNum;
    }
    var dayStr = getCurDate(dayNum);
    curDayEl.empty();
    curDayEl.append("<a class='data_bgcol3'>" + curDay + "<span>约满</span></a>");
}
//可预约
function setKeyue(dayNum) {
    var curDayEl = $("#day_" + dayNum);
    var curDay = dayNum + "";
    if (dayNum <= 9) {
        curDay = "0" + dayNum;
    }
    var dayStr = getCurDate(dayNum);
    curDayEl.empty();
    curDayEl.append("<a href=\"javascript:getDetailByDate('" + dayStr + "')\" class='data_bgcol'>" + curDay + "<span>可约</span></a>");
}
//按下日期跳轉
function getDetailByDate(selectedDate) {
    // window.location.href = 'healthCheck4.html?selectedDate=' + selectedDate + '&hid=' + hid;
    //alert("hello");
    //$(".choose_time").hide();
    //隐藏月历
    //document.getElementById("calender").style.display = 'block';
    $(".choose_time").show();
    $("#time_select").show();
    $("#time_select").empty();
    //显示选择日其
    document.getElementById("selectday").innerHTML = selectedDate;

    querytime(selectedDate);
}
//製作日曆 end

//显示预约时段
function querytime(selectedDate) {
    time_slot_index = Array();//存取被预约的index

    //資料庫抓資料
    //alert(time);//时段
    //alert(division);


    var sJson = JSON.stringify({
        sel_date: selectedDate
    });
    $.ajax({
        url: api_url + "/cyms/return_interpretation_reservation_forvip_time.php",   //存取Json的網址   
        data: { "requestObject": sJson },
        type: "POST",
        cache: false,
        dataType: 'json',
        success: function (data) {
            console.log(data.objects);//拿到哪些时段已被预约
            for (var i = 0; i < data.objects.length; i++) {
                time_slot_index.push(data.objects[i].time_select);
            }

            //alert(time);

            time_slot = Array('13:30至14:00', '14:00至14:30', '14:30至15:00', '15:00至15:30', '15:30至16:00', '16:00至16:30');
            //$("time_select").empty();

            for (var i = 0; i < time_slot.length; i++) {
                $("#time_select").append('<input id="time_slot_' + (i) + '" style="margin: 10px" type="radio" name="location" value="' + (i) + '"><label style="font-size: 3.7vmax;;" for="time_slot_' + i + '" id="l_time_slot_' + (i) + '">' + time_slot[i] + '</label><br>');
            }
            //disable以选取的时间
            for (var i = 0; i < time_slot_index.length; i++) {
                var id = "time_slot_" + time_slot_index[i];
                var label_id = "l_time_slot_" + time_slot_index[i];
                document.getElementById(id).setAttribute("disabled", "true");
                document.getElementById(label_id).style.color = "#8080804d";
                document.getElementById(label_id).innerHTML = time_slot[time_slot_index[i]] + '(已约)';
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });
}

function check_time() {
    time_slot = Array('13:30至14:00', '14:00至14:30', '14:30至15:00', '15:00至15:30', '15:30至16:00', '16:00至16:30');
    var mes = $("input[type='radio']:checked").val();
    if (mes == undefined) {
        $("#mal_selectDate").hide();
        $("#mal_selectTime").hide();
        $("#reser_btn").hide();
        $("#alertmessage").show();
        document.getElementById("alertmessage").innerHTML = '尚未选取时段';

    } else {
        $("#mal_selectDate").show();
        $("#mal_selectTime").show();
        $("#alertmessage").hide();
        $("#reser_btn").show();
        document.getElementById("mal_selectDate").innerHTML = '预约日期: ' + document.getElementById("selectday").innerHTML;
        document.getElementById("mal_selectTime").innerHTML = '预约时段: ' + time_slot[$("input[type='radio']:checked").val()];
    }
}

function real_check() {
    var time_index = $("input[type='radio']:checked").val();
    var sel_date = document.getElementById("selectday").innerHTML;


    var sJson = JSON.stringify({
        time_index: time_index,
        sel_date: sel_date,
        uid: getLocalStorageItem("patient_uid")
    });
    $.ajax({
        url: api_url + "/cyms/insert_interpretation_reservation_forvip.php",   //存取Json的網址   
        data: { "requestObject": sJson },
        type: "POST",
        cache: false,
        dataType: 'json',
        success: function (data) {
            console.log(data.objects[0]);
            if (data.objects[0].check == true) {
                showSusses();//尚未被预约
                find_openid(getLocalStorageItem("patient_uid"), time_index, sel_date);
            } else if (data.objects[0].check == "repeat") {
                showrepeat();//重复预约
            } else {
                showfail();//已被预约
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
    $("#mal_selectDate").hide();
    $("#mal_selectTime").hide();
    $("#alertmessage").show();
    document.getElementById('alertmessage').innerHTML = "预约成功 ";
    $('#exampleModalBtn').empty();
    $('#exampleModalBtn').append('<button type="button" style="background: #247724;" class="btn" onclick="window.location.href=' + "'Home.html'" + '">确定</button>');
}

function showfail() {
    $("#mal_selectDate").hide();
    $("#mal_selectTime").hide();
    $("#alertmessage").show();
    document.getElementById('alertmessage').innerHTML = "此时段已在刚刚被预约，请选择其它时段 ";
    $('#exampleModalBtn').empty();
    $('#exampleModalBtn').append('<button type="button" style="background: #247724;" class="btn" onclick="window.location.href=' + "'InterpretationReservation_forVIP.html'" + '">确定</button>');
}
function showrepeat() {
    $("#mal_selectDate").hide();
    $("#mal_selectTime").hide();
    $("#alertmessage").show();
    document.getElementById('alertmessage').innerHTML = "您于今日已有预约";
    $('#exampleModalBtn').empty();
    $('#exampleModalBtn').append('<button type="button" style="background: #247724;" class="btn" onclick="window.location.href=\'userCheck.html\'">确定</button>');
}
function find_openid(uid, time_index, sel_date) {
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
            if (data.objects.length > 0) {
                var openid = data.objects[0].openid;
                submit(openid, time_index, sel_date);
            }

        },
        error: function (xhr, textStatus, thrownError) {
            //alert(textStatus);
        }
    });
}
function submit(openid, time_index, sel_date) {
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
    time_slot = Array('13:30至14:00', '14:00至14:30', '14:30至15:00', '15:00至15:30', '15:30至16:00', '16:00至16:30');
    //處理日期要 2019年09月01日
    sel_date_temp = sel_date.split('-');
    sel_date_formate = sel_date_temp[0] + '年' + sel_date_temp[1] + '月' + sel_date_temp[2] + '日';
    var time = time_slot[time_index];
    var openid = openid;
    //var msg = "您好！您已成功预约" + sel_date_formate + " " + time + " 尊荣解读预约，特此提醒!如有疑问请致电025-52238800-5500，明基国际医疗中心关心您！"
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
                    "value": "解读预约",
                    "color": "#173177"
                },
                "keyword2": {
                    "value": sel_date_formate + " " + time,
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
        dataType: "json",
        aync: false,
        cache: false,
        success: function (data) {
            if (data.status === 0) {
                console.log("success");
            }
            else {
                console.log("error");
            }
        },
        error: function (xhr, textStatus, thrownError) {
            console.log(textStatus);
        }
    });

};