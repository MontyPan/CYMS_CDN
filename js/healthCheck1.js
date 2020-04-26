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
var hid;
var totalPrice;
var thisTag;
var healthCheckItemAppend = '';
$(document).ready(function () {
    hid = getValue("hid");//取hid
    var category_id="";
    var sJson = JSON.stringify({
        choose: 1,//choose 1列出指定hid套餐簡介， 2列出以xhid排列之套餐簡介(for 1+X)
        hid: hid
    });
    //取套餐 名稱.價錢.簡介
    $.ajax({
        url: api_url + "/cyms/return_health_check_oneSet.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects);
            totalPrice = data.objects[0].price;
            thisTag = data.objects[0].tag;
            
            category_id = data.objects[0].category_id;
            $("#total_price").html("¥" + totalPrice);
            $("#set").append(data.objects[0].name + '<div class="bold" style="margin-top:0.8em;font-size: 25px;color: #fff;' +
                'letter-spacing: 2px;background: #e6e6e366;padding: 10px;">¥' + data.objects[0].price + '</div>');
            if (data.objects[0].info != "" && data.objects[0].info != ".")
                $("#info").append(data.objects[0].info);
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });
    //取健檢項目
    $.ajax({
        url: api_url + "/cyms/return_health_check_detail.php",
        type: "POST",
        cache: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects[0]);
            json = data.objects[0];
            healthCheckItemAppend = '';
            if (json != null) {
                //healthCheckItemAppend = '<div class="panel">';
                for (var i = 0; i < json.length; i++) {
                    healthCheckItemAppend += '<div class="row itemRow_title" style="background: #f5d794;"><li class="contentList strong col-xs-12 ">' +
                        json[i].name + '</li></div>';
                    healthCheckItemAppend += '<div class="row"><li class="contentList strong col-xs-4">项目名称</li><li class="contentList strong col-xs-8">项目内容</li></div>';
                    var jsonitems = json[i].items.length;
                    for (var j = 0; j < jsonitems; j++) {
                        healthCheckItemAppend += '<div class="row itemRow"><li class="contentList  col-xs-4"><div class="strong">' +
                            json[i].items[j].name + '</div>';
                        if (json[i].items[j].other != "" && json[i].items[j].other != ".")
                            healthCheckItemAppend += '<br>' + json[i].items[j].other;
                        healthCheckItemAppend += '</li><li class="contentList col-xs-8">' + json[i].items[j].content + '</li></div>';
                    }
                }
               // healthCheckItemAppend += '</div>';
                $("#healthCheckItem").append(healthCheckItemAppend);
            }
            else {
                $("#healthCheckItem").append('<div class="panel"><div class="row itemRow_title"><li class="contentList strong col-xs-12 ">' +
                    '暫無資料' + '</li></div>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });
    if (thisTag == "1") {
        //取X套餐項目
        var sJson = JSON.stringify({
            tag: 2 //999顯示全部套餐 99是tag0+1套餐  0是一般 1是1套餐 2是X套餐
        });
        var json1;
        $.ajax({
            url: api_url + "/cyms/return_health_check_set.php",
            type: "POST",
            cache: false,
            async: false,
            data: { "requestObject": sJson },
            dataType: "json",
            success: function (data) {
                json1 = data.objects[0][0].items;
                console.log(json1);//取出物件長度  
                XsetAppend = '<button class="accordion bold" style="font-size: 3.5vmax; text-align: left;">1+"X"专项选择<i class="fa fa-angle-down"></i> </button>';
                XsetAppend += '<div class="panel">';
                for (var i = 0; i < json1.length; i++) {
                    XsetAppend += '<div class="row itemRow">';
                    XsetAppend += '<li class="contentList  col-xs-2">';
                    XsetAppend += '<input style="margin: 10px" type="checkbox" onclick="onChange();" name="xadd" value="' + json1[i].price + '" id="xhid_' + json1[i].hid + '">';
                    XsetAppend += '</li>';
                    XsetAppend += '<li class="contentList  col-xs-8">';
                    XsetAppend += '<div class="strong"><label for="xhid_' + json1[i].hid + '">' + json1[i].name + '<light> ¥' + json1[i].price + '</light></label></div>';
                    XsetAppend += '</li>';
                    XsetAppend += '<li class="contentList  col-xs-2"><label onclick="show_Xpicture(\'' + json1[i].hid + '\',\'' + json1[i].info + '\')"><second><i style="color:blue;text-decoration:underline;font-size: 3vmax;font-style:normal;">明細</i></second></label> </li>';
                    XsetAppend += '</div>';
                }
                XsetAppend += '</div>';
                $("#XsetAppend").attr("style", "display:block;padding: 10px 0px;");
                $("#XsetAppend").append(XsetAppend);

            }
        });
    }

    //取套餐附加項目
    var sJson = JSON.stringify({
        choose: 1
    });
    $.ajax({
        url: api_url + "/cyms/return_health_check_addItem.php",
        type: "POST",
        cache: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects);
            json = data.objects;
            
            var AddItemAppend = '';
            if (json != null) {
                AddItemAppend = '<div class="row">';
                AddItemAppend += '<li class="contentList strong col-xs-2"></li>';
                AddItemAppend += '<li class="contentList strong col-xs-5">项目名称</li>';
                AddItemAppend += '<li class="contentList strong col-xs-5">项目内容</li>';
                AddItemAppend += '</div>';
                for (var i = 0; i < json.length; i++) {
                    AddItemAppend += '<div class="row itemRow" id="div' + '' + json[i].ahid + '">';
                    AddItemAppend += '<li class="contentList  col-xs-2">';
                    AddItemAppend += '<input style="margin: 10px" type="checkbox" onclick="onChange();" name="add" value="' + json[i].price + '" id="ahid_' + '' + json[i].ahid + '">';
                    AddItemAppend += '</li>';
                    AddItemAppend += '<li class="contentList  col-xs-5">';
                    if (json[i].name == "#")
                        json[i].name = "";
                    AddItemAppend += '<div class="strong"><label for="ahid_' + '' + json[i].ahid + '">' + json[i].class + '<BR><second>' + json[i].name + '<light> ¥' + json[i].price + '</label></div>';
                    AddItemAppend += '</li>';
                    AddItemAppend += '<li class="contentList col-xs-5">' + json[i].content + '</li>';
                    AddItemAppend += '</div>';
                }

                $("#AddItem").append(AddItemAppend);
                //div93--5999;div94--6999;div95--3999
                if(category_id==6||category_id==8){
                    document.getElementById("div94").style.display="none";
                    document.getElementById("div95").style.display="none";
                }else if(category_id==7){
                    document.getElementById("div93").style.display="none";
                    document.getElementById("div95").style.display="none";
                }else if(category_id==1||category_id==2||category_id==15){
                    document.getElementById("div93").style.display="none";
                    document.getElementById("div94").style.display="none";
                }else{
                    document.getElementById("div93").style.display="none";
                    document.getElementById("div94").style.display="none";
                    document.getElementById("div95").style.display="none";
                }
            }
            else {
                $("#AddItem").append('<div class="row itemRow"><li class="contentList strong col-xs-12 ">' +
                    '暫無資料' + '</li></div>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });
    tree();

});
// 初始給值 end


//樹狀展開 start
function tree() {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display == "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
}
//樹狀展開 end

//點選附加項目 start
function onChange() {
    var addItem = 0;
    var xItem = 0;
    var tmp;
    $('input:checkbox:checked[name="add"]').each(function (i) { addItem += parseFloat(this.value); });
    $('input:checkbox:checked[name="xadd"]').each(function (i) { xItem += parseFloat(this.value); });
    tmp = parseFloat(totalPrice) + parseFloat(addItem) + parseFloat(xItem);
    $("#total_price").html("¥" + tmp);
}
//點選附加項目 end


//點预约進入選日期 start
function Reservation() {
    var addItem = "";
    var xItem = "";
    $('input:checkbox:checked[name="add"]').each(function (i) { addItem += this.id; });
    $('input:checkbox:checked[name="xadd"]').each(function (i) { xItem += this.id; });
    window.location.href = 'healthCheck3.html?hid=' + hid + "&addItem=" + addItem + "&xItem=" + xItem;
}
//點预约進入選日期 end

// 給健檢套餐連結 start
function healthCheckSet_connect() {
    window.location.href = 'healthCheck1.html?hid=' + hid;
}
// 給健檢套餐連結 end

//「X」专项详情 start
function show_Xpicture(xhid, xinfo) {
    
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "「X」专项详情";
    var XItemAppend = '';

    //取健檢項目
    var sJson = JSON.stringify({
        hid: xhid
    });
    $.ajax({
        url: api_url + "/cyms/return_health_check_detail.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects[0]);
            json = data.objects[0];
            if (json != null) {
                XItemAppend += '<div class="row itemRow"><li class="contentList  col-xs-12">' +
                    xinfo + '</li></div>';
                for (var i = 0; i < json.length; i++) {
                    XItemAppend += '<div class="row itemRow_title" style="background: #f5d794;"><li class="contentList strong col-xs-12 ">' +
                        json[i].name + '</li></div>';
                    var jsonitems = json[i].items.length;
                    for (var j = 0; j < jsonitems; j++) {
                        XItemAppend += '<div class="row itemRow"><li class="contentList  col-xs-4"><div class="strong">' +
                            json[i].items[j].name + '</div>';
                        if (json[i].items[j].other != "" && json[i].items[j].other != ".")
                            XItemAppend += '<br>' + json[i].items[j].other;
                        XItemAppend += '</li><li class="contentList col-xs-8">' + json[i].items[j].content + '</li></div>';
                    }
                }
            }
            else {
                XItemAppend += '<div class="row itemRow_title"><li class="contentList strong col-xs-12 ">' + '暫無資料' + '</li></div>';
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
        }
    });

    $('#modal-body').append(XItemAppend);
    $('#exampleModalBtn').append('<button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>');
    $("#exampleModalLong").modal("show");
}
//「X」专项详情 end

//套餐详情 start
function show_detail() {
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "检查项目";

    $('#modal-body').append(healthCheckItemAppend);
    $('#exampleModalBtn').append('<button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>');
    $("#exampleModalLong").modal("show");
}
//套餐详情 end