//樹狀展開 start
function tree() {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
}
//樹狀展開 end

//顯示區塊 start
function showView(num) {
    if (num == 1) {
        $("#show_healthcheck").attr("style", "display:block;");
        $("#show_specialist").attr("style", "display:none;");
        $("#show_interpretationReservation").attr("style", "display:none;");
    }
    else {
        $("#show_healthcheck").attr("style", "display:none;");
        $("#show_specialist").attr("style", "display:block;");
        $("#show_interpretationReservation").attr("style", "display:none;");
    }
}
//顯示區塊 end

// 初始給值 start
var hid;
var uid;
var uid_name;
var healthCheckItemAppend = [];
$(document).ready(function () {
    var llll1ll1l1l1l1l1l = getFuncInfo();
    if(lllllllllllllllll) {
        var user = getUserDetail();
    }
    uid = getLocalStorageItem("uid");
    uid_name = getLocalStorageItem("name");

    //占时先用hid=1
    var sJson = JSON.stringify({
        uid: uid,
        type: "healthCheck_R"
    });
    //取健檢項目
    Append = "";
    $.ajax({
        url: api_url + "/cyms/return_reservation.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects);
            if (data.objects.length == 0) {
                Append += "<div class='activity-row' style='padding: 10px 0px;margin: 0'><div class='row' style='margin:0'><li class='setList_btn row_title'>无预约信息</li></div></div>";
            } else {
                for (var k = 0; k < data.objects.length; k++) {
                    healthCheckItemAppend[k] = "";
                    json = data.objects[k];
                    Append += "<div class='activity-row' style='padding: 10px 0px;margin: 0'>";
                    Append += "<button class='accordion bold' style='font-size: 3.5vmax; text-align: left;'>";
                    Append += json.list_name + json.date + "<i class='fa fa-angle-down'></i> ";
                    if (json.status == 0)
                        json.status = "预约待审核...";
                    else if (json.status == 1)
                        json.status = "预约已确认";
                    else
                        json.status = "预约已取消";
                    Append += "<li class='setList_btn row_comtent'>" + json.status + "</li></button>";
                    Append += "<div class='panel' style='display: none;'>";
                    Append += "<div class='row' style='margin:0'>";
                    Append += "<div class='setList_btn col-xs-12'>";
                    Append += "<li class='row_title'>•受检人：" + uid_name + "</li>";
                    if (json.remind_way == 1)
                        json.remind_way = "微信";
                    else
                        json.remind_way = "短信";
                    // Append += "<li class='row_comtent'> " + json.remind_way + " 提前" + json.remind_time + "分钟</li></div></div>";
                    Append += "<li class='contentList'style='background: #f8d07e;'onclick='show_detail(healthCheckItemAppend[" + k + "])'><strong>健检项目 <i style='color:blue;text-decoration:underline;font-style:normal;'>明細</i></strong></li>";
                    healthCheckItemAppend[k] += "<div class='row' style='margin:0'>";
                    healthCheckItemAppend[k] += "<div class='setList_btn col-xs-12' style='background: #f8d07e;'>";
                    healthCheckItemAppend[k] += "<li class='row_title'>•健检项目：</li></div>";
                    healthCheckItemAppend[k] += "<div>";
                    for (var i = 0; i < json.objects_sub[0].length; i++) {
                        healthCheckItemAppend[k] += '<div class="row itemRow_title"><li class="contentList strong col-xs-12 " style="background: #ffebc2;">' +
                            json.objects_sub[0][i].name + '</li></div>';
                        healthCheckItemAppend[k] += '<div class="row" style="margin:0; "><li class="contentList strong col-xs-4">项目名称</li><li class="contentList strong col-xs-8">项目内容</li></div>';
                        var jsonitems = json.objects_sub[0][i].items.length;
                        for (var j = 0; j < jsonitems; j++) {
                            if(json.objects_sub[0][i].items[j].other==".")
                            json.objects_sub[0][i].items[j].other="";
                            healthCheckItemAppend[k] += '<div class="row itemRow" style="margin: 0.5em 0 0;"><li class="contentList  col-xs-4"><div class="strong">' +
                                json.objects_sub[0][i].items[j].name + '</div>' + json.objects_sub[0][i].items[j].other + '</li><li class="contentList col-xs-8">' +
                                json.objects_sub[0][i].items[j].content
                                + '</li></div>';
                        }
                    }
                    healthCheckItemAppend[k] += '</div></div>';
                    //X項目
                    if (json.Xitem) {
                        for (var i = 0; i < json.Xitem.length; i++) {
                            var Xitem=json.Xitem[i][0];
                            healthCheckItemAppend[k] += "<div class='row' style='margin:0'>";
                            healthCheckItemAppend[k] += "<div class='setList_btn col-xs-12' style='background: #f8d07e;'>";
                            healthCheckItemAppend[k] += "<li class='row_title'>•X项目："+Xitem.name+"</li></div>";
                            healthCheckItemAppend[k] += "<div>";
                            for (var n = 0; n < Xitem.xitems.length; n++) {
                                healthCheckItemAppend[k] += '<div class="row itemRow_title"><li class="contentList strong col-xs-12 " style="background: #ffebc2;">' +
                                Xitem.xitems[n].name + '</li></div>';
                                healthCheckItemAppend[k] += '<div class="row" style="margin:0; "><li class="contentList strong col-xs-4">项目名称</li><li class="contentList strong col-xs-8">项目内容</li></div>';
                                var jsonitems = Xitem.xitems[n].items.length;
                                for (var j = 0; j < jsonitems; j++) {
                                    if(Xitem.xitems[n].items[j].other==".")
                                    Xitem.xitems[n].items[j].other="";
                                    healthCheckItemAppend[k] += '<div class="row itemRow" style="margin: 0.5em 0 0;"><li class="contentList  col-xs-4"><div class="strong">' +
                                    Xitem.xitems[n].items[j].name + '</div>' + Xitem.xitems[n].items[j].other + '</li><li class="contentList col-xs-8">' +
                                    Xitem.xitems[n].items[j].content
                                        + '</li></div>';
                                }
                            }
                            healthCheckItemAppend[k] += '</div></div>';
                        }
                    }

                    //附加項目
                    if (json.additem[0]) {
                        healthCheckItemAppend[k] += "<div class='row' style='margin:0'>";
                        healthCheckItemAppend[k] += "<div class='setList_btn col-xs-12'style='background: #f8d07e;'>";
                        healthCheckItemAppend[k] += "<li class='row_title'>•附加项目：</li></div>";
                        healthCheckItemAppend[k] += "<div>";
                        healthCheckItemAppend[k] += '<div class="row" style="margin:0; "><li class="contentList strong col-xs-5">项目名称</li><li class="contentList strong col-xs-5">项目内容</li></div>';
                        for (var i = 0; i < json.additem[0].length; i++) {
                            if (json.additem[0][i].name == "#")
                                json.additem[0][i].name = "";
                            healthCheckItemAppend[k] += '<div class="row itemRow" style="margin: 0.5em 0 0;"><li class="contentList  col-xs-5"><div class="strong">' +
                                json.additem[0][i].class + '</div>' + json.additem[0][i].name + '</li><li class="contentList col-xs-5">' +
                                json.additem[0][i].content
                                + '</li></div>';
                        }
                        healthCheckItemAppend[k] += '</div></div>';
                    }
                    Append += "<li class='contentList'>" + "•系统已受理预约,如需更改或取消 请拨打 025-52238800-7777 联系客服人员" + "</li></button>";
                    Append += "</div></div></div></div>";
                }
            }
            $("#healthCheck_R").append(Append);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });

    //取專家門诊预约
    morning = Array('8:00至08:30', '08:30至09:00', '09:00至09:30', '09:30至10:00', '10:00至10:30', '10:30至11:00', '11:00至11:30', '11:30至12:00');
    afternoon = Array('13:30至14:00', '14:00至14:30', '14:30至15:00', '15:00至15:30', '15:30至16:00', '16:00至16:30', '16:30至17:00');
    night = Array('17:30至18:00', '18:00至18:30', '18:30至19:00', '19:00至19:30', '19:30至20:00', '20:00至20:30');
    var NT_time_slot = Array('08:00-08:50', '08:50-09:40', '09:40-10:30', '10:30-11:20', '13:30-14:10', '14:10-14:50', '14:50-15:30', '15:30-16:10', '16:10-结束');
    var four_time_slot = Array('08:00-08:50', '08:50-09:40', '09:40-10:30', '10:30-11:20', '11:20-结束', '14:10-14:50', '14:50-15:30', '15:30-16:10');

    var sJson = JSON.stringify({
        uid: uid,
        type: "specialist"
    });
    content = "";
    $.ajax({
        url: api_url + "/cyms/return_reservation.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects);
            if (data.objects.length == 0) {
                content += "<div class='activity-row' style='padding: 10px 0px;margin: 0'><div class='row' style='margin:0'><li class='setList_btn row_title'>无预约信息</li></div></div>";
            } else {
                for (var i = 0; i < data.objects.length; i++) {
                    //分NT 跟一般
                    if(data.objects[i].NT_tag==0){
                        if(data.objects[i].specialist_name=="心理谘询"){
                            morning = ["8:00", "10:00"];
                        }else{
                            morning = Array('8:00至08:30', '08:30至09:00', '09:00至09:30', '09:30至10:00', '10:00至10:30', '10:30至11:00', '11:00至11:30', '11:30至12:00');
                        }
                        content += "<div class='activity-row' style='padding: 10px 0px;margin: 0'>";
                        content += "<button class='accordion bold' style='font-size: 3.5vmax; text-align: left;'>";
                        content += data.objects[i].date + ' ' + data.objects[i].specialist_name;
                        content += "<i class='fa fa-angle-down'></i>";
                        if (data.objects[i].status == "0") {
                            content += "<li class='setList_btn row_comtent'>预约待审核...</li>";
                        } else if (data.objects[i].status == "1") {
                            content += "<li class='setList_btn row_comtent'>预约已确认</li>";
                        } else if (data.objects[i].status == "2") {
                            content += "<li class='setList_btn row_comtent'>预约已取消</li>";
                        }
                        content += "</button>";
                        //预约資訊
                        content += "<div class='panel' style='display: none;'>";
                        content += "<div class='row' style='margin:0'>";
                        content += "<div class='setList_btn col-xs-12'>";
                        content += "<li class='row_title'>预约医师 :" + data.objects[i].doc_name + "</li>";
                        content += "<li class='row_title'>预约时段 :" + data.objects[i].type + "</li>";
                        if (data.objects[i].type == "上午") {
                            content += "<li class='row_title'>预约时间 :" + morning[data.objects[i].time] + "</li>";
                        } else if (data.objects[i].type == "下午") {
                            content += "<li class='row_title'>预约时间 :" + afternoon[data.objects[i].time] + "</li>";
                        } else if (data.objects[i].type == "晚间") {
                            content += "<li class='row_title'>预约时间 :" + night[data.objects[i].time] + "</li>";
                        }
                        content += "<li class='contentList'><strong>" + "•系统已受理预约,如需更改或取消 请拨打 025-52238800-7777 联系客服人员" + "</li></button>";
                        content += "</div>";
                        content += "</div>";
                        content += "</div>";
                        content += "</div>";
                    }else if(data.objects[i].NT_tag==1){
                        //NT
                        content += "<div class='activity-row' style='padding: 10px 0px;margin: 0'>";
                        content += "<button class='accordion bold' style='font-size: 3.5vmax; text-align: left;'>";
                        content += data.objects[i].date + ' ' + data.objects[i].specialist_name;
                        content += "<i class='fa fa-angle-down'></i>";
                        if (data.objects[i].status == "0") {
                            content += "<li class='setList_btn row_comtent'>预约待审核...</li>";
                        } else if (data.objects[i].status == "1") {
                            content += "<li class='setList_btn row_comtent'>预约已确认</li>";
                        } else if (data.objects[i].status == "2") {
                            content += "<li class='setList_btn row_comtent'>预约已取消</li>";
                        }
                        content += "</button>";
                        //预约資訊
                        content += "<div class='panel' style='display: none;'>";
                        content += "<div class='row' style='margin:0'>";
                        content += "<div class='setList_btn col-xs-12'>";
                        // content += "<li class='row_title'>预约医师 :" + data.objects[i].doc_name + "</li>";
                        content += "<li class='row_title'>预约内容 :" + data.objects[i].specialist_id + "</li>";
                        content += "<li class='row_title'>预约时段 :" + data.objects[i].type + "</li>";
                        content += "<li class='row_title'>预约时间 :" + NT_time_slot[data.objects[i].time] + "</li>";
                        // if (data.objects[i].type == "上午") {
                        //     content += "<li class='row_title'>预约时间 :" + morning[data.objects[i].time] + "</li>";
                        // } else if (data.objects[i].type == "下午") {
                        //     content += "<li class='row_title'>预约时间 :" + afternoon[data.objects[i].time] + "</li>";
                        // } else if (data.objects[i].type == "晚间") {
                        //     content += "<li class='row_title'>预约时间 :" + night[data.objects[i].time] + "</li>";
                        // }
                        content += "<li class='contentList'><strong>" + "•系统已受理预约,如需更改或取消 请拨打 025-52238800-7777 联系客服人员。当日每一时段NT检验顺序以现场状况为准" + "</li></button>";
                        content += "</div>";
                        content += "</div>";
                        content += "</div>";
                        content += "</div>";
                    }else if(data.objects[i].NT_tag==2){
                        //四维
                        content += "<div class='activity-row' style='padding: 10px 0px;margin: 0'>";
                        content += "<button class='accordion bold' style='font-size: 3.5vmax; text-align: left;'>";
                        content += data.objects[i].date + ' ' + data.objects[i].specialist_name;
                        content += "<i class='fa fa-angle-down'></i>";
                        if (data.objects[i].status == "0") {
                            content += "<li class='setList_btn row_comtent'>预约待审核...</li>";
                        } else if (data.objects[i].status == "1") {
                            content += "<li class='setList_btn row_comtent'>预约已确认</li>";
                        } else if (data.objects[i].status == "2") {
                            content += "<li class='setList_btn row_comtent'>预约已取消</li>";
                        }
                        content += "</button>";
                        //预约資訊
                        content += "<div class='panel' style='display: none;'>";
                        content += "<div class='row' style='margin:0'>";
                        content += "<div class='setList_btn col-xs-12'>";
                        // content += "<li class='row_title'>预约医师 :" + data.objects[i].doc_name + "</li>";
                        content += "<li class='row_title'>预约内容 :" + data.objects[i].specialist_id + "</li>";
                        content += "<li class='row_title'>预约时段 :" + data.objects[i].type + "</li>";
                        content += "<li class='row_title'>预约时间 :" + four_time_slot[data.objects[i].time] + "</li>";
                        // if (data.objects[i].type == "上午") {
                        //     content += "<li class='row_title'>预约时间 :" + morning[data.objects[i].time] + "</li>";
                        // } else if (data.objects[i].type == "下午") {
                        //     content += "<li class='row_title'>预约时间 :" + afternoon[data.objects[i].time] + "</li>";
                        // } else if (data.objects[i].type == "晚间") {
                        //     content += "<li class='row_title'>预约时间 :" + night[data.objects[i].time] + "</li>";
                        // }
                        content += "<li class='contentList'><strong>" + "•系统已受理预约,如需更改或取消 请拨打 025-52238800-7777 联系客服人员。当日每一时段四维检验顺序以现场状况为准。" + "</li></button>";
                        content += "</div>";
                        content += "</div>";
                        content += "</div>";
                        content += "</div>";
                    }
                    
                }
            }
            $("#specialist").html(content);
        }
    });


    //解讀预约 
    //判斷身分別
    //vip_tag;//紀錄身分


    var sJson = JSON.stringify({
        uid: uid
        //uid : 228//VIP
    });
    $.ajax({
        url: api_url + "/cyms/return_user_information.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log("vip_tag:" + data.objects[0].vip_tag);
            vip_tag = data.objects[0].vip_tag;
        }
    });
    var interpretation_html = "";
    if (vip_tag == "0") { //普通會員
        var sJson = JSON.stringify({
            uid: uid,
            type: 'normal'
            //uid : 228//VIP
        });
        $.ajax({
            url: api_url + "/cyms/return_interpretation.php",
            type: "POST",
            cache: false,
            async: false,
            data: { "requestObject": sJson },
            dataType: "json",
            success: function (data) {
                console.log(data.objects);
                if (data.objects.length == 0) {
                    interpretation_html += "<div class='activity-row' style='padding: 10px 0px;margin: 0'><div class='row' style='margin:0'><li class='setList_btn row_title'>无预约信息</li></div></div>";
                } else {
                    for (var i = 0; i < data.objects.length; i++) {
                        interpretation_html += "<div class='activity-row' style='padding: 10px 0px;margin: 0'>";
                        interpretation_html += "<button class='accordion bold' style='font-size: 3.5vmax; text-align: left;'>" + data.objects[i].date + "<i class='fa fa-angle-down'></i></button>";
                        interpretation_html += "<div class='panel' style='display: none;'>";
                        interpretation_html += "<div class='row' style='margin:0'>";
                        interpretation_html += "<div class='setList_btn col-xs-12'>";
                        interpretation_html += "<li class='row_title'>预约时段 :" + data.objects[i].mor_aft;
                        if (data.objects[i].mor_aft == "上午") {
                            interpretation_html += "<label style='font-size:3 vmax'> (8:00-12:00)</label>";
                        } else if (data.objects[i].mor_aft == "下午") {
                            interpretation_html += "<label style='font-size:3 vmax'> (13:30-17:30)</label>";
                        }
                        interpretation_html += "</li>";
                        interpretation_html += "<li class='row_title'>预约号码 :" + data.objects[i].number + "</li>";
                        interpretation_html += "</div>";
                        interpretation_html += "</div>";
                        interpretation_html += "</div>";
                        interpretation_html += "</div>";
                    }
                }
            }
        });
    } else if (vip_tag == "1" || vip_tag == "2" || vip_tag == "3") { //VIP
        var sJson = JSON.stringify({
            uid: uid,
            type: 'vip'
            //uid : 228//VIP
        });
        $.ajax({
            url: api_url + "/cyms/return_interpretation.php",
            type: "POST",
            cache: false,
            async: false,
            data: { "requestObject": sJson },
            dataType: "json",
            success: function (data) {
                console.log(data.objects);
                if (data.objects.length == 0) {
                    interpretation_html += "<div class='activity-row' style='padding: 10px 0px;margin: 0'><div class='row' style='margin:0'><li class='setList_btn row_title'>无预约信息</li></div></div>";
                } else {
                    for (var i = 0; i < data.objects.length; i++) {
                        interpretation_html += "<div class='activity-row' style='padding: 10px 0px;margin: 0'>";
                        interpretation_html += "<div class='' style='font-size: 4vmax;text-align: left;font-weight: bold;'>" + data.objects[i].date + " ";
                        interpretation_html += "<label style='font-size: 3vmax'>" + data.objects[i].cho_time + "</label>"
                        if (data.objects[i].status == "0") {
                            interpretation_html += "<li class='setList_btn row_comtent'>预约待审核...</li>";
                        } else if (data.objects[i].status == "1") {
                            interpretation_html += "<li class='setList_btn row_comtent'>预约已确认</li>";
                        } else if (data.objects[i].status == "2") {
                            interpretation_html += "<li class='setList_btn row_comtent'>预约已取消</li>";
                        }
                        interpretation_html += "</div>";
                        interpretation_html += "</div>";
                    }
                }
            }
        });
    }
    $("#interpretationReservation").html(interpretation_html);



    tree();
    showView(1);

});
// 初始給值 end

function vip_nor_inclick() {
    if (vip_tag == "0") {
        window.location.href = 'InterpretationReservation_forNormal.html';
    } else if (vip_tag == "1" || vip_tag == "2" || vip_tag == "3") {
        window.location.href = 'InterpretationReservation_forVIP.html';
    }
}

//套餐详情 start
function show_detail(healthCheckItemAppend) {
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "检查项目";

    $('#modal-body').append(healthCheckItemAppend);
    $('#exampleModalBtn').append('<button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>');
    $("#exampleModalLong").modal("show");
}
//套餐详情 end