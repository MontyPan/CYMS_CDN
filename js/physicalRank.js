function load_PhysicalRank() {

    var nowTime = new Date();
    var Y = nowTime.getFullYear();
    var M = (nowTime.getMonth() + 1);
    var D = nowTime.getDate();
    //YYYY-MM-DD
    var time = Y + "-" + ((M + 1) < 10 ? '0' : '') + M + "-" + ((D + 1) < 10 ? '0' : '') + D ;

    var sJson = JSON.stringify
        ({
            manage_oid: 1,
            date: time,
        });
        console.log(sJson)
    $.ajax({
        type: "POST",
        data: { "requestObject": sJson },
        dataType: "json",
        url: api_url + "/cyms/return_physical_rank.php",
        success: function (data) {
            $.each(data.objects, function (index, element) {
                console.log(element);
                $('#rank').append(
                    $('<div><div class="activity-row" style="padding: 10px 0px"><span class="col-xs-4 bold" style="font-size: 4vmax; text-align: center;">第'+ (index+1)+'名</span><span class="col-xs-4 bold" style="font-size: 4vmax; text-align: center;">'+ element.name + '</span><div class="clearfix"> </div></div></div><div>')); 
            });
            console.log(data);
        },
    });
};