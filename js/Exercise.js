// 初始給值 start
$(document).ready(function () {
    var llll1ll1l1l1l1l1l = getFuncInfo();
    if(lllllllllllllllll) {
        var user = getUserDetail();
    }
    //取运动项目
    exTypeAppend = '';
    $.ajax({
        url: api_url + "/cyms/return_exercise_type.php",
        type: "POST",
        cache: false,
        async: false,
        dataType: "json",
        data: { "requestObject": JSON.stringify({locale : dontCare.decideLocale()}) },
        success: function (data) {
            console.log(data.objects);
            json = data.objects;
            for (var i = 0; i < json.length; i++) {
                exTypeAppend+='<option value="'+json[i].exid+'">'+json[i].ex_name+'</option>';
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });
    $("#exercise_type").append(exTypeAppend);
    
});
// 初始給值 end

//时间格式(ex.2020-01-01 23:01) start
function timeFormat() {
    var time = new Date();
    var Y = time.getFullYear();
    var M = (time.getMonth() + 1);
    var D = time.getDate();
    var H = time.getHours();
    var Min = time.getMinutes();
    return Y + "-" + ((M + 1) < 10 ? '0' : '') + M + "-" + (D < 10 ? '0' : '') + D + " " + (H < 10 ? '0' : '') + H + ":" + (Min < 10 ? '0' : '') + Min;
};
//时间格式(ex.2020-01-01 23:01) end

//上传运动数据 start
var uploadTime = function(min) {
    //先判斷簡易正確性
    if(min<=0 || min=="" || min==null || !$("#exercise_type").val()){
        showError();
    }
    else{
        var ex_time = "";
        var h = Math.floor(min / 60);
        if (h < 10)
            ex_time += "0";
        ex_time += h + ":";
        var m = Math.floor(min % 60);
        if (m < 10)
            ex_time += "0";
        ex_time += m + ":00";
    
        var sJson = JSON.stringify({
            uid: getLocalStorageItem("uid"),
            ex_type: $("#exercise_type").val(),
            ex_time: ex_time,
            time: timeFormat(),
            location: "null,null",
            path: " ",
            upload_time: timeFormat()
        });
        $.ajax({
            type: "POST",
            data: { "requestObject": sJson },
            dataType: "json",
            url: api_url + "/cyms/insert_sport.php",
            success: function(data) {
                showSusses();
            },
        });
    }
};
//上传运动数据 end

//上传成功跳视窗 start
function showSusses() {
    //显示预约成功 跳回主页
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = $.i18n("feedback_message");
    $('#modal-body').append($.i18n("new_success"));
    $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" onclick="window.location.href=' + "'Home.html'" + '">' + $.i18n("submit") + '</button>');
    $("#exampleModalLong").modal("show");
}
//上传成功跳视窗 end

//上传失敗跳视窗 start
function showError() {
    //显示预约失败 跳回主页
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = $.i18n("feedback_message");
    $('#modal-body').append($.i18n("incomplete_data"));
    $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" onclick="window.location.href=' + "'Home.html'" + '">' + $.i18n("submit") + '</button>');
    $("#exampleModalLong").modal("show");
}
//上传失敗跳视窗 end