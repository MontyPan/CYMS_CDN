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
        time = Y + "/" + ((M + 1) < 10 ? '0' : '') + M + "/" + ((D + 1) < 10 ? '0' : '') + D + "-" + Y + "/" + ((M + 1) < 10 ? '0' : '') + M + "/" + ((D + 1) < 10 ? '0' : '') + D;

        // var select = document.getElementById("date_select").value;
        // var start = select.split("-")[0];
        // start = start.substr(0,start.length-1);
        // var end = select.split("-")[1];
        // end = end.substr(1,end.length);
        // time = start + "-" + end;
        console.log(time)

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
    getHealth(choice, time);
    console.log(choice);
};


function getHealth(choice, time) {
    var uid =getLocalStorageItem("patient_uid");
    var data = {};
    data.uid = uid;
    data.choice = choice;
    data.time = time;

    var node_data = {};
    node_data.api = "/trend/health_result";
    node_data.postData = JSON.stringify(data);
    var url = api_url + "/cyms/php2node.php";

    $.ajax({
        type: 'POST',
        data: { "requestObject": JSON.stringify(node_data) },
        dataType: "json",
        async: false,
        url: url,
        success: function (data) {
            $('#pressure_div').html("");
            document.getElementById("pressure_div").style.height = "500px";
            var datas = data.measurements;
            console.log(datas.length)
            if (datas.length == 0) {
                $('#health_no_data_div').css('display', 'block');
                $('#health_have_data_div').css('display', 'none');
                //   $('#pressure_div').css('display', 'none');
                //    $('#glucose_div').css('display', 'none');
                //    $('#pulse_breathe_div').css('display', 'none');
                //     $('#spo2_div').css('display', 'none');
                //    $('#bmi_div').css('display', 'none');
            }
            else {
                $('#health_no_data_div').css('display', 'none');
                $('#health_have_data_div').css('display', 'block');
                //                    $('#pressure_div').css('display', 'block');
                //                    $('#glucose_div').css('display', 'block');
                //                    $('#pulse_breathe_div').css('display', 'block');
                //                    $('#spo2_div').css('display', 'none');
                //                    $('#bmi_div').css('display', 'block');
                var start = new Date(data.start); //yyyy-mm-dd
                var end = new Date(data.end); //yyyy-mm-dd
                //体温
                var temperatureData=[];
                //血壓　－　收縮壓　舒張壓
                var pressureData = [];
                // while (start <= end) {
                //     var mm = ((start.getMonth() + 1) >= 10) ? (start.getMonth() + 1) : '0' + (start.getMonth() + 1);
                //     var dd = ((start.getDate()) >= 10) ? (start.getDate()) : '0' + (start.getDate());
                //     var yyyy = start.getFullYear();
                //     var date = yyyy + "-" + mm + "-" + dd; //yyyy-mm-dd
                //     var check = 0;
                //     datas.forEach(function (record) {
                //         if (record.date == date && record.sbp != "" && record.dbp != "") {
                //             check = 1;
                //             pressureData.push({
                //                 date: record.date + " " + record.time,
                //                 sbp: record.sbp,
                //                 dbp: record.dbp
                //             });
                //         }
                //         if (check == 1 && record.date != date)
                //             return;
                //     });
                //     if (check == 0) {
                //         pressureData.push({ date: date });
                //     }
                //     start = new Date(start.setDate(start.getDate() + 1)); //date increase by 1
                // }
                
                //血糖
                var glucoseData = [];
                // start = new Date(data.start); //yyyy-mm-dd
                // end = new Date(data.end); //yyyy-mm-dd
                // while (start <= end) {
                //     var mm = ((start.getMonth() + 1) >= 10) ? (start.getMonth() + 1) : '0' + (start.getMonth() + 1);
                //     var dd = ((start.getDate()) >= 10) ? (start.getDate()) : '0' + (start.getDate());
                //     var yyyy = start.getFullYear();
                //     var date = yyyy + "-" + mm + "-" + dd; //yyyy-mm-dd
                //     var check = 0;
                //     datas.forEach(function (record) {
                //         if (record.date == date && record.sugar != "-") {
                //             check = 1;
                //             glucoseData.push({
                //                 date: record.date + " " + record.time,
                //                 sugar: record.sugar
                //             });
                //         }
                //         if (check == 1 && record.date != date)
                //             return;
                //     });
                //     if (check == 0) {
                //         glucoseData.push({ date: date });
                //     }
                //     start = new Date(start.setDate(start.getDate() + 1)); //date increase by 1
                // }

                //脈搏呼吸
                var pulsebreatheData = [];
                // start = new Date(data.start); //yyyy-mm-dd
                // end = new Date(data.end); //yyyy-mm-dd
                // while (start <= end) {
                //     var mm = ((start.getMonth() + 1) >= 10) ? (start.getMonth() + 1) : '0' + (start.getMonth() + 1);
                //     var dd = ((start.getDate()) >= 10) ? (start.getDate()) : '0' + (start.getDate());
                //     var yyyy = start.getFullYear();
                //     var date = yyyy + "-" + mm + "-" + dd; //yyyy-mm-dd
                //     var check = 0;
                //     datas.forEach(function (record) {
                //         if (record.date == date && (record.breathe != "-" || record.pulse != "-")) {
                //             check = 1;
                //             pulsebreatheData.push({
                //                 date: record.date + " " + record.time,
                //                 breathe: record.breathe,
                //                 pulse: record.pulse
                //             });
                //         }
                //         if (check == 1 && record.date != date)
                //             return;
                //     });
                //     if (check == 0) {
                //         pulsebreatheData.push({ date: date });
                //     }
                //     start = new Date(start.setDate(start.getDate() + 1)); //date increase by 1
                // }

                //血氧
                var spo2Data = [];
                // start = new Date(data.start); //yyyy-mm-dd
                // end = new Date(data.end); //yyyy-mm-dd
                // while (start <= end) {
                //     var mm = ((start.getMonth() + 1) >= 10) ? (start.getMonth() + 1) : '0' + (start.getMonth() + 1);
                //     var dd = ((start.getDate()) >= 10) ? (start.getDate()) : '0' + (start.getDate());
                //     var yyyy = start.getFullYear();
                //     var date = yyyy + "-" + mm + "-" + dd; //yyyy-mm-dd
                //     var check = 0;
                //     datas.forEach(function (record) {
                //         if (record.date == date && record.spo2 != "-") {
                //             check = 1;
                //             spo2Data.push({
                //                 date: record.date + " " + record.time,
                //                 spo2: record.spo2
                //             });
                //         }
                //         if (check == 1 && record.date != date)
                //             return;
                //     });
                //     if (check == 0) {
                //         spo2Data.push({ date: date });
                //     }
                //     start = new Date(start.setDate(start.getDate() + 1)); //date increase by 1
                // }

                // BMI 體重
                var bmiData = [];
                // start = new Date(data.start); //yyyy-mm-dd
                // end = new Date(data.end); //yyyy-mm-dd
                // while (start <= end) {
                //     var mm = ((start.getMonth() + 1) >= 10) ? (start.getMonth() + 1) : '0' + (start.getMonth() + 1);
                //     var dd = ((start.getDate()) >= 10) ? (start.getDate()) : '0' + (start.getDate());
                //     var yyyy = start.getFullYear();
                //     var date = yyyy + "-" + mm + "-" + dd; //yyyy-mm-dd
                //     var check = 0;
                //     datas.forEach(function (record) {
                //         if (record.date == date && record.height != "-" && record.weight != "-") {
                //             check = 1;
                //             var bmi = record.weight / ((record.height / 100) * (record.height / 100));
                //             bmi = bmi.toFixed(2);
                //             bmiData.push({
                //                 date: record.date + " " + record.time,
                //                 bmi: bmi,
                //                 weight: record.weight
                //             });
                //         }
                //         if (check == 1 && record.date != date)
                //             return;
                //     });
                //     if (check == 0) {
                //         bmiData.push({ date: date });
                //     }
                //     start = new Date(start.setDate(start.getDate() + 1)); //date increase by 1
                // }


                datas.forEach(function (record) {
                    temperatureData.push({
                        date: record.date + " " + record.time,
                        temperature: record.temperature,
                        limit: 37.3
                    });
                    pressureData.push({
                        date: record.date + " " + record.time,
                        sbp: record.sbp,
                        dbp: record.dbp
                    });
                    glucoseData.push({
                        date: record.date + " " + record.time,
                        sugar: record.sugar
                    });
                    pulsebreatheData.push({
                        date: record.date + " " + record.time,
                        breathe: record.breathe,
                        pulse: record.pulse
                    });
                    spo2Data.push({
                        date: record.date + " " + record.time,
                        spo2: record.spo2
                    });
                    if (record.height != "-" && record.weight != "-") {
                        var bmi = record.weight / ((record.height / 100) * (record.height / 100));
                        bmi = bmi.toFixed(2);
                        bmiData.push({
                            date: record.date + " " + record.time,
                            bmi: bmi,
                            weight: record.weight
                        });
                    }
                });
                //体温
                var chart1 = AmCharts.makeChart("temperature_div", {
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "useGraphSettings": true
                    },
                    "dataProvider": temperatureData,
                    "graphs": [{
                        "valueAxis": "v4",
                        "connect": false,
                        "lineColor": "#00FFFF",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": $.i18n("body_temperature") + "(℃)",
                        "valueField": "temperature",
                        "fillAlphas": 0,
                        "labelText": "[[value]]",
                        "labelFunction": function (item, label) {
                            return label == "0" ? "" : label;
                        }
                    },{
                        "valueAxis": "v5",
                        "connect": false,
                        "lineColor": "#FF8888",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": $.i18n("warning_message"),
                        "valueField": "limit",
                        "fillAlphas": 0,
                        "labelText": "[[value]]",
                        "labelFunction": function (item, label) {
                            return label == "0" ? "" : label;
                        }
                    }],
                    "chartScrollbar": {},
                    "chartCursor": {
                        "pan": true,
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "valueLineAlpha": 0.2
                    },
                    "categoryField": "date",
                    "categoryAxis": {
                        "parseDates": false,
                        "axisColor": "#DADADA",
                        "dashLength": 1,
                        "minorGridEnabled": true,
                        "labelRotation": 45
                    },
                    "export": {
                        "enabled": true,
                        "position": "bottom-right"
                    }
                });
                chart1.addListener("dataUpdated", zoomChart);

                //血壓 - 收縮壓 舒張壓
                var chart = AmCharts.makeChart("pressure_div", {
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "useGraphSettings": true
                    },
                    "dataProvider": pressureData,
                    "graphs": [{
                        "valueAxis": "v4",
                        "connect": false,
                        "lineColor": "#00FFFF",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": $.i18n("systolic_blood_pressure") + "(mmHg)",
                        "valueField": "sbp",
                        "fillAlphas": 0,
                        "labelText": "[[value]]",
                        "labelFunction": function (item, label) {
                            return label == "0" ? "" : label;
                        }
                    }, {
                        "valueAxis": "v5",
                        "connect": false,
                        "lineColor": "#9900FF",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": $.i18n("diastolic_blood_pressure") + "(mmHg)",
                        "valueField": "dbp",
                        "fillAlphas": 0,
                        "labelText": "[[value]]",
                        "labelFunction": function (item, label) {
                            return label == "0" ? "" : label;
                        }
                    }],
                    "chartScrollbar": {},
                    "chartCursor": {
                        "pan": true,
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "valueLineAlpha": 0.2
                    },
                    "categoryField": "date",
                    "categoryAxis": {
                        "parseDates": false,
                        "axisColor": "#DADADA",
                        "dashLength": 1,
                        "minorGridEnabled": true,
                        "labelRotation": 45
                    },
                    "export": {
                        "enabled": true,
                        "position": "bottom-right"
                    }
                });
                chart.addListener("dataUpdated", zoomChart);

                //血糖
                var chart2 = AmCharts.makeChart("glucose_div", {
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "useGraphSettings": true
                    },
                    "dataProvider": glucoseData,
                    "graphs": [{
                        "valueAxis": "v4",
                        "connect": false,
                        "lineColor": "#00FFFF",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": $.i18n("blood_glucose") + "(mmol/L)",
                        "valueField": "sugar",
                        "fillAlphas": 0,
                        "labelText": "[[value]]",
                        "labelFunction": function (item, label) {
                            return label == "0" ? "" : label;
                        }
                    }],
                    "chartScrollbar": {},
                    "chartCursor": {
                        "pan": true,
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "valueLineAlpha": 0.2
                    },
                    "categoryField": "date",
                    "categoryAxis": {
                        "parseDates": false,
                        "axisColor": "#DADADA",
                        "dashLength": 1,
                        "minorGridEnabled": true,
                        "labelRotation": 45
                    },
                    "export": {
                        "enabled": true,
                        "position": "bottom-right"
                    }
                });
                chart2.addListener("dataUpdated", zoomChart);

                //脈搏呼吸
                var chart3 = AmCharts.makeChart("pulse_breathe_div", {
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "useGraphSettings": true
                    },
                    "dataProvider": pulsebreatheData,
                    "graphs": [{
                        "valueAxis": "v4",
                        "connect": false,
                        "lineColor": "#00FFFF",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": $.i18n("pulse") + $.i18n("times_per_min"),
                        "valueField": "pulse",
                        "fillAlphas": 0,
                        "labelText": "[[value]]",
                        "labelFunction": function (item, label) {
                            return label == "0" ? "" : label;
                        }
                    }, {
                        "valueAxis": "v5",
                        "connect": false,
                        "lineColor": "#9900FF",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": $.i18n("breathe") + $.i18n("times_per_min"),
                        "valueField": "breathe",
                        "fillAlphas": 0,
                        "labelText": "[[value]]",
                        "labelFunction": function (item, label) {
                            return label == "0" ? "" : label;
                        }
                    }],
                    "chartScrollbar": {},
                    "chartCursor": {
                        "pan": true,
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "valueLineAlpha": 0.2
                    },
                    "categoryField": "date",
                    "categoryAxis": {
                        "parseDates": false,
                        "axisColor": "#DADADA",
                        "dashLength": 1,
                        "minorGridEnabled": true,
                        "labelRotation": 45
                    },
                    "export": {
                        "enabled": true,
                        "position": "bottom-right"
                    }
                });
                chart3.addListener("dataUpdated", zoomChart);

                var chart4 = AmCharts.makeChart("spo2_div", {
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "useGraphSettings": true
                    },
                    "dataProvider": spo2Data,
                    "graphs": [{
                        "valueAxis": "v4",
                        "connect": false,
                        "lineColor": "#00FFFF",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": $.i18n("blood_oxygen") + "(％)",
                        "valueField": "spo2",
                        "fillAlphas": 0,
                        "labelText": "[[value]]",
                        "labelFunction": function (item, label) {
                            return label == "0" ? "" : label;
                        }
                    }],
                    "chartScrollbar": {},
                    "chartCursor": {
                        "pan": true,
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "valueLineAlpha": 0.2
                    },
                    "categoryField": "date",
                    "categoryAxis": {
                        "parseDates": false,
                        "axisColor": "#DADADA",
                        "dashLength": 1,
                        "minorGridEnabled": true,
                        "labelRotation": 45
                    },
                    "export": {
                        "enabled": true,
                        "position": "bottom-right"
                    }
                });
                chart4.addListener("dataUpdated", zoomChart);

                var chart5 = AmCharts.makeChart("bmi_div", {
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "useGraphSettings": true
                    },
                    "dataProvider": bmiData,
                    "graphs": [{
                        "valueAxis": "v4",
                        "connect": false,
                        "lineColor": "#00FFFF",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": "BMI(kg/m²)",
                        "valueField": "bmi",
                        "fillAlphas": 0,
                        "labelText": "[[value]]",
                        "labelFunction": function (item, label) {
                            return label == "0" ? "" : label;
                        }
                    }, {
                        "valueAxis": "v5",
                        "connect": false,
                        "lineColor": "#9900FF",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": $.i18n("weight") + "(kg)",
                        "valueField": "weight",
                        "fillAlphas": 0,
                        "labelText": "[[value]]",
                        "labelFunction": function (item, label) {
                            return label == "0" ? "" : label;
                        }
                    }],
                    "chartScrollbar": {},
                    "chartCursor": {
                        "pan": true,
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "valueLineAlpha": 0.2
                    },
                    "categoryField": "date",
                    "categoryAxis": {
                        "parseDates": false,
                        "axisColor": "#DADADA",
                        "dashLength": 1,
                        "minorGridEnabled": true,
                        "labelRotation": 45
                    },
                    "export": {
                        "enabled": true,
                        "position": "bottom-right"
                    }
                });
                chart5.addListener("dataUpdated", zoomChart);

                zoomChart();
                function zoomChart() {
                    chart1.zoomToIndexes(chart.dataProvider.length - 500, chart.dataProvider.length - 1);
                    chart.zoomToIndexes(chart.dataProvider.length - 500, chart.dataProvider.length - 1);
                    chart2.zoomToIndexes(chart.dataProvider.length - 500, chart.dataProvider.length - 1);
                    chart3.zoomToIndexes(chart.dataProvider.length - 500, chart.dataProvider.length - 1);
                    chart4.zoomToIndexes(chart.dataProvider.length - 500, chart.dataProvider.length - 1);
                    chart5.zoomToIndexes(chart.dataProvider.length - 500, chart.dataProvider.length - 1);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(data);
            alert('ajax error:' + jqXHR.responseText);
        }
    });
}