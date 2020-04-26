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
var selectedDate, People, noticeWay, noticeTime;
window.onload = function () {
    //設置预约信息
    selectedDate = getValue("selectedDate");
    People = getValue("People");
    noticeWay = getValue("noticeWay");
    noticeTime = getValue("noticeTime");
    var healthCheckInfoAppend = '';
    //時段判斷
    if (People == 1) {
        People = '07:45至08:00';
    } else if (People == 2) {
        People = '08:00至08:30';
    } else if (People == 3) {
        People = '08:30至09:00';
    } else if (People == 4) {
        People = '09:00至09:30';
    } else if (People == 5) {
        People = '09:30至10:00';
    }else{
        //跳警告視窗
    }

    if (noticeWay == 1) {
        noticeWay = '微信消息';
    }else if (noticeWay == 2) {
        noticeWay = '手机短信';
    } else{
        //跳警告視窗
    }
    if(!selectedDate || !noticeTime){
        //跳警告視窗
    }

    healthCheckInfoAppend += '<li class="contentList"><strong>预约时间：</strong>' + selectedDate + ' ' + People + '</li>';
    healthCheckInfoAppend += '<li class="contentList"><strong>提醒设置：</strong>提前' + noticeTime + '分鐘 ' + noticeWay + '提醒</li>';
    $("#info").append(healthCheckInfoAppend);

}
// 初始給值 end
