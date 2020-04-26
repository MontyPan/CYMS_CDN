var ReadData = function () {
    var llll1ll1l1l1l1l1l = getFuncInfo();
    if(lllllllllllllllll) {
        var user = getUserDetail();
    }
    ReadScaleList.init();
    ReadScaleResultList.init();
};

var showInput = function () {
    $("#scale_list_div").css("display", "block");
    $("#scale_result_list_div").css("display", "none");
};

var showResult = function () {
    $("#scale_list_div").css("display", "none");
    $("#scale_result_list_div").css("display", "block");
};

var goInput = function (caption, lid, sid, period, version, type) {
    setLocalStorageItem("scale-caption", caption);
    setLocalStorageItem("scale-lid", lid);
    setLocalStorageItem("scale-sid", sid);
    setLocalStorageItem("scale-period", period);
    setLocalStorageItem("scale-version", version);
    setLocalStorageItem("scale-type", type);
    window.location.href = "./ScaleInput.html";
}

var goResult = function (caption, lid, sid, period, version, type) {
    setLocalStorageItem("scale-caption", caption);
    setLocalStorageItem("scale-lid", lid);
    setLocalStorageItem("scale-sid", sid);
    setLocalStorageItem("scale-period", period);
    setLocalStorageItem("scale-version", version);
    setLocalStorageItem("scale-type", type);
    window.location.href = "./ScaleResult.html";
}

var ReadScaleList = (function () {
    var renderList = function (datas) {
        $("#scale_list").html("");
        var content = "";
        var count = 0;
        $.each(datas, function (index, data) {
            if (data.type === "single" || data.type === "single_realtime_score") {
                content += "<div class='activity-row' style='padding: 10px 0px'></div>";
                content += "<i class='col-xs-4 activity-img' style='text-align: center; margin-left: -5%; margin-top: 5%;'>";
                content += "<img src='images/icon_survey.png' width='40' height='40' class='img-responsive'>";
                content += "</i>";
                content += "<div class='col-xs-8 row' style='margin: 0 0 0 -7%;'>";
                content += "<div class='col-xs-12' style='font-size: 2.5vmax;'>" + data.caption + "</div>";
                content += "<div class='col-xs-12' style='font-size: 2vmax; margin-top: 3%;'>" + $.i18n("deadline") + data.et + "</div>";
                content += "<button type='button' class='btn btn-info' style='font-size: 2vmax; margin-top: 3%;' onclick='goInput(\"" + data.caption + "\", " + data.lid + ", " + data.sid + ", " + data.period + "," + data.version + ", \"" + data.type + "\");'>" + $.i18n("fill_in") + "</button>";
                content += "</div>";
                content += "<div class='clearfix'> </div>";
                content += "</div>";
                count++;
            }
        });
        $("#scale_list").html(content);
        if (count === 0) {
            setEmptyList();
        }
    }
    var setEmptyList = function () {
        $("#scale_list").html("");
        var content = "<li class='list-group-item row'>";
        content += "<span><font color='red'>" + $.i18n("no_estimate_questionnaire") + "</font></span>";
        content += "</li>";
        $("#scale_list").html(content);
    }

    return {
        init: function () {
            var data = {};
            data.uid = getLocalStorageItem("uid");
            data.role = "client";
            data.op_uid = getLocalStorageItem("uid");
            data.locale = dontCare.decideLocale();
            var url = api_url + "/cyms/return_scale_list.php";
            $.ajax({
                type: "POST",
                data: { "requestObject": JSON.stringify(data) },
                dataType: "json",
                url: url,
                success: function (data) {
                    // console.log(data);
                    if (data.success === 200) {
                        if (data.objects.length > 0) {
                            renderList(data.objects);
                        }
                        else {
                            setEmptyList();
                        }
                    }
                    else {
                        setEmptyList();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("ajax error:" + jqXHR.responseText);
                }
            });
        }
    };
})();

var ReadScaleResultList = (function () {
    var renderList = function (datas) {
        $("#scale_result_list").html("");
        var content = "";
        var count = 0;
        $.each(datas, function (index, data) {
            if (data.type === "single" || data.type === "single_realtime_score") {
                content += "<div class='activity-row' style='padding: 10px 0px'></div>";
                content += "<i class='col-xs-4 activity-img' style='text-align: center; margin-left: -5%; margin-top: 5%;'>";
                content += "<img src='images/icon_survey.png' width='40' height='40' class='img-responsive'>";
                content += "</i>";
                content += "<div class='col-xs-8 row' style='margin: 0 0 0 -7%;'>";
                content += "<div class='col-xs-12' style='font-size: 2.5vmax;'>" + data.caption + "</div>";
                content += "<div class='col-xs-12' style='font-size: 2vmax; margin-top: 3%;'>" + $.i18n("fill_in_time") + data.ans_time + "</div>";
                content += "<button type='button' class='btn btn-info' style='font-size: 2vmax; margin-top: 3%;' onclick='goResult(\"" + data.caption + "\", " + data.lid + ", " + data.sid + ", " + data.period + "," + data.version + ", \"" + data.type + "\");'>" + $.i18n("watch") + "</button>";
                content += "</div>";
                content += "<div class='clearfix'> </div>";
                content += "</div>";
                count++;
            }
        });
        $("#scale_result_list").html(content);
        if (count === 0) {
            setEmptyList();
        }
    }
    var setEmptyList = function () {
        $("#scale_result_list").html("");
        var content = "<li class='list-group-item row'>";
        content += "<span><font color='red'>" + $.i18n("no_estimate_result") + "</font></span>";
        content += "</li>";
        $("#scale_result_list").html(content);
    }

    return {
        init: function () {
            var data = {};
            data.uid = getLocalStorageItem("uid");
            data.role = "client";
            data.op_uid = getLocalStorageItem("uid");
            data.locale = dontCare.decideLocale();
            var url = api_url + "/cyms/return_scale_result_list.php";
            $.ajax({
                type: "POST",
                data: { "requestObject": JSON.stringify(data) },
                dataType: "json",
                url: url,
                success: function (data) {
                    console.log(data);
                    if (data.success === 200) {
                        if (data.objects.length > 0) {
                            renderList(data.objects);
                        }
                        else {
                            setEmptyList();
                        }
                    }
                    else {
                        setEmptyList();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("ajax error:" + jqXHR.responseText);
                }
            });
        }
    };
})();