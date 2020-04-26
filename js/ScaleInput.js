var patient_uid = getLocalStorageItem("uid");
var caption = "";
var scale_type = "single";
var sid = 0, lid = 0;
var scale_version = 0;
var scale_period = 0;
var ScaleQuestions = [];
var ScaleOptions = [];
var ScaleRanges = [];
var backPath = [];
var nextPath = [];
var tempAnswer = [];
var pre = 0;
var now = 1;
var next = 0;
var localeName = dontCare.decideLocale();

//即時算分部分
var isRealTime = false;
var realFeedbackText = "";
var tempAnswerScore = [];

var errorException = function () {
    console.log("error");
};

var getScaleData = (function () {
    var getLocalStorage = function () {
        caption = getLocalStorageItem("scale-caption");
        scale_type = getLocalStorageItem("scale-type");
        sid = getLocalStorageItem("scale-sid");
        lid = getLocalStorageItem("scale-lid");
        scale_version = getLocalStorageItem("scale-version");
        scale_period = getLocalStorageItem("scale-period");
        if(sid.toString() === "3")
            $(document).attr("title", $.i18n("input_symptom"));
    }

    var getScaleVersion = function () {
        var data = {};
        data.sid = sid;
        var url = api_url + "/cyms/return_survey_version.php";
        $.ajax({
            type: "POST",
            data: { "requestObject": JSON.stringify(data) },
            dataType: "json",
            locale: localeName,
            url: url,
            success: function (data) {
                // console.log(data);
                if (data.success === 200) {
                    if (data.objects.length > 0) {
                        //自 298ba9 之後有宣告 global 的 const version，
                        //因此會發生無法重新 assign 的 error，
                        //另外因目前這段 code 意義不明，所以先 comment 掉。
                        
                        // $.each(data, function (index, data) {
                        //      version = data.version;
                        // });
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
        node_data.api = "/api_scale/getScaleQuestion/" + sid + "?locale=" + localeName;
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
        node_data.api = "/api_scale/getScaleOption/" + sid + "?locale=" + localeName;
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
        node_data.api = "/api_scale/getScaleNumberRange/" + sid + "?locale=" + localeName;
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
                setScale();
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
            backPath.push(null);
            nextPath.push(null);
            getScaleVersion();
        }
    };
})();

var setScale = function () {
    // console.log(ScaleQuestions);  
    // console.log(ScaleOptions);  
    // console.log(ScaleRanges); 
    $(".loading-clothes").css("display", "none");
    for (var i = 0; i <= ScaleQuestions.length; i++) {
        backPath.push(0);
        nextPath.push(0);
        tempAnswer.push("null");
        tempAnswerScore.push(0);
    }
    pre = 0;
    now = 1;
    if (String(scale_type) === "single_realtime_score") {
        isRealTime = true;
        $(".score-div").css("display", "block");
    }
    setPage();
};

var setPage = function () {
    $(".btn-input-line").css("display", "block");
    setButton();
    backPath[now] = pre;
    next = nextPath[now];
    var question = getQuestion(now);
    var options = getOptions(now);
    console.log("now:" + now);
    // console.log(question);
    // console.log(options);
    // console.log(backPath);
    $(".scale-question").html("");
    $(".scale-option").html("");
    var count = question.c.length;
    for (var i = 0; i < options.length; i++) {
        count += options[i].c.length;
    }
    // console.log(count);
    var size = "3.5vmax";
    if (count > 100)
        size = "2.5vmax";
    else if (count > 200)
        size = "1.5vmax";
    $(".scale-question").html("<font style='font-size:2.5vmax'>" + now + ":" + question.c + "</font>");
    $(".scale-option").html("<hr>" + getQuestionHtml(parseInt(question.t), options, size));
    window.scrollTo(0, 1);
};

var setButton = function () {
    if (now !== 1) {
        $(".btn-back").css("display", "block");
        $(".btn-back").prop('disabled', false);
        $(".btn-next").prop('disabled', false);
    }
    else {
        $(".btn-back").css("display", "none");
        $(".btn-back").prop('disabled', true);
        $(".btn-next").prop('disabled', false);
    }
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

var getQuestionHtml = function (type, options, size) {
    var html = "";
    if (type === 1) { // 單選
        for (var i = 0; i < options.length; i++) {
            if (i === 0)
                html += "<div class='form-check row'>";
            else
                html += "<div class='form-check row' style='margin-top:5px;'>";
            var checked = "";
            if (parseInt(tempAnswer[now]) === parseInt(options[i].a)) {
                checked = "checked";
                next = options[i].d;
            }
            // var size = "3.5vmax";
            // if (options[i].c.length > 10)
            //     size = "2.5vmax";
            // else if (options[i].c.length > 15)
            //     size = "2vmax";
            size = "2.5vmax";
            html += "<input class='form-check-input col-1' type='radio' name='radios' id='radio" + options[i].a + "' ";
            html += "value='" + options[i].a + "' data-next='" + options[i].d + "' data-score='" + options[i].score + "' ";
            html += "style='padding-top: 15px;margin-left: 20px;' " + checked + ">";
            html += "<label class='form-check-label col-10' for='radio" + options[i].a + "' style='margin-left: 10px; font-size:" + size + "'>";
            html += options[i].c;
            html += "</label>";
            html += "</div>";
        }
    }
    else if (type === 2) { // 複選
        var sp = tempAnswer[now].split(",");
        for (var i = 0; i < options.length; i++) {
            if (i === 0)
                html += "<div class='form-check row'>";
            else
                html += "<div class='form-check row' style='margin-top:5px;'>";
            var checked = "";
            for (var j = 0; j < sp.length; j++) {
                if (parseInt(sp[j]) === parseInt(options[i].a)) {
                    checked = "checked";
                    next = options[i].d;
                }
            }
            size = "2.5vmax";
            html += "<input class='form-check-input col-1' type='checkbox' name='checkboxs' id='checkbox" + options[i].a + "' ";
            html += "value='" + options[i].a + "' data-next='" + options[i].d + "' data-score='" + options[i].score + "' ";
            html += "style='padding-top: 15px;margin-left: 20px;' " + checked + ">";
            html += "<label class='form-check-label col-10' for='checkbox" + options[i].a + "' style='margin-left: 10px; font-size:" + size + "'>";
            html += options[i].c;
            html += "</label>";
            html += "</div>";
        }
    }
    else if (type === 3 || type === 5) { // 數字 
        html += "<div class='form-check row'>";
        html += "<textarea class='form-control' rows='4' cols='50' data-next='" + options[0].d + "' data-score='" + options[0].score + "' >";
        var temp = tempAnswer[now];
        if (temp === "null" || temp === "")
            temp = "";
        html += temp + "</textarea>";
        html += "</div>";
    }
    else if (type === 7) { // 日期 
        html += "<div class='form-check row'>";
        html += "<input class='form-control' type='date' data-next='" + options[0].d + "' data-score='" + options[0].score + "' >";
        var temp = tempAnswer[now];
        if (temp === "null" || temp === "")
            temp = "";
        html += temp + "</textarea>";
        html += "</div>";
    }
    return html;
};

// 單選 radio event
$(document).on('click', 'input:radio', function () {
    tempAnswer[now] = $(this).val();
    tempAnswerScore[now] = parseInt($(this).data("score"));
    next = $(this).data("next");
    realTimeScore();
});

// 複選 checkbox event
$(document).on('click', 'input:checkbox', function () {
    var answer = "";
    var scores = 0;
    $("input[name='checkboxs']").each(function () {
        if ($(this).prop("checked")) {
            answer += $(this).val() + ",";
            next = $(this).data("next");
            scores += parseInt($(this).data("score"));
        }
    });
    tempAnswer[now] = answer.substring(0, answer.length - 1);
    tempAnswerScore[now] = scores;
    realTimeScore();
});

// 文字填答 textarea event
$(document).on('input', 'textarea', function () {
    var value = $(this).val();
    tempAnswer[now] = $(this).val();
    tempAnswerScore[now] = parseInt($(this).data("score"));
    next = $(this).data("next");
    realTimeScore();
});

// 日期 input date event
$(document).on('input', 'input', function () {
    if($(this).attr('type') === "date") {
        var value = $(this).val();
        tempAnswer[now] = $(this).val();
        tempAnswerScore[now] = parseInt($(this).data("score"));
        next = $(this).data("next");
        realTimeScore();
    }
});

var realTimeScore = function () {
    var scores = 0;
    realFeedbackText = "";
    for (var i = 0; i < tempAnswerScore.length; i++) {
        scores += tempAnswerScore[i];
    }
    if (isRealTime) {
        var color_type = 0;
        $(".score-div").html(scores);
        for (var i = 0; i < ScaleRanges.length; i++) {
            if (scores >= parseInt(ScaleRanges[i].min) && scores <= parseInt(ScaleRanges[i].max)) {
                realFeedbackText = ScaleRanges[i].text;
                color_type = parseInt(ScaleRanges[i].color);
            }
        }

        if (color_type === 0) { // default
            $(".score-div").css("background-color", "#4D5A42");
            $(".score-div").css("color", "#FFFFFF");
        }
        else if (color_type === 1) { // red
            $(".score-div").css("background-color", "#ff0004");
            $(".score-div").css("color", "#FFFFFF");
        }
        else if (color_type === 2) { // yellow
            $(".score-div").css("background-color", "#ffef0f");
            $(".score-div").css("color", "#000000");
        }
        else if (color_type === 3) { // green
            $(".score-div").css("background-color", "#1fff22");
            $(".score-div").css("color", "#000000");
        }
    }
};

var showRealTimeFeedBack = function () {
    if (isRealTime) {
        if (realFeedbackText !== null && realFeedbackText !== undefined) {
            if (realFeedbackText.trim() !== "")
                ModalShow("message", $.i18n("feedback_message"), realFeedbackText, "null", $.i18n("submit"));
        }
    }
};

var backEvent = function () {
    nextPath[now] = next;
    now = pre;
    pre = backPath[now];
    next = nextPath[now];
    setPage();
};

var nextEvent = function () {
    var canNext = true;
    var temp = tempAnswer[now].trim();
    if (temp === null || temp === undefined)
        canNext = false;
    if (canNext) {
        if (temp.trim() === "null" || temp.trim() === "")
            canNext = false;
    }
    if (canNext) {
        nextPath[now] = next;
        if (String(next) === "E") {
            endScaleCheck();
        }
        else {
            if (parseInt(next) - parseInt(now) > 1) { // clear 被跳過的答案
                for (var i = parseInt(now) + 1; i < parseInt(next); i++) {
                    tempAnswer[i] = "null";
                    tempAnswerScore[i] = 0;
                }
            }
            pre = now;
            now = next;
            // console.log(tempAnswer);
            // console.log(tempAnswerScore);
            setPage();
        }

    }
    else {
        ModalShow("error", $.i18n("system_message"), $.i18n("did_not_answer_can_not_proceed"), "null", $.i18n("submit"));
    }
};

var endScaleCheck = function () {
    $(".btn-input-line").css("display", "none");
    $(".btn-back").css("display", "none");
    $(".btn-next").css("display", "none");
    $(".btn-back").prop('disabled', true);
    $(".btn-next").prop('disabled', true);

    $(".btn-show-line").css("display", "block");
    $(".btn-cancel").css("display", "block");
    $(".btn-upload").css("display", "block");
    $(".btn-cancel").prop('disabled', false);
    $(".btn-upload").prop('disabled', false);

    showTempAnswerList();
    $(window).scrollTop(0);
};

var isFever = false;
var showTempAnswerList = function () {
    $("#scale_input_div").css("display", "none");
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
            content += "<div class='col-xs-12' style='font-size: 2.5vmax;'>" + $.i18n("question") + i + "：" + question.c + "</div>";
            content += "<div class='col-xs-12' style='font-size: 2.5vmax; margin-top: 3%;'>" + answer + "</div>";
            content += "</div>";
            content += "<div class='clearfix'> </div>";
            content += "</div>";
            html += content;
        }
    }
    $("#scale_temp_answer_list").html(html);
};

var cancelEvent = function () {
    $(".btn-input-line").css("display", "block");
    $(".btn-back").css("display", "block");
    $(".btn-next").css("display", "block");
    $(".btn-back").prop('disabled', false);
    $(".btn-next").prop('disabled', false);

    $(".btn-show-line").css("display", "none");
    $(".btn-cancel").css("display", "none");
    $(".btn-upload").css("display", "none");
    $(".btn-cancel").prop('disabled', true);
    $(".btn-upload").prop('disabled', true);

    $("#scale_input_div").css("display", "block");
    $("#scale_temp_answer_div").css("display", "none");
    console.log(now + "," + pre);
    setPage();
};

var uploadEvent = function () {
    $(".btn-cancel").prop('disabled', true);
    $(".btn-upload").prop('disabled', true);
    $(".upload-loading-clothes").css("display", "block");
    $("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
    var answer_time = getDateTime(0);
    for (var i = 1; i < tempAnswer.length; i++) {
        insertAnswer(i, tempAnswer[i], answer_time);
    }
    if(sid.toString() === "2") { // 心情溫度計
        uploadUserMood();
    }
    else if(sid.toString() === "3") { // 每日症狀評估
        checkDisease();
    }
    else if(sid.toString() === "4") { // 来宁时间
        uploadUserBackDate();
    }
    else if(sid.toString() === "5") { // 关怀信息
        resetQuestionTime();
    }
    updateScaleList(answer_time);
};

var insertAnswer = function (o, a, t) {
    var node_data = {};
    node_data.api = "/api_scale/InsertAnswer/" + lid + "/" + sid + "/" + o + "/" + encodeURI(a)
        + "/" + patient_uid + "/" + encodeURI(t) + "/" + scale_version;
    node_data.postData = "";
    var url = api_url + "/cyms/php2node.php";
    console.log(node_data.api);
    $.ajax({
        type: "POST",
        data: { "requestObject": JSON.stringify(node_data) },
        dataType: "json",
        url: url,
        success: function (datas) {
            console.log(datas);
            if (parseInt(datas.status) === 200) {
            }
            else {
                errorException();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            errorException();
        }
    });
};

var uploadUserMood = function () {
    var scores = 0;
    for (var i = 0; i < tempAnswerScore.length; i++) {
        scores += tempAnswerScore[i];
    }
    var mood_level = 1;
    for (var i = 0; i < ScaleRanges.length; i++) {
        if (scores >= parseInt(ScaleRanges[i].min) && scores <= parseInt(ScaleRanges[i].max)) {
            mood_level = ScaleRanges[i].level;
        }
    }
    var data = {};
    data.lid = lid;
    data.uid = getLocalStorageItem("uid");
    data.mood_level = mood_level;
    var url = api_url + "/cyms/uploadUserMood.php";
    $.ajax({
        type: "POST",
        data: { "requestObject": JSON.stringify(data) },
        dataType: "json",
        url: url,
        success: function (datas) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
            errorException();
        }
    });
};

var uploadUserBackDate = function () {
    var back_date = $.i18n("no");
    if(tempAnswer[2] !== "null") {
        back_date = tempAnswer[2];
    }
    var data = {};
    data.lid = lid;
    data.uid = getLocalStorageItem("uid");
    data.back_date = back_date;
    var url = api_url + "/cyms/uploadUserBackDate.php";
    $.ajax({
        type: "POST",
        data: { "requestObject": JSON.stringify(data) },
        dataType: "json",
        url: url,
        success: function (datas) {
        },
        error: function (jqXHR, textStatus, errorThrown) {
            errorException();
        }
    });
};

function isNumber(value) {
    if ((undefined === value) || (null === value)) {
        return false;
    }
    if (typeof value == 'number') {
        return true;
    }
    return !isNaN(value - 0);
}
function timeFormat() {
    var time = new Date();
    var Y = time.getFullYear();
    var M = (time.getMonth() + 1);
    var D = time.getDate();
    var H = time.getHours();
    var Min = time.getMinutes();
    return Y + "-" + ((M + 1) < 10 ? '0' : '') + M + "-" + ((D + 1) < 10 ? '0' : '') + D + " " + ((H + 1) < 10 ? '0' : '') + H + ":" + ((Min + 1) < 10 ? '0' : '') + Min
};
var isFever = false;
var checkDisease = function () {
    var scores = 0;
    for (var i = 0; i < tempAnswerScore.length; i++) {
        scores += tempAnswerScore[i];
    }

    var level = 0;
    for (var i = 0; i < ScaleRanges.length; i++) {
        if (scores >= parseInt(ScaleRanges[i].min) && scores <= parseInt(ScaleRanges[i].max)) {
            level = ScaleRanges[i].level;
        }
    }
    var tempC = tempAnswer[1];
    if(isNumber(tempC)) {
        var sJson = JSON.stringify
        ({
            uid: getLocalStorageItem("uid"),
            start_time: 1,
            stop_time: timeFormat(),
            temperature: tempC,
            pulse: "",
            breathe: "",
            spo2: "",
            sbp: "",
            dbp: "",
            pressure: null,
            sugar: "",
            height: "",
            weight: "",
            time: timeFormat(),
        });
        $.ajax({
            type: "POST",
            data: { "requestObject": sJson },
            dataType: "json",
            url: api_url + "/cyms/insert_physical.php",
            success: function (data) {
            },
        });
        if(parseFloat(tempC) >= 38 && level > 0) {
            isFever = true;
        }
    }
    else {
        isFever = false;
    }
    if(isFever) {
        var data = {};
        data.uid = getLocalStorageItem("uid");
        data.level = 2;
        data.event = $.i18n("suspected_infection");
        var url = api_url + "/cyms/uploadUserHistory.php";
        $.ajax({
            type: "POST",
            data: { "requestObject": JSON.stringify(data) },
            dataType: "json",
            url: url,
            success: function (datas) {
            },
            error: function (jqXHR, textStatus, errorThrown) {
                errorException();
            }
        });
    }
};

var updateScaleList = function (t) {
    var node_data = {};
    node_data.api = "/api_scale/UpdateScaleList/" + lid + "/" + encodeURI(t) + "/" + scale_version;
    node_data.postData = "";
    var url = api_url + "/cyms/php2node.php";
    console.log(node_data.api);
    $.ajax({
        type: "POST",
        data: { "requestObject": JSON.stringify(node_data) },
        dataType: "json",
        url: url,
        success: function (datas) {
            console.log(datas);
            if (parseInt(datas.status) === 200) {
                if (parseInt(scale_period) != 0)
                    InsertScaleListPeriod();
                else
                    finish();
            }
            else {
                errorException();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            errorException();
        }
    });
};

var InsertScaleListPeriod = function () {
    var st, et;
    if (parseInt(scale_period) !== 0) {
        if (parseInt(scale_period) === 999) {
            st = getDateTime(0);
            et = getDateTime(3);
        }
        else {
            st = getDateTime(parseInt(scale_period));
            et = getDateTime(parseInt(scale_period) + 3);
        }
        var node_data = {};
        node_data.api = "/api_scale/InsertScaleList/" + encodeURI(st) + "/" + encodeURI(et) + "/" + "0" + "/" + sid + "/"
            + patient_uid + "/" + patient_uid + "/" + encodeURI(st) + "/" + encodeURI(st) + "/" + "client" + "/" + scale_version + "/" + scale_version;
        node_data.postData = "";
        var url = api_url + "/cyms/php2node.php";
        console.log(node_data.api);
        $.ajax({
            type: "POST",
            data: { "requestObject": JSON.stringify(node_data) },
            dataType: "json",
            url: url,
            success: function (datas) {
                console.log(datas);
                if (parseInt(datas.status) === 200) {
                    finish();
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
    else {
        finish();
    }
};

var finish = function () {
    $(".upload-loading-clothes").css("display", "none");
    if(isFever) {
        ModalShow("success", $.i18n("feedback_message"), $.i18n("notice_friends_self_management"), "null", $.i18n("go_to_notification"), null, "goToPeopleContact();");
    }
    else {
        if(sid.toString() === "3" || sid.toString() === "4" || sid.toString() === "5")
            ModalShow("success", $.i18n("feedback_message"), $.i18n("uploaded_successfully"), "null", $.i18n("submit"), null, "backToHome();");
        else
            ModalShow("success", $.i18n("feedback_message"), $.i18n("uploaded_successfully"), "null", $.i18n("submit"), null, "backToList();");
    }
};

var backToHome = function () {
    window.location.href = "./Home.html";
};

var backToList = function () {
    window.location.href = "./ScaleList.html";
};

var goToPeopleContact = function() {
    window.location.href = "./PeopleContact.html";
};

var getDateTime = function (duration) {
    var date = new Date();
    date.setTime(date.getTime() + (duration * 24 * 60 * 60 * 1000));
    return (date.getFullYear())
        + '-' + ((date.getMonth() + 1 < 10) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1))
        + '-' + ((date.getDate() < 10) ? ("0" + date.getDate()) : (date.getDate()))
        + ' ' + ((date.getHours() < 10) ? ("0" + date.getHours()) : (date.getHours()))
        + ':' + ((date.getMinutes() < 10) ? ("0" + date.getMinutes()) : (date.getMinutes()))
        + ':' + ((date.getSeconds() < 10) ? ("0" + date.getSeconds()) : (date.getSeconds()));
};