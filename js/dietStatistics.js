function getRangeData() {
    var radios = document.getElementsByName('date_range');
    var choice = "week";
    var time = "";
    if (radios[0].checked == true) {
        choice = "date";
        var nowTime = new Date();
        var Y = nowTime.getFullYear();
        var M = (nowTime.getMonth() + 1);
        var D = nowTime.getDate();
        //YYYY-MM-DD-YYYY-MM-DD  起始年月日-結束年月日
        time = Y + "/" + ((M + 1) < 10 ? '0' : '') + M + "/" + (D < 10 ? '0' : '') + D + "-"
            + Y + "/" + ((M + 1) < 10 ? '0' : '') + M + "/" + (D < 10 ? '0' : '') + D;

        // var select = document.getElementById("date_select").value;
        // var start = select.split("-")[0];
        // start = start.substr(0,start.length-1);
        // var end = select.split("-")[1];
        // end = end.substr(1,end.length);
        // time = start + "-" + end;
        // console.log(time);
    }
    else if (radios[1].checked == true) {
        choice = "week";
    }
    else if (radios[2].checked == true) {
        choice = "month";
    }
    else if (radios[3].checked == true) {
        choice = "year";
    }
    getDiet(choice, time);
    // console.log(choice);
};

function getDiet(choice, time) {
    var uid = getLocalStorageItem("uid");
    var data = {};
    data.uid = uid;
    data.choice = choice;
    data.time = time;

    var node_data = {};
    node_data.api = "/trend/diet_result";
    node_data.postData = JSON.stringify(data);
    var url = api_url + "/cyms/php2node.php";

    $.ajax({
        type: 'POST',
        data: { "requestObject": JSON.stringify(node_data) },
        dataType: "json",
        async: false,
        url: url,
        success: function (data) {
            $('#diet_div').html("");
            var chartData = [];
            var datas = data.datas;
            if (datas.length == 0) {
                $('#diet_no_data_div').css('display', 'block');
                $('#diet_have_data_div').css('display', 'none');
            }
            else {
                $('#diet_no_data_div').css('display', 'none');
                $('#diet_have_data_div').css('display', 'block');
                var content = "<table><colgroup><col><col><col><colgroup><col><col><col><colgroup><col><col><col>";
                content += "<thead><tr><th colspan='2'>" + $.i18n("the_following_list_has__datas", data.count);
                content += "<tr> <td> " + $.i18n("date") + "<td>" + $.i18n("message") + "</thead> <tbody>";

                datas.forEach(function (record) {
                    content += "<tr><td align='center' width='10em'>" + record.date + "<td width='600'>";
                    record.pics.forEach(function (pics) {
                        var c = 0;
                        var sp = pics.path.toString().split("/");
                        pics.pic =  pics.pic.replace("https", "http");
                        var acc = "null", filename = "null", type = "null";
                        if (pics.pic.indexOf("images/record.png") >= 0 || pics.pic.indexOf("images/water.png") >= 0) {
                            pics.pic = "../cyms_client/" + pics.pic;
                        }
                        if (pics.path.indexOf("amr") >= 0 || pics.path.indexOf("m4a") >= 0) {
                            acc = sp[5];
                            filename = sp[6].split(".")[0];
                            if (pics.path.indexOf("amr") >= 0) {
                                type = 1;
                                content += "<a class='" + pics.class_name + "'><img src='" + pics.pic + "'alt='' width='100' height='100' border='0' title='" + pics.title + "' onclick='playRecord(\"" + acc + "\"," + filename + "," + type + ");'>" + pics.info;
                            }
                            else if (pics.path.indexOf("m4a") >= 0) {
                                type = 2;
                                content += "<a class='" + pics.class_name + "'><img src='" + pics.pic + "'alt='' width='100' height='100' border='0' title='" + pics.title + "' onclick='playRecord(\"" + acc + "\"," + filename + "," + type + ");'>" + pics.info;
                            }
                        }
                        else{
                            content += "<a class='" + pics.class_name + "'><img src='" + pics.pic + "'alt='' width='100' height='100' border='0' title='" + pics.title + "'>" + pics.info;
                        }
                           
                        if (pics.class_name == 'thumb') {
                            content += "<span><img src='" + pics.pic + "' alt='' width='200' height='200' border='0'></span>";
                        }
                        content += "</a>";
                        if (c % 4 == 3) {
                        }
                        c = c + 1;
                    });
                });

                content += "</tbody></table>";
                $('#diet_div').append(content);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(data);
            //alert('ajax error:' + jqXHR.responseText);
        }
    });
}

function playRecord(acc, filename, type) {
    if (acc != null && filename != null) {
        var path = "";
        if (type == 1) {
            path = api_url + "/BENQ_IMAGE/User/" + acc + "/" + filename + ".mp3";
            var audio = $("#mp3player");
            $("#mp3_src").attr("src", path);
            audio[0].pause();
            audio[0].load();//suspends and restores all audio element
            audio[0].play(); // changed based on Sprachprofi's comment below
            audio[0].oncanplaythrough = audio[0].play();
            $('#mp3Modal').modal('show');
        }
        else if (type == 2) {
            path = api_url + "/BENQ_IMAGE/User/" + acc + "/" + filename + ".m4a";
            var audio = $("#m4aplayer");
            $("#m4a_src").attr("src", path);
            audio[0].pause();
            audio[0].load();//suspends and restores all audio element
            audio[0].play(); // changed based on Sprachprofi's comment below
            audio[0].oncanplaythrough = audio[0].play();
            $('#m4aModal').modal('show');
        }
    }

}