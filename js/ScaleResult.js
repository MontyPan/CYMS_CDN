var patient_uid = getLocalStorageItem("uid");
var caption = "";
var scale_type = "single";
var sid = 0, lid = 0;
var scale_version = 0;
var scale_period = 0;
var ScaleQuestions = [];
var ScaleOptions = [];
var ScaleRanges = [];
var tempAnswer = [];
var localeValue = dontCare.decideLocale();

//即時算分部分
var isRealTime = false;
var tempAnswerScore = [];

var errorException = function () {
    console.log("error");
    $(".btn-back").prop('disabled', false);
};

var getScaleData = (function () {
    var getLocalStorage = function () {
        caption = getLocalStorageItem("scale-caption");
        scale_type = getLocalStorageItem("scale-type");
        sid = getLocalStorageItem("scale-sid");
        lid = getLocalStorageItem("scale-lid");
        scale_version = getLocalStorageItem("scale-version");
        scale_period = getLocalStorageItem("scale-period");
    }

    var getScaleVersion = function () {
        var data = {};
        data.sid = sid;
        var url = api_url + "/cyms/return_survey_version.php";
        $.ajax({
            type: "POST",
            data: { "requestObject": JSON.stringify(data) },
            dataType: "json",
            url: url,
            success: function (data) {
                // console.log(data);
                if (data.success === 200) {
                    if (data.objects.length > 0) {
                        //$.each(data, function (index, data) {
                        //    version = data.version; 自 298ba9 之後有宣告 global 的 const version，因此會發生無法重新 assign 的 error，另外因目前這行 version 意義不明，所以先 comment 掉。
                        //});
                        getScaleQuestions();
                    }
                    else {
                        errorException();
                    }
                }
                else {
                    errorException();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                errorException();
            }
        });
    }

    var getScaleQuestions = function () {
        var node_data = {};
        node_data.api = "/api_scale/getScaleQuestion/" + sid + "?locale=" + localeValue;
        node_data.postData = "";
        var url = api_url + "/cyms/php2node.php";
        $.ajax({
            type: "POST",
            data: { "requestObject": JSON.stringify(node_data) },
            dataType: "json",
            url: url,
            success: function (datas) {
                // console.log(datas);
                if (parseInt(datas.status) === 200) {
                    if (datas.questions.length > 0) {
                        $.each(datas.questions, function (index, data) {
                            ScaleQuestions.push(data);
                        });
                        getScaleOptions();
                    }
                    else {
                        errorException();
                    }
                }
                else {
                    errorException();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                errorException();
            }
        });
    }

    var getScaleOptions = function () {
        var node_data = {};
        node_data.api = "/api_scale/getScaleOption/" + sid + "?locale=" + localeValue;
        node_data.postData = "";
        var url = api_url + "/cyms/php2node.php";
        $.ajax({
            type: "POST",
            data: { "requestObject": JSON.stringify(node_data) },
            dataType: "json",
            url: url,
            success: function (datas) {
                // console.log(datas);
                if (parseInt(datas.status) === 200) {
                    if (datas.options.length > 0) {
                        $.each(datas.options, function (index, data) {
                            ScaleOptions.push(data);
                        });
                        getScaleNumberRanges();
                    }
                    else {
                        errorException();
                    }
                }
                else {
                    errorException();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                errorException();
            }
        });
    }

    var getScaleNumberRanges = function () {
        var node_data = {};
        node_data.api = "/api_scale/getScaleNumberRange/" + sid + "?locale=" + localeValue;
        node_data.postData = "";
        var url = api_url + "/cyms/php2node.php";
        $.ajax({
            type: "POST",
            data: { "requestObject": JSON.stringify(node_data) },
            dataType: "json",
            url: url,
            success: function (datas) {
                if (datas.ranges !== null) {
                    if (datas.ranges.length > 0) {
                        $.each(datas.ranges, function (index, data) {
                            ScaleRanges.push(data);
                        });
                    }
                }
                getScaleAnswer();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                errorException();
            }
        });
    }

    return {
        init: function () {
            getLocalStorage();
            $(".scale-caption").html(caption);
            ScaleQuestions.push(null);
            ScaleOptions.push(null);
            getScaleVersion();
        }
    };
})();

var getScaleAnswer = function () {
    tempAnswer.push("null");
    var node_data = {};
    node_data.api = "/api_scale/getScaleAnswer/" + lid + "?locale=" + localeValue;
    node_data.postData = "";
    var url = api_url + "/cyms/php2node.php";
    $.ajax({
        type: "POST",
        data: { "requestObject": JSON.stringify(node_data) },
        dataType: "json",
        url: url,
        success: function (datas) {
            // console.log(datas);
            if (parseInt(datas.status) === 200) {
                if (datas.answers.length > 0) {
                    $.each(datas.answers, function (index, data) {
                        tempAnswer.push(data.a);
                    });
                    endScaleCheck();
                }
                else {
                    errorException();
                }
            }
            else {
                errorException();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            errorException();
            // alert("ajax error:" + jqXHR.responseText);
        }
    });
};

var getQuestion = function (index) {
    return ScaleQuestions[index];
};

var getOptions = function (index) {
    var options = [];
    for (var i = 0; i < ScaleOptions.length; i++) {
        if (ScaleOptions[i] !== null && ScaleOptions[i] !== undefined) {
            if (parseInt(ScaleOptions[i].o) === parseInt(index))
                options.push(ScaleOptions[i]);
        }
    }
    return options;
};

var getOptionByA = function (a) {
    var option = null;
    for (var i = 0; i < ScaleOptions.length; i++) {
        if (ScaleOptions[i] !== null && ScaleOptions[i] !== undefined) {
            if (parseInt(ScaleOptions[i].a) === parseInt(a))
                option = ScaleOptions[i];
        }
    }
    return option;
};

var endScaleCheck = function () {
    $(".download-loading-clothes").css("display", "none");
    $(".btn-back").prop('disabled', false);
    showTempAnswerList();
    $(window).scrollTop(0);
};

var showTempAnswerList = function () {
    $("#scale_temp_answer_div").css("display", "block");
    $("#scale_temp_answer_list").html("");
    var html = "", content = "";
    for (var i = 1; i < tempAnswer.length; i++) {
        if (String(tempAnswer[i]) !== "null") {
            var question = getQuestion(i);
            var answer = tempAnswer[i];
            var sp = tempAnswer[i].split(",");
            var temp = "";
            for (var j = 0; j < sp.length; j++) {
                var option = getOptionByA(sp[j]);
                if (option !== null) {
                    temp += "<p>";
                    if (sp.length > 1) {
                        temp += (j + 1) + ". ";
                    }
                    // answer += option.c + " (" + option.score + "分)";
                    temp += option.c;
                    temp += "</p>";
                }
            }
            if(temp !== "")
                answer = temp;
            content = "";
            content += "<div class='activity-row' style='padding: 10px 0px'>";
            content += "<i class='col-xs-1'></i>";
            content += "<div class='col-xs-11 row' style='margin: 0;'>";
            content += "<div class='col-xs-12' style='font-size: 2.5vmax;'>" + + i + "：" + question.c + "</div>";
            content += "<div class='col-xs-12' style='font-size: 2.5vmax; margin-top: 3%;'>" + answer + "</div>";
            content += "</div>";
            content += "<div class='clearfix'> </div>";
            content += "</div>";
            html += content;
        }
    }
    $("#scale_temp_answer_list").html(html);
};

var backToList = function () {
    window.location.href = "./ScaleList.html";
};