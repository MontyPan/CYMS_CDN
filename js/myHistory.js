//初始載入 start
$(document).ready(function () {
    var HistoryAppend = "";
    var showM=false;
    var sJson = JSON.stringify({
        uid: getLocalStorageItem("uid")
    });
    $.ajax({
        url: api_url + "/cyms/return_myHistory.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects);
            json = data.objects;
            var pre_date = '';
            var pre_level = '';
            var cur_date = '';
            var cur_level = '';
            var tmp = '';
            if (json != null) {
                for (var i = 0; i < json.length; i++) {
                    cur_level = json[i].level;
                    cur_date = json[i].date;

                    //如果跟前者 日期等级 一样就相加 或是 第一笔
                    if ((pre_date == cur_date && cur_level == pre_level) || i == 0) {
                        if (cur_level == 1) {
                            tmp += '<p class="normal">' + json[i].event + '</p>';
                        }
                        else if (cur_level == 2) {
                            tmp += '<p class="warning">' + json[i].event + '</p>';
                        }
                        else {
                            tmp += '<p class="urgent">' + json[i].event + '</p>';
                        }
                        pre_date = cur_date;
                        pre_level = cur_level;

                    }
                    else {//如果不同笔 就建立一个节点
                        if (pre_level == 1) {
                            HistoryAppend += '<li class="normalHistory">';
                            HistoryAppend += '<p style="font-size: 2.5vmax;font-weight: bold;">' + pre_date + '</p>';
                            HistoryAppend += tmp;
                            HistoryAppend += '</li>';
                        }
                        else if (pre_level == 2) {
                            HistoryAppend += '<li class="warningHistory">';
                            HistoryAppend += '<p style="font-size: 2.5vmax;font-weight: bold;">' + pre_date + '</p>';
                            HistoryAppend += tmp;
                            HistoryAppend += '</li>';
                        }
                        else {
                            HistoryAppend += '<li class="urgentHistory">';
                            HistoryAppend += '<p style="font-size: 2.5vmax;font-weight: bold;">' + pre_date + '</p>';
                            HistoryAppend += tmp;
                            HistoryAppend += '</li>';
                        }
                        //建立一个节点后 把当前的事件归类
                        if (cur_level == 1)
                            tmp = '<p class="normal">' + json[i].event + '</p>';
                        else if (cur_level == 2)
                            tmp = '<p class="warning">' + json[i].event + '</p>';
                        else
                            tmp = '<p class="urgent">' + json[i].event + '</p>';

                        pre_date = json[i].date;
                        pre_level = json[i].level;
                    }
                    //最后一笔
                    if (i == json.length - 1) {
                        if (json[i].level == 1)
                            HistoryAppend += '<li class="normalHistory">';
                        else if (json[i].level == 2)
                            HistoryAppend += '<li class="warningHistory">';
                        else
                            HistoryAppend += '<li class="urgentHistory">';
                        HistoryAppend += '<p style="font-size: 2.5vmax;font-weight: bold;">' + json[i].date + '</p>';
                        HistoryAppend += tmp;
                        HistoryAppend += '</li>';
                    }

                    //是否通报医院 符合 疑似感染
                    if(json[i].event=="疑似感染"){
                        showM=true;
                    }
                }
            }
            $('#myHistory').append(HistoryAppend);


        },
        error: function (xhr, ajaxOptions, thrownError) {
            // alert(xhr.status);
            // alert(thrownError);
        }
    });


    // //是否通报医院 符合 oid=1 && 疑似感染
    // if(getLocalStorageItem("manage_oid")==1 && showM==true){
    //     NotifyHospital();
    // }

});
//初始載入 end

//医院配对 start
var Hospital="";
function NotifyHospital() {
    var HospitalAppend="";

    HospitalAppend += $.i18n("select_hospital_pairing_submit") + "<BR>";
    HospitalAppend+='<select style="font-size: 3vmax;" id="History" >';
    HospitalAppend+='<option value="2">明基医院</option>';
    // GetHospital();
    // HospitalAppend+=Hospital;
    HospitalAppend+='</select>';
   
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = $.i18n("message_hospital_pairing");
    $('#modal-body').append(HospitalAppend);
    $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="AlertHospital()">' + $.i18n("sumbit") + '</button>');
    $("#exampleModalLong").modal("show");
};
//医院配对 end

//医院列表 start
function GetHospital() {
    Hospital="";
    var sJson = JSON.stringify({
        choose: 1
    });
    $.ajax({
        url: api_url + "/cyms/return_organization.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects);
            json = data.objects;
            for (var i = 0; i < json.length; i++) {
                Hospital+='<option value="'+json[i].oid+'">'+json[i].name+'</option>';
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            // alert(xhr.status);
            // alert(thrownError);
        }
    });
}
//医院列表 end


//通报医院 start
function AlertHospital() {
    var sJson = JSON.stringify({
        choose: 2,
        uid: getLocalStorageItem("uid"),
        manage_oid:$("#History").val(),
        manage_name:$("#History :selected").text()
    });
    $.ajax({
        url: api_url + "/cyms/return_organization.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects);
            json = data.objects;
            if(data.success==200){
                setLocalStorageItem("manage_oid", $("#History").val());
                location.reload();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            // alert(xhr.status);
            // alert(thrownError);
        }
    });
}
//通报医院 end

