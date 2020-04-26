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
        //YYYY/MM/DD-YYYY/MM/DD  起始年月日-結束年月日
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
    getSport(choice, time);
    // console.log(choice);
};


function getSport(choice, time) {
    var uid = getLocalStorageItem("uid");
    //var uid = 6;
    var data = {};
    data.uid = uid;
    data.choice = choice;
    data.time = time;

    var node_data = {};
    node_data.api = "/trend/sport_time";
    node_data.postData = JSON.stringify(data);
    var url = api_url + "/cyms/php2node.php";

    $.ajax({
        type: 'POST',
        data: { "requestObject": JSON.stringify(node_data) },
        dataType: "json",
        async: false,
        url: url,
        success: function (data) {
            $('#sport_div').html("");
            var chartData = [];
            var datas = data.datas;
            if (datas.length == 0) {
                $('#sport_no_data_div').css('display', 'block');
                $('#sport_have_data_div').css('display', 'none');
            }
            else {
                $("#sport_div").height("500px");
                $('#sport_no_data_div').css('display', 'none');
                $('#sport_have_data_div').css('display', 'block');
                datas.forEach(function (record) {
                    chartData.push({
                        date: record.date,
                        ex_sum: (record.ex_sum / 60).toFixed(2)
                    });
                });
                var chart = AmCharts.makeChart("sport_div", {
                    "type": "serial",
                    "theme": "light",
                    "dataProvider": chartData,
                    "valueAxes": [{
                        "gridColor": "#FFFFFF",
                        "gridAlpha": 0.2,
                        "dashLength": 0,
                        "title": $.i18n("total_exercise_minutes")
                    }],
                    "gridAboveGraphs": true,
                    "startDuration": 0,
                    "graphs": [{
                        "balloonText": "[[category]]: <b>[[value]] " + $.i18n("minute") + "</b>",
                        "fillAlphas": 0.8,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "ex_sum"
                    }],
                    "depth3D": 20,
                    "angle": 30,
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "date",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "labelRotation": 30
                    },
                    "export": {
                        "enabled": true
                    }

                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(data);
            //alert('ajax error:' + jqXHR.responseText);
        }
    });
}