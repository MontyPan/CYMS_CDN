// 給健檢套餐連結 start
function healthCheckSet_connect(hid) {
    window.location.href = 'healthCheck1.html?hid=' + hid;
}
// 給健檢套餐連結 end

//初始載入 start
$(document).ready(function () {
    var llll1ll1l1l1l1l1l = getFuncInfo();
    if(lllllllllllllllll) {
        var user = getUserDetail();
    }
    var json1;
    var sJson = JSON.stringify({
        tag:99   //999顯示全部套餐 99是tag0+1套餐  0是一般 1是1套餐 2是X套餐
    });
    $.ajax({
        url: api_url + "/cyms/return_health_check_set.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects);//取出物件長度  
            json1 = data.objects[0];

            var healthCheckSetAppend = '';
            for (var i = 0; i < json1.length; i++) {
                healthCheckSetAppend += '<div class="activity-row" style="padding: 10px 0px;margin: 0">';
                if (i == 0)
                    healthCheckSetAppend += '<button class="accordion bold active" style="font-size: 4vmax; text-align: center;">';
                else
                    healthCheckSetAppend += '<button class="accordion bold" style="font-size: 4vmax; text-align: center;">';

                healthCheckSetAppend += json1[i].category_name + '<i class="fa fa-angle-down"></i> </button>';
                if (i == 0)
                    healthCheckSetAppend += '<div class="panel"style="display: block;"><div class="row" style="padding: 10px 0px">';
                else
                    healthCheckSetAppend += '<div class="panel"><div class="row" style="padding: 10px 0px">';

                for (var j = 0; j < json1[i].items.length; j++) {
                    healthCheckSetAppend += '<div class="setList_btn col-xs-12" onclick="healthCheckSet_connect(' + json1[i].items[j].hid + ')">' +
                        '<li class="row_title">' + json1[i].items[j].name + '<strong>¥' + json1[i].items[j].price + '</strong>   <button type="button" class="btn btn-primary" style="background:#247724;float: right"onclick="healthCheckSet_connect(' + json1[i].items[j].hid + ')">预约</button>';
                    if (json1[i].items[j].info != "" && json1[i].items[j].info != ".")
                        healthCheckSetAppend += '<li class="row_comtent">' + json1[i].items[j].info + '</li>';
                    healthCheckSetAppend += '</div>';
                }
                healthCheckSetAppend += '</div></div></div>';
            }
            $("#healthCheckSet").append(healthCheckSetAppend);
        }
    });
    tree();
    show(1);
});
//初始載入 end

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

//显示内容 start
function show(type) {
    if (type == 1) {
        $('#title_name').html('健检套餐分類价目一览表');
        $("#healthCheckInputID").hide();
        $("#healthCheckInputNum").hide();
        $("#healthCheckSet").show();
    }
    else if (type == 2) {
        $('#title_name').html('输入健检码');
        $("#healthCheckInputID").hide();
        $("#healthCheckInputNum").show();
        $("#healthCheckSet").hide();

    }
    else if (type == 3) {
        $('#title_name').html('输入身份证号');
        $("#healthCheckInputID").show();
        $("#healthCheckInputNum").hide();
        $("#healthCheckSet").hide();
    }
}
//显示内容 end

//警告視窗 start
function showfunction() {
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "信息";
    $('#modal-body').append('功能维护中');
    $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>');
    $("#exampleModalLong").modal("show");
};
//警告視窗 end