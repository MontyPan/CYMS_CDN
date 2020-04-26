var ReadData = function () {
    var data = {};
    data.uid = getLocalStorageItem("patient_uid");
    var url = api_url + "/cyms/return_record_card_content.php";
    $.ajax({
        type: "POST",
        data: { "requestObject": JSON.stringify(data) },
        dataType: "json",
        url: url,
        success: function (data) {
            console.log(data);
            if (data.success === 200) {
                ReadPrescription.init(data.prescriptions);
                ReadMonitoring.init(data.monitorings);
                ReadArrivingMessage.init(data.arriving_messages);
                tree();
            }
            else {
                setAllEmptyList();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("ajax error:" + jqXHR.responseText);
        }
    });
    
};

//顯示區塊 start
function showView(num){
    if(num==1){
        $("#show_prescription").attr("style","display:block;");
        $("#show_monitoring").attr("style","display:none;");
        $("#show_arriving_message").attr("style","display:none;");
    }
    else if(num==2){
        $("#show_prescription").attr("style","display:none;");
        $("#show_monitoring").attr("style","display:block;");
        $("#show_arriving_message").attr("style","display:none;");
    }
    else{
        $("#show_prescription").attr("style","display:none;");
        $("#show_monitoring").attr("style","display:none;");
        $("#show_arriving_message").attr("style","display:block;");
    }
}
//顯示區塊 end

$(document).on('click', '.li-content', function () {
    console.log($(this).find("p").hasClass("content-hide"));
    if($(this).find("p").hasClass("content-hide")) {
        $(this).find("p").removeClass("content-hide");
        $(this).find("p").addClass("content-show");
        $(this).find("p").css("display", "block");
    }
    else {
        $(this).find("p").removeClass("content-show");
        $(this).find("p").addClass("content-hide");
        $(this).find("p").css("display", "none");
    }
});

var ReadPrescription = (function () {
    var renderList = function (datas) {
        $("#prescription_list").html("");
        var content = "";
        var count = 0;
        content += "<ul class='timeline'>";
        $.each(datas, function (index, data) {
            // content += "<button class='accordion bold' style='font-size: 3.5vmax; text-align: left;'>" + data.date + "<i class='fa fa-angle-down'></i> </button>";
            // content += "<div class='panel' style='padding-bottom: 10px;'>";
            // content += "<div class='row'>";
            // content += "<div class='row row_color'>";
            // content += "<div class='setList_btn col-xs-4'>";
            // content += "<li class='row_comtent'>门诊处方</li>";
            // content += "</div>";
            // content += "<div class='setList_btn col-xs-8'>";
            // content += "<li class='row_comtent'>" + data.clinic_text + "</li>";
            // content += "</div>";
            // content += "</div>";
            // content += "<div class='row row_color'>";
            // content += "<div class='setList_btn col-xs-4'>";
            // content += "<li class='row_comtent'>健检处方</li>";
            // content += "</div>";
            // content += "<div class='setList_btn col-xs-8'>";
            // content += "<li class='row_comtent'>" + data.healthcheck_text + "</li>";
            // content += "</div>";
            // content += "</div>";
            // content += "</div>";
            // content += "</div>";
            
            var temp = "门诊处方：<br>" + data.clinic_text + "<br><br>健检处方：<br>" + data.healthcheck_text;
            content += "<li class='li-content'>";
            content += "<a href='#' class='float-right'>" + data.date + "</a>";
            content += "<p class='content-hide' style='display: none;'>" + temp + "</p>";
            content += "</li>";
            count++;
        });
        content += "</ul>";
        $("#prescription_list").html(content);
        if (count === 0) {
            setEmptyList();
        }
    }
    var setEmptyList = function () {
        $("#prescription_list").html("");
        var content = "<li class='list-group-item row'>";
        content += "<span><font color='red' size='5'>无任何处方！</font></span>";
        content += "</li>";
        $("#prescription_list").html(content);
    }
    return {
        init: function (objects) {
            if (objects.length > 0) {
                renderList(objects);
            }
            else {
                setEmptyList();
            }
        }
    };
})();

var ReadMonitoring = (function () {
    var renderList = function (datas) {
        $("#monitoring_list").html("");
        var content = "";
        var count = 0;
        content += "<ul class='timeline'>";
        $.each(datas, function (index, data) {
            // content += "<button class='accordion bold' style='font-size: 3.5vmax; text-align: left;'>" + data.date + "<i class='fa fa-angle-down'></i> </button>";
            // content += "<div class='panel' style='padding-bottom: 10px;'>";
            // content += "<div class='row'>";
            // content += "<div class='row row_color'>";
            // content += "<div class='setList_btn col-xs-4'>";
            // content += "<li class='row_comtent'>列管原因</li>";
            // content += "</div>";
            // content += "<div class='setList_btn col-xs-8'>";
            // content += "<li class='row_comtent'>" + data.reason + "</li>";
            // content += "</div>";
            // content += "</div>";
            // content += "<div class='row row_color'>";
            // content += "<div class='setList_btn col-xs-12'>";
            // content += "<li class='row_comtent'>追踪" + data.month + "个月</li>";
            // content += "</div>";
            // content += "</div>";
            // content += "</div>";
            // content += "</div>";

            var temp = "列管原因：<br>" + data.reason + "<br><br>追踪" + data.month + "个月";
            content += "<li class='li-content'>";
            content += "<a href='#' class='float-right'>" + data.date + "</a>";
            content += "<p class='content-hide' style='display: none;'>" + temp + "</p>";
            content += "</li>";
            count++;    
        });
        content += "</ul>";
        $("#monitoring_list").html(content);
        if (count === 0) {
            setEmptyList();
        }
    }
    var setEmptyList = function () {
        $("#monitoring_list").html("");
        var content = "<li class='list-group-item row'>";
        content += "<span><font color='red' size='5'>无任何列管纪录！</font></span>";
        content += "</li>";
        $("#monitoring_list").html(content);
    }
    return {
        init: function (objects) {
            if (objects.length > 0) {
                renderList(objects);
            }
            else {
                setEmptyList();
            }
        }
    };
})();

var ReadArrivingMessage = (function () {
    var renderList = function (datas) {
        $("#arriving_message_list").html("");
        var content = "";
        var count = 0;
        content += "<ul class='timeline'>";
        $.each(datas, function (index, data) {
            // content += "<button class='accordion bold' style='font-size: 3.5vmax; text-align: left;'>" + data.date + "<i class='fa fa-angle-down'></i> </button>";
            // content += "<div class='panel' style='padding-bottom: 10px;'>";
            // content += "<div class='row'>";
            // content += "<div class='row row_color'>";
            // content += "<div class='setList_btn col-xs-4'>";
            // content += "<li class='row_comtent'>种类</li>";
            // content += "</div>";
            // content += "<div class='setList_btn col-xs-8'>";
            // content += "<li class='row_comtent'>" + data.item + "</li>";
            // content += "</div>";
            // content += "</div>";
            // content += "<div class='row row_color'>";
            // content += "<div class='setList_btn col-xs-12'>";
            // content += "<li class='row_comtent'>" + data.pre_state.replace(/\n/g, "<br>") + "</li>";
            // content += "</div>";
            // content += "</div>";
            // content += "</div>";
            // content += "</div>";

            var temp = "种类：" + data.item + "<br><br>" + data.pre_state.replace(/\n/g, "<br>");
            content += "<li class='li-content'>";
            content += "<a href='#' class='float-right'>" + data.date + "</a>";
            content += "<p class='content-hide' style='display: none;'>" + temp + "</p>";
            content += "</li>";
            count++;    
        });
        content += "</ul>";
        $("#arriving_message_list").html(content);
        if (count === 0) {
            setEmptyList();
        }
    }
    var setEmptyList = function () {
        $("#arriving_message_list").html("");
        var content = "<li class='list-group-item row'>";
        content += "<span><font color='red' size='5'>无任何到院纪录！</font></span>";
        content += "</li>";
        $("#arriving_message_list").html(content);
    }
    return {
        init: function (objects) {
            if (objects.length > 0) {
                renderList(objects);
            }
            else {
                setEmptyList();
            }
        }
    };
})();

var setAllEmptyList = function () {
    var content = "";
    $("#prescription_list").html("");
    content = "<li class='list-group-item row'>";
    content += "<span><font color='red' size='5'>无任何处方！</font></span>";
    content += "</li>";
    $("#prescription_list").html(content);

    $("#monitoring_list").html("");
    content = "<li class='list-group-item row'>";
    content += "<span><font color='red' size='5'>无任何列管纪录！</font></span>";
    content += "</li>";
    $("#monitoring_list").html(content);

    $("#arriving_message_list").html("");
    content = "<li class='list-group-item row'>";
    content += "<span><font color='red' size='5'>无任何到院纪录！</font></span>";
    content += "</li>";
    $("#arriving_message_list").html(content);
}

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