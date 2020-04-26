// 初始給值 start
var selectedDate;
window.onload = function () {
    selectedDate = getValue("selectedDate");
    document.getElementById('selectTime').innerHTML = selectedDate;
    getNormalNum();
}
// 初始給值 end

// 取得該日期 普通解讀人數 start
function getNormalNum() {
    var sJson = JSON.stringify({
        selectdate: selectedDate,
    });
    $.ajax({
        url: api_url + "/cyms/return_interpretation_reservation_fornormal_time.php",
        type: "POST",
        cache: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects[0]);//取出物件長度  
            var PeopleAppend = '';
            if(data.objects[0].morning==null)
            data.objects[0].morning =0;
            if(data.objects[0].afternoon==null)
            data.objects[0].afternoon=0;
            PeopleAppend += '<input style="margin: 10px" type="radio" name="time" value="1" id="time_1"><label id="timeLabel_1" for="time_1">上午，当前人数： ' + data.objects[0].morning + '位</label><br>';
            PeopleAppend += '<input style="margin: 10px" type="radio" name="time" value="2" id="time_2"><label id="timeLabel_2" for="time_2">下午，当前人数： ' + data.objects[0].afternoon + '位</label><br>';
            $("#PeopleAppend").append(PeopleAppend);
            FullNum(data.objects[0].morning,data.objects[0].afternoon);
        }
    });
}
// 取得該日期 普通解讀人數 end

//判断时段是否额满(30位/段) start
function FullNum(morning,afternoon){
    var max=30;//最大號碼
    var time_1 = document.getElementById("time_1");
    var time_2 = document.getElementById("time_2");
    var timeLabel_1 = document.getElementById("timeLabel_1");
    var timeLabel_2 = document.getElementById("timeLabel_2");
    if(morning>=max){
        time_1.setAttribute("disabled","true");
        timeLabel_1.setAttribute("style","color:#ccc");
        timeLabel_1.innerHTML="上午，当前人数：额满";
    }
    if(afternoon>=max){  
        time_2.setAttribute("disabled","true");
        timeLabel_2.setAttribute("style","color:#ccc");
        timeLabel_2.innerHTML="下午，当前人数：额满";
    }
}
//判断时段是否额满(15位/段) end

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


//警告視窗 start
function showWarning() {
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "警告";
    $('#modal-body').append('输入资料尚未完整');
    $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>');
    $("#exampleModalLong").modal("show");
};
//警告視窗 end

//錯誤視窗 start
function showError() {
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "错误";
    $('#modal-body').append('很抱歉!此时段已额满，请重新选择');
    $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="window.location.href=' + "'InterpretationReservation_forNormal.html'" + '">确定</button>');
    $("#exampleModalLong").modal("show");
};
//錯誤視窗 end

//再次確認視窗 start
function showAgainfunction() {
    if (checkInfo() == false) {
        showWarning();//跳出警告視窗
    }
    else {
        var CheckInfoAppend = '';
        //取资料
        var time = $('input:radio[name="time"]:checked').val();//取得時段

        CheckInfoAppend += '<li class="contentList"><strong>预约日期：</strong>' + selectedDate + '</li>';
        if (time == 1)
            CheckInfoAppend += '<li class="contentList"><strong>预约时间：</strong>上午时段</li>';
        else
            CheckInfoAppend += '<li class="contentList"><strong>预约时间：</strong>下午时段</li>';
        //跳出确认视窗
        $('#modal-body').empty();
        $('#exampleModalBtn').empty();
        document.getElementById('exampleModalLongTitle').innerHTML = "请再次确认发出";
        $('#modal-body').append(CheckInfoAppend);
        $('#exampleModalBtn').append('<button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>' +
            '<button type="button" class="btn btn-primary" data-dismiss="modal"onclick="Reservation()">确定</button>');
        $("#exampleModalLong").modal("show");
    }

};
//再次確認視窗 end

//按下预约 start
function Reservation() {
    $("#exampleModalLong").modal("hide");
    var time = $('input:radio[name="time"]:checked').val();//取得時段
    var sJson = JSON.stringify({
        uid:getLocalStorageItem("patient_uid"),
        Rtime: time,
        Rdate: selectedDate,
        device:1,
    });
    $.ajax({
        url: api_url + "/cyms/insert_interpretation_reservation_fornormal.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects[0]);
            if(data.objects[0].check==true)
                showSusses(data.objects[0].number);
            else
                showError();
        },
        error:function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
           }
    });



}
//按下预约 end

//预约成功跳视窗 start
function showSusses(num) {
   //显示预约成功 跳回主页
   $('#modal-body').empty();
   $('#exampleModalBtn').empty();
   document.getElementById('exampleModalLongTitle').innerHTML = "信息";
   $('#modal-body').append('解读预约成功!<div style="font-size: 3vmax;background: #247724;color:#fff;text-align: center;border-radius: 10px;">号码牌<div class="bold" style="margin:0px;background: #e6e6e366;/* padding: 5px;">'+num+'</div></div>');
   $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" onclick="window.location.href=' + "'Home.html'" + '">确定</button>');
   $("#exampleModalLong").modal("show");
}
//预约成功跳视窗 end

//检查资料完整 start
function checkInfo() {
    var time = $('input:radio[name="time"]:checked').val();//取得時段
    if (time == null || selectedDate == undefined || selectedDate == "" || selectedDate == null) {
        return false;
    }
    else {
        return true;
    }
}
//检查资料完整 end


