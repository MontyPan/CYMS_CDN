// 初始給值 start
var hid;
var json;
window.onload = function () {
    // hid = getValue("hid");
    //$("#time_select").hide();
    //$(".choose_time").show();

    //$(".choose_date").hide();
    //querytime();

    //$(".choose_time").hide();
    // $(".person_message").hide();
    // $(".sel_time").hide();
    check_information_1();
}

// 初始給值 end
function getCalender(select_tag) {

    var sJson = JSON.stringify({
        selec_tag: select_tag
    });
    $.ajax({
        url: api_url + "/cyms/return_prenatal_checkup_date.php",
        type: "POST",
        data: { "requestObject": sJson },
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            console.log(data.objects); //取出物件長度  
            json = data.objects[0];
        }
    });
    var selec_tag = json.selec_tag;
    if (selec_tag == 0) {
        document.getElementById("select_nt_fourth").innerHTML = "请选择预约NT日期";
    } else if (selec_tag == 1) {
        document.getElementById("select_nt_fourth").innerHTML = "请选择预约四维日期";
    }
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
}
// 取得 可预约 約滿 之日期 start


//製作日曆 start
const nowYear = new Date().getFullYear()
const nowMonth = new Date().getMonth()

var curYear;
var curMonth;
var monthArray = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
$(document).ready(function () {
    //toToday();
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
    var weekNum = riliDate.getDay(); //星期几
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
function toToday(select_tag) {
    getCalender(select_tag);
    $(".choose_NT").hide();
    $(".choose_date").show();
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
    querytime(selectedDate);
}
//製作日曆 end
//一开始进入画面
function check_information_1() {
    $(".choose_information").show();
    $(".choose_date").hide();
    $(".choose_NT").hide(); //占时用于显示资讯
    $(".choose_time").hide();
}
//选取个人信息后
function check_information() {
    $(".choose_information").hide();
    $(".choose_time").hide();
    //$(".choose_date").show();
    //$(".choose_NT").show();
    var content = "";
    var weeknumber = document.getElementById('number_week').value;
    if (weeknumber == "") {
        alert("请输入孕期周数");
        $(".choose_information").show();
    } else if (weeknumber > 40) {
        alert("请输入正确孕期周数");
        $(".choose_information").show();
    } else {
        //NT OR 四维
        if (document.getElementById("single_child").checked == true && (weeknumber >= 22 && weeknumber <= 26)) {
            //alert("只有四维");
            toToday(1);
            // content +="<h2 style='font-size: 4vmax'>选择NT或四维</h2>";
            // content +="<div class='activity-row' style='padding: 10px 0px'>";
            // content +="<input id='select_NT' style='margin: 10px' type='radio' name='select_NT'checked='true' ><label style='font-size: 3vmax;' for='select_NT'>NT</label>";
            // content +="</div>";
            // content +="<div class='activity-row' style='padding: 10px 0px'><button type='button' class='btn' onclick='check_date()'style='background: #247724;width: 97%;font-size: 20px;color: #fff;letter-spacing: 2px;padding: 10px;border-radius: 7px;text-align: center;margin-left: 5px;margin-right: 5px;'>确认</button></div>";
            // content +="<div class='activity-row' style='padding: 10px 0px'><button type='button' class='btn' onclick='check_information_1()' style='background: #247724;width: 97%;font-size: 20px;color: #fff;letter-spacing: 2px;padding: 10px;border-radius: 7px;text-align: center;margin-left: 5px;margin-right: 5px;'>重新填写个人信息</button></div>";
            // $("#choose_NT").html(content);

        } else if (weeknumber >= 11 && weeknumber <= 20) {
            //alert("只有NT");
            toToday(0);
            // content +="<h2 style='font-size: 4vmax'>选择NT或四维</h2>";
            // content +="<div class='activity-row' style='padding: 10px 0px'>";
            // content +="<input id='select_NT' style='margin: 10px' type='radio' name='select_NT'checked='true' ><label style='font-size: 3vmax;' for='select_NT'>NT</label>";
            // content +="<input id='select_fourth' style='margin: 10px' type='radio' name='select_NT' ><label style='font-size: 3vmax;' for='select_fourth'>四维</label>";
            // content +="</div>";
            // content +="<div class='activity-row' style='padding: 10px 0px'><button type='button' class='btn' onclick='check_date()'style='background: #247724c;width: 97%;font-size: 20px;color: #fff;letter-spacing: 2px;padding: 10px;border-radius: 7px;text-align: center;margin-left: 5px;margin-right: 5px;'>确认</button></div>";
            // content +="<div class='activity-row' style='padding: 10px 0px'><button type='button' class='btn' onclick='check_information_1()' style='background: #247724;width: 97%;font-size: 20px;color: #fff;letter-spacing: 2px;padding: 10px;border-radius: 7px;text-align: center;margin-left: 5px;margin-right: 5px;'>重新填写个人信息</button></div>";
            // $("#choose_NT").html(content);    

        } else {
            $(".choose_NT").show();
            content += "<h2 style='font-size: 4vmax'>提醒</h2>";
            content += "<div class='activity-row' style='padding: 10px 0px'>无符合NT或四维检查条件</div>";
            content += "<div class='activity-row' style='padding: 10px 0px'><button type='button' class='btn' onclick='check_information_1()' style='background: #247724;width: 97%;font-size: 20px;color: #fff;letter-spacing: 2px;padding: 10px;border-radius: 7px;text-align: center;margin-left: 5px;margin-right: 5px;'>重新填写个人信息</button></div>";
            $("#choose_NT").html(content);

        }
    }

    //toToday();//开始做月历
}

function check_date() {
    // if(document.getElementById("select_NT").checked == true){
    //     //选择NT
    //     //alert("nt");
    //     toToday(0);
    // }else if(document.getElementById("select_fourth").checked == true){
    //     //选择四维
    //     //alert("select_fourth");
    //     toToday(1);
    // }
}
//显示预约时段
function querytime(selectedDate) {
    //分为NT 及 四维(four)
    $(".choose_date").hide();
    $(".choose_time").show();
    var NT_time_slot = Array('08:00-08:50', '08:50-09:40', '09:40-10:30', '10:30-11:20', '13:30-14:10', '14:10-14:50', '14:50-15:30', '15:30-16:10', '16:10-结束');
    var four_time_slot = Array('08:00-08:50', '08:50-09:40', '09:40-10:30', '10:30-11:20', '11:20-结束', '14:10-14:50', '14:50-15:30', '15:30-16:10');

    var NT_time_slot_count = Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    var four_time_slot_count = Array(0, 0, 0, 0, 0, 0, 0, 0);
    var selec_tag = "";
    var weeknumber = document.getElementById('number_week').value;
    //NT OR 四维
    if (document.getElementById("single_child").checked == true && (weeknumber >= 22 && weeknumber <= 26)) {
        //alert("只有四维");
        selec_tag = 1;
    } else if (weeknumber >= 11 && weeknumber <= 20) {
        //alert("只有NT");
        selec_tag = 0;
    }
    var sJson = JSON.stringify({
        sel_date: selectedDate,
        selec_tag: selec_tag
    });
    $.ajax({
        url: api_url + "/cyms/return_prenatal_checkup_time.php", //存取Json的網址   
        data: { "requestObject": sJson },
        type: "POST",
        cache: false,
        dataType: 'json',
        success: function (data) {
            $("#time_select").empty();
            console.log(data.objects); //拿到哪些时段已被预约
            if (selec_tag == 0) {
                //NT显示
                document.getElementById("select_nt_fourth_time").innerHTML = selectedDate + "<br>请选择预约时段";
                for (var i = 0; i < data.objects.length; i++) {
                    NT_time_slot_count[data.objects[i].time]++;
                }

                for (var i = 0; i < NT_time_slot.length; i++) {
                    $("#time_select").append('<input id="NT_time_slot_' + (i) + '" style="margin: 10px" type="radio" name="NT_select" value="' + (i) + '"><label style="font-size: 3.7vmax;;" for="NT_time_slot_' + i + '" id="l_NT_time_slot_' + (i) + '">' + NT_time_slot[i] + '</label><br>');
                }
                //disable以选取的时间
                //NT('08:00-08:50', '08:50-09:40', '09:40-10:30', '10:30-11:20', '13:30-14:10', '14:10-14:50', '14:50-15:30', '15:30-16:10', '16:10-END');
                // 2,2,2,1,2,1,2,1,2 ---->时段人数限制
                if (NT_time_slot_count[0] == 2) {
                    var id = "NT_time_slot_0";
                    var label_id = "l_NT_time_slot_0";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = NT_time_slot[0] + '(已约满)';
                }
                if (NT_time_slot_count[1] == 2) {
                    var id = "NT_time_slot_1";
                    var label_id = "l_NT_time_slot_1";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = NT_time_slot[1] + '(已约满)';
                }
                if (NT_time_slot_count[2] == 2) {
                    var id = "NT_time_slot_2";
                    var label_id = "l_NT_time_slot_2";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = NT_time_slot[2] + '(已约满)';
                }
                if (NT_time_slot_count[3] == 1) {
                    var id = "NT_time_slot_3";
                    var label_id = "l_NT_time_slot_3";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = NT_time_slot[3] + '(已约满)';
                }
                if (NT_time_slot_count[4] == 2) {
                    var id = "NT_time_slot_4";
                    var label_id = "l_NT_time_slot_4";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = NT_time_slot[4] + '(已约满)';
                }
                if (NT_time_slot_count[5] == 1) {
                    var id = "NT_time_slot_5";
                    var label_id = "l_NT_time_slot_5";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = NT_time_slot[5] + '(已约满)';
                }
                if (NT_time_slot_count[6] == 2) {
                    var id = "NT_time_slot_6";
                    var label_id = "l_NT_time_slot_6";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = NT_time_slot[6] + '(已约满)';
                }
                if (NT_time_slot_count[7] == 1) {
                    var id = "NT_time_slot_7";
                    var label_id = "l_NT_time_slot_7";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = NT_time_slot[7] + '(已约满)';
                }
                if (NT_time_slot_count[8] == 2) {
                    var id = "NT_time_slot_8";
                    var label_id = "l_NT_time_slot_8";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = NT_time_slot[8] + '(已约满)';
                }
                $("#time_select").append("<li class='contentList' style='color: gray;'>当日每一时段NT、四维检验顺序以现场状况为准</li>");
                $("#time_select").append("<button type='button' class='btn' data-toggle='modal' data-target='#exampleModalLong' onclick='check_time(\"" + selectedDate + "\")' style='background: #247724;width: 97%;font-size: 20px;color: #fff;letter-spacing: 2px;padding: 10px;border-radius: 7px;text-align: center;margin-left: 5px;margin-right: 5px;'>确认预约时段</button>");
                $("#time_select").append("<div class='activity-row' style='padding: 10px 0px'><button type='button' class='btn' onclick='check_information_1()'style='background: #247724;width: 97%;font-size: 20px;color: #fff;letter-spacing: 2px;padding: 10px;border-radius: 7px;text-align: center;margin-left: 5px;margin-right: 5px;'>重新填写个人信息</button></div>");
                $("#time_select").append("<div class='activity-row' style='padding: 10px 0px'><button type='button' class='btn' onclick='check_information()'style='background: #247724;width: 97%;font-size: 20px;color: #fff;letter-spacing: 2px;padding: 10px;border-radius: 7px;text-align: center;margin-left: 5px;margin-right: 5px;'>重新选择日期</button></div>");
            } else if (selec_tag == 1) {
                //四维显示
                document.getElementById("select_nt_fourth_time").innerHTML = selectedDate + "<br>请选择预约时段";
                for (var i = 0; i < data.objects.length; i++) {
                    four_time_slot_count[data.objects[i].time]++;
                }
                for (var i = 0; i < four_time_slot.length; i++) {
                    $("#time_select").append('<input id="four_time_slot_' + (i) + '" style="margin: 10px" type="radio" name="four_select" value="' + (i) + '"><label style="font-size: 3.7vmax;;" for="four_time_slot_' + i + '" id="l_four_time_slot_' + (i) + '">' + four_time_slot[i] + '</label><br>');
                }
                if (four_time_slot_count[0] == 1) {
                    var id = "four_time_slot_0";
                    var label_id = "l_four_time_slot_0";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = four_time_slot[0] + '(已约满)';
                }
                if (four_time_slot_count[1] == 1) {
                    var id = "four_time_slot_1";
                    var label_id = "l_four_time_slot_1";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = four_time_slot[1] + '(已约满)';
                }
                if (four_time_slot_count[2] == 1) {
                    var id = "four_time_slot_2";
                    var label_id = "l_four_time_slot_2";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = four_time_slot[2] + '(已约满)';
                }
                if (four_time_slot_count[3] == 1) {
                    var id = "four_time_slot_3";
                    var label_id = "l_four_time_slot_3";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = four_time_slot[3] + '(已约满)';
                }
                if (four_time_slot_count[4] == 1) {
                    var id = "four_time_slot_4";
                    var label_id = "l_four_time_slot_4";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = four_time_slot[4] + '(已约满)';
                }
                if (four_time_slot_count[5] == 1) {
                    var id = "four_time_slot_5";
                    var label_id = "l_four_time_slot_5";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = four_time_slot[5] + '(已约满)';
                }
                if (four_time_slot_count[6] == 1) {
                    var id = "four_time_slot_6";
                    var label_id = "l_four_time_slot_6";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = four_time_slot[6] + '(已约满)';
                }
                if (four_time_slot_count[7] == 1) {
                    var id = "four_time_slot_7";
                    var label_id = "l_four_time_slot_7";
                    document.getElementById(id).setAttribute("disabled", "true");
                    document.getElementById(label_id).style.color = "#8080804d";
                    document.getElementById(label_id).innerHTML = four_time_slot[7] + '(已约满)';
                }
                $("#time_select").append("<li class='contentList' style='color: gray;'>当日每一时段NT、四维检验顺序以现场状况为准</li>");
                $("#time_select").append("<button type='button' class='btn' data-toggle='modal' data-target='#exampleModalLong' onclick='check_time(\"" + selectedDate + "\")' style='background: #247724;width: 97%;font-size: 20px;color: #fff;letter-spacing: 2px;padding: 10px;border-radius: 7px;text-align: center;margin-left: 5px;margin-right: 5px;'>确认预约时段</button>");
                $("#time_select").append("<div class='activity-row' style='padding: 10px 0px'><button type='button' class='btn' onclick='check_information_1()'style='background: #247724;width: 97%;font-size: 20px;color: #fff;letter-spacing: 2px;padding: 10px;border-radius: 7px;text-align: center;margin-left: 5px;margin-right: 5px;'>重新填写个人信息</button></div>");
                $("#time_select").append("<div class='activity-row' style='padding: 10px 0px'><button type='button' class='btn' onclick='check_information()'style='background: #247724;width: 97%;font-size: 20px;color: #fff;letter-spacing: 2px;padding: 10px;border-radius: 7px;text-align: center;margin-left: 5px;margin-right: 5px;'>重新选择日期</button></div>");

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });
}

function check_time(selectedDate) {
    var selec_tag = "";
    var weeknumber = document.getElementById('number_week').value;
    //NT OR 四维
    if (document.getElementById("single_child").checked == true && (weeknumber >= 22 && weeknumber <= 26)) {
        //alert("只有四维");
        selec_tag = 1;
    } else if (weeknumber >= 11 && weeknumber <= 20) {
        //alert("只有NT");
        selec_tag = 0;
    }
    var NT_time_slot = Array('08:00-08:50', '08:50-09:40', '09:40-10:30', '10:30-11:20', '13:30-14:10', '14:10-14:50', '14:50-15:30', '15:30-16:10', '16:10-结束');
    var four_time_slot = Array('08:00-08:50', '08:50-09:40', '09:40-10:30', '10:30-11:20', '11:20-结束', '14:10-14:50', '14:50-15:30', '15:30-16:10');

    if (selec_tag == 0) {
        var mes = $("[name='NT_select']:checked").val();
        //alert(mes);
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
            document.getElementById("mal_selectDate").innerHTML = '预约日期: ' + selectedDate;
            document.getElementById("mal_selectTime").innerHTML = '预约时段: ' + NT_time_slot[mes];
        }
    } else if (selec_tag == 1) {
        var mes = $("[name='four_select']:checked").val();
        //alert(mes);
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
            document.getElementById("mal_selectDate").innerHTML = '预约日期: ' + selectedDate;
            document.getElementById("mal_selectTime").innerHTML = '预约时段: ' + four_time_slot[mes];
        }
    }

}

function real_check() {
    var selec_tag = "";
    var weeknumber = document.getElementById('number_week').value;
    //NT OR 四维
    if (document.getElementById("single_child").checked == true && (weeknumber >= 22 && weeknumber <= 26)) {
        //alert("只有四维");
        selec_tag = 1;
    } else if (weeknumber >= 11 && weeknumber <= 20) {
        //alert("只有NT");
        selec_tag = 0;
    }
    if (selec_tag == 0) {
        var mes = $("[name='NT_select']:checked").val();
        if (mes >= 4) {
            var type = "下午";
        } else {
            var type = "上午";
        }
        var sel_date = document.getElementById("mal_selectDate").innerHTML.split(': ')[1];
        var sJson = JSON.stringify({
            time_index: mes,
            sel_date: sel_date,
            selec_tag: selec_tag,
            type: type,
            uid: getLocalStorageItem("patient_uid"),
            action :"check"
        });
    } else if (selec_tag == 1) {
        var mes = $("[name='four_select']:checked").val();
        if (mes >= 5) {
            var type = "下午";
        } else {
            var type = "上午";
        }
        var sel_date = document.getElementById("mal_selectDate").innerHTML.split(': ')[1];
        var sJson = JSON.stringify({
            time_index: mes,
            sel_date: sel_date,
            selec_tag: selec_tag,
            type: type,
            uid: getLocalStorageItem("patient_uid"),
            action :"check"
        });
    }
    console.log(sJson);
    $.ajax({
        url: api_url + "/cyms/insert_prenatal_checkup_reservation.php", //存取Json的網址   
        data: { "requestObject": sJson },
        type: "POST",
        cache: false,
        async: false,
        dataType: 'json',
        success: function (data) {
            console.log(data.objects[0]);
            if (data.objects[0].check == true) {
                createWxPayOrder();
                //showSusses(); //尚未被预约
                //find_openid(getLocalStorageItem("patient_uid"), mes, sel_date);
            } else if (data.objects[0].check == "repeat") {
                showrepeat(); //重复预约
            } else {
                showfail(); //已被预约
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });
}
//微信支付開始
var createWxPayOrder = function() {
    var fee = 400*100; //四百一次
    var sJson = JSON.stringify
    ({
        uid: getLocalStorageItem("patient_uid"),
        body: "南京明基健康管家-NT、四维产前检查",
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
            insert_prental();
        }
    }); 
}
//微信支付結束
function insert_prental(){
    var selec_tag = "";
    var weeknumber = document.getElementById('number_week').value;
    //NT OR 四维
    if (document.getElementById("single_child").checked == true && (weeknumber >= 22 && weeknumber <= 26)) {
        //alert("只有四维");
        selec_tag = 1;
    } else if (weeknumber >= 11 && weeknumber <= 20) {
        //alert("只有NT");
        selec_tag = 0;
    }
    if (selec_tag == 0) {
        var mes = $("[name='NT_select']:checked").val();
        if (mes >= 4) {
            var type = "下午";
        } else {
            var type = "上午";
        }
        var sel_date = document.getElementById("mal_selectDate").innerHTML.split(': ')[1];
        var sJson = JSON.stringify({
            time_index: mes,
            sel_date: sel_date,
            selec_tag: selec_tag,
            type: type,
            uid: getLocalStorageItem("patient_uid"),
            action:"insert"
        });
    } else if (selec_tag == 1) {
        var mes = $("[name='four_select']:checked").val();
        if (mes >= 5) {
            var type = "下午";
        } else {
            var type = "上午";
        }
        var sel_date = document.getElementById("mal_selectDate").innerHTML.split(': ')[1];
        var sJson = JSON.stringify({
            time_index: mes,
            sel_date: sel_date,
            selec_tag: selec_tag,
            type: type,
            uid: getLocalStorageItem("patient_uid"),
            action:"insert"
        });
    }

    console.log(sJson);
    $.ajax({
        url: api_url + "/cyms/insert_prenatal_checkup_reservation.php", //存取Json的網址   
        data: { "requestObject": sJson },
        type: "POST",
        cache: false,
        async: false,
        dataType: 'json',
        success: function (data) {
            console.log(data.objects[0]);
            if (data.objects[0].check == true) {
                showSusses(); //尚未被预约
                find_openid(getLocalStorageItem("patient_uid"), mes, sel_date);
            } else if (data.objects[0].check == "repeat") {
                showrepeat(); //重复预约
            } else {
                showfail(); //已被预约
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
    $('#exampleModalBtn').append('<button type="button" style="background: #247724;" class="btn" onclick="window.location.href=' + "'prenatal_checkup.html'" + '">确定</button>');
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
    var sJson = JSON.stringify({
        uid: uid
    });
    $.ajax({
        type: "POST",
        url: api_url + "/cyms/return_user_openid.php",
        data: { "requestObject": sJson },
        async: false,
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
    sel_date_temp = sel_date.split('-');
    sel_date_formate = sel_date_temp[0] + '年' + sel_date_temp[1] + '月' + sel_date_temp[2] + '日';
    var selec_tag = "";
    var weeknumber = document.getElementById('number_week').value;
    var select_branch = "";
    //NT OR 四维
    if (document.getElementById("single_child").checked == true && (weeknumber >= 22 && weeknumber <= 26)) {
        //alert("只有四维");
        selec_tag = 1;
    } else if (weeknumber >= 11 && weeknumber <= 20) {
        //alert("只有NT");
        selec_tag = 0;
    }

    var NT_time_slot = Array('08:00-08:50', '08:50-09:40', '09:40-10:30', '10:30-11:20', '13:30-14:10', '14:10-14:50', '14:50-15:30', '15:30-16:10', '16:10-结束');
    var four_time_slot = Array('08:00-08:50', '08:50-09:40', '09:40-10:30', '10:30-11:20', '11:20-结束', '14:10-14:50', '14:50-15:30', '15:30-16:10');
    //處理日期要 2019年09月01日
    if (selec_tag == 0) {
        //NT
        var time = NT_time_slot[time_index];
        //var msg = "您好！您已成功预约" + sel_date_formate + " " + time + " NT产前预约，特此提醒!如有疑问请致电025-52238800-5500，明基国际医疗中心关心您！"
        select_branch = "NT产前预约";
    } else if (selec_tag == 1) {
        //四维
        var time = four_time_slot[time_index];
        //var msg = "您好！您已成功预约" + sel_date_formate + " " + time + " 四维产前预约，特此提醒!如有疑问请致电025-52238800-5500，明基国际医疗中心关心您！"
        select_branch = "四维产前预约";
    }
    var openid = openid;


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
                    "value": select_branch,
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
        url: "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + token,
        data: sJson,
        dataType: "json",
        aync: true,
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