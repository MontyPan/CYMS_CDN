//初始 start
var Consumable;
$(document).ready(function () {

    //取物资列表
    var sJson = JSON.stringify({
        choose: 1,//choose 1列出物资
    });
    $.ajax({
        url: api_url + "/cyms/consumables_list.php",
        type: "POST",
        cache: false,
        async: false,
        data: { "requestObject": sJson },
        dataType: "json",
        success: function (data) {
            console.log(data.objects);
            var ConsumableAppend="";
            json=data.objects;
            Consumable=data.objects;
            for (var i = 0; i < json.length; i++) {
                ConsumableAppend+='<div class="activity-row" style="padding: 10px 0px">';
                ConsumableAppend+='<div class="col-xs-6 bold" style="font-size: 3vmax; text-align: center;">'+json[i].con_name+'</div>';
                ConsumableAppend+='<div class="col-xs-2 bold" style="text-align: center;padding: 0;margin-top: 5px;">';
                ConsumableAppend+='<select style="font-size: 3vmax;" id="'+json[i].con_id+'" onchange="onChange();">';
                ConsumableAppend+='<option value="0">0</option>';
                ConsumableAppend+='<option value="1">1</option>';
                ConsumableAppend+='<option value="2">2</option>';
                ConsumableAppend+='<option value="3">3</option>';
                ConsumableAppend+='</select>';
                ConsumableAppend+='</div>';
                ConsumableAppend+='<div class="col-xs-4 bold"  value="'+json[i].con_price+'">单价:<strong>¥'+json[i].con_price+'</strong></div>';
                ConsumableAppend+='<div class="clearfix"> </div>';
                ConsumableAppend+='</div>';
            }
            $("#ConsumableItem").append(ConsumableAppend);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
    // $("#1").change(function(){alert('Handler for .change() called.');});
    
});
//初始 end



//计价器 start
function onChange() {
    var totalprice=0;
    for (var i = 0; i < Consumable.length; i++) {
        var tmp=$("#"+Consumable[i].con_id).val();
        totalprice+=parseFloat(tmp)*Consumable[i].con_price;
        $("#total_price").html("¥" + totalprice);
    }
}
//计价器 end



//跳视窗 start
function sumbit() {
    //显示预约成功 跳回主页
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "信息";
    $('#modal-body').append('已订购口罩3份，酒精棉片3份!<BR>寄送地址:<textarea rows="2" name="S1" cols="40" style="resize: none;">中國江苏省南京市建邺区河西大街71号</textarea>');
    $('#exampleModalBtn').append('<button type="button" class="btn btn-primary" onclick="window.location.href=' + "'Home.html'" + '">确定</button>');
    $("#exampleModalLong").modal("show");
}
//跳视窗 end