// 取得get資訊 start
function getValue(varname){
    var url = window.location.href;
    var qparts = url.split("?");
    if (qparts.length == 0){return "";}
    var query = qparts[1];
    var vars = query.split("&");
    var value = "";
    for (i=0; i<vars.length; i++)
    {
      var parts = vars[i].split("=");
      if (parts[0] == varname)
      {
        value = parts[1];
        break;
      }
    }
    value = unescape(value);
    value.replace(/\+/g," ");
    return value;
  }
// 取得get資訊 end

// 初始給值 start
var json;
window.onload = function () {
   
}
// 初始給值 end


// 取得 可预约 約滿 之日期 start
$.ajax({
    url: api_url + "/cyms/return_interpretation_reservation_fornormal_date.php",
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
if(unreservableDate!=null){
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

    // setYueman(9);
    // for (var i=10; i<29;i++){
    // 	if (i==11 || i==18 || i==25){

    // 	}else{				
    // 		setKeyue(i);
    // 	}
    // }
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
    window.location.href = 'InterpretationReservation_forNormal1.html?selectedDate=' + selectedDate;
}
//製作日曆 end