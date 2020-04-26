//初始載入 start
var uid;
var patient_ID;
var ReportItemAppend;//明細內容

$(document).ready(function () {
    var llll1ll1l1l1l1l1l = getFuncInfo();
    if(lllllllllllllllll) {
        var user = getUserDetail();
    }
    uid = getLocalStorageItem("uid");
    patient_ID = getLocalStorageItem("patient_ID");
    getExamid(patient_ID);
    tree();
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
                getReportdata(this.value);
            }
        });
    }
}
//樹狀展開 end


//總結建議详情 start
function show_detail(ReportItemAppend) {
    $('#modal-body').empty();
    $('#exampleModalBtn').empty();
    document.getElementById('exampleModalLongTitle').innerHTML = "健检报告";

    $('#modal-body').append(ReportItemAppend);
    $('#exampleModalBtn').append('<button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>');
    $("#exampleModalLong").modal("show");
}
//總結建議详情 end


//切割總檢結論 start
function translate(data) {
    var nArray = new Array();
    nArray = data.split(/[\n]|\[建议\]\：|\［建议\］\：/);
    return nArray;
}
//切割總檢結論 end


//顯示報告內容 start
function show_report(ID, data) {
    var SetAppend = '';
    if (data.success == false) {
        SetAppend = ' <div class="activity-row" style="padding: 10px 0px;margin: 0"><div class="bold" style="font-size: 4vmax; text-align: center;">目前无报告</div></div>';
    }
    else {
        var json1 = data.Report;
        if (json1[0].Section == "Summary") {//有總檢診斷
            SetAppend += '<li class="row_comtent" style="text-align: left;font-size: 3vmax;">总检医师:' + json1[0].ReportPerson + '</li>';
        }

        ReportItemAppend = '<div class="row" style="font-size: 3vmax;font-weight: bold;margin-top: 5px">';
        ReportItemAppend += '<div class="setList_btn col-xs-6"> <li class="row_title"><BR>项目</li></div>';
        ReportItemAppend += '<div class="setList_btn col-xs-4"><li class="row_title"><BR>结果</li></div>';
        ReportItemAppend += '<div class="setList_btn col-xs-2"><li class="row_title">参考状态</li></div></div>';

        for (var i = 0; i < json1.length; i++) {
            if (json1[i].Section != "Summary") {
                ReportItemAppend += '<div class="row row_color" style="margin-top: 5px">';
                ReportItemAppend += '<div class="setList_btn col-xs-12" style="background-color: #f4d08f;">';
                ReportItemAppend += '<li class="row_comtent">' + json1[i].Section + '</li></div>';
                var json2 = json1[i].Exam;
                for (var m = 0; m < json2.length; m++) {
                    ReportItemAppend +='<div class="row">';
                    ReportItemAppend += '<div class="setList_btn col-xs-6">';
                    ReportItemAppend += '<li class="row_comtent">' + json2[m].Item + '</li></div>';
                    ReportItemAppend += '<div class="setList_btn col-xs-4">';
                    if (json2[m].ReportUnit)
                        ReportItemAppend += '<li class="row_comtent">' + json2[m].ReportValue + '(' + json2[m].ReportUnit + ')</li></div>';
                    else
                        ReportItemAppend += '<li class="row_comtent">' + json2[m].ReportValue + '</li></div>';

                    ReportItemAppend += '<div class="setList_btn col-xs-2">';
                    if (json2[m].Abnormal == "Y")
                        ReportItemAppend += '<li class="row_comtent"style="color: red;"><i class="fa fa-exclamation-triangle"></i></li></div>';
                    else
                        ReportItemAppend += '<li class="row_comtent" style="color: green;"><i class="fa fa-check"></i></li></div>';
                        ReportItemAppend +='</div>';
                }
                ReportItemAppend += '</div>';
            }
        }
        SetAppend += '<li class="row_comtent" style="text-align: left;font-size: 3vmax;">健检报告:<i class="bold"style="color:blue;text-decoration:underline;font-style:normal;"onclick="show_detail(ReportItemAppend)">明細</i></li>';


        if (json1[0].Section == "Summary") {//有總檢診斷
            SetAppend += '<div class="row"style="font-size: 3vmax;font-weight: bold;margin-top: 5px">总检结论</div>';

            var nArray = new Array();
            var mark = false;
            nArray = translate(json1[0].Summary);
            for (var n = 0; n < nArray.length; n++) {
                if (nArray[n]) {
                    SetAppend += '<div class="row row_color" style="margin-top: 5px">';
                    if (mark == true) {
                        SetAppend += '<div class="setList_btn col-xs-12"><li class="row_sub"><strong>建议:' + nArray[n] + '</strong></li></div>';
                        mark = false;
                    }
                    else {
                        SetAppend += '<div class="setList_btn col-xs-12"><li class="row_comtent">' + nArray[n] + '</li></div>';
                        mark = true;
                    }
                    SetAppend += '</div>';
                }
            }
        }
    }
    $("#" + ID).html(SetAppend);
}
//顯示報告內容 end


//顯示報告列表 start
function showList(data) {
    json1 = data.ExamID;
    var SetAppend = '';
    if (data.success == false) {
        SetAppend = ' <div class="activity-row" style="padding: 10px 0px;margin: 0"><div class="bold" style="font-size: 4vmax; text-align: center;">目前无报告</div></div>';
    }
    else {
        for (var i = 0; i < json1.length; i++) {
            SetAppend += '<div class="activity-row" style="padding: 10px 0px;margin: 0">';
            SetAppend += '<button class="accordion bold" style="font-size: 3.5vmax; text-align: left;" value="' + json1[i].ID + '">' + json1[i].Date;
            SetAppend += '<i class="fa fa-angle-down"></i> </button>';
            SetAppend += '<div class="panel"><div class="row"style="margin-top: 5px"id="' + json1[i].ID + '"></div></div>';
        }
    }
    $("#SetAppends").html(SetAppend);
}
//顯示報告列表 end


//抓取报告 列表start
function getExamid(arg1) {

    var pub_key = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZpvoiKwL7ovFKLYSisByCuIL7wrl3Ch+LI2IOPPm6lGfBUJyKtmErFDg/xW7AlC4t71oDmnnDqEcMAZjpKggLGGOLt0aoPMXx7a/mlxBZNAicwfAmimz2UkbWnsXGGCJiAOK5EkMXv0YoORw5gMoHFDrRlUTVpGJc/54qs4ccNQIDAQAB-----END PUBLIC KEY-----";

    var des_key = generateRandomKey(8);
    //組參數
    var encrypt_str = "123.59.68.12~" + dateFormat() + " " + timeFormat() + "~" + des_key + "~" + arg1;
    // alert(encrypt_str);
    // RSA公鑰加密
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(pub_key);
    var encrypted = encrypt.encrypt(String(encrypt_str));


    var soapMessage =
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetExamID xmlns="http://tempuri.org/"><strPID>' + arg1 + '</strPID><strKey>' + String(encrypted) + '</strKey></GetExamID></soap:Body></soap:Envelope>';
    console.log(soapMessage);
    var xml = "";
    $.ajax({
        type: "POST",
        data: soapMessage,
        dataType: "xml",
        cache: false,
        async: false,
        url: api_url + "/cyms/action_getReport.php",
        contentType: "text/xml; charset=\"utf-8\"",
        success: function (data) {
            console.log(data);
            xml = data.getElementsByTagName("GetExamIDResult")[0].childNodes[0].nodeValue;
            console.log(xml);
            //$('#previewArea1').html(xml);
        },
    }).done(function () {
        //呼叫DES解密PHP函數
        var sJson1 = JSON.stringify
            ({
                key111: des_key,
                encrypt_str: xml
            });
        $.ajax({
            type: "POST",
            data: { "requestObject": sJson1 },
            dataType: "json",
            cache: false,
            async: false,
            url: api_url + "/cyms/des.php",
            success: function (data) {
                console.log("result", data.ExamID[0].ID);
                showList(data);
                //$('#previewArea1').html("ExamID:" + data.ExamID[0].ID);
            },
        });
    });
    return encrypted;
};
//抓取报告 列表end


//抓取报告 內容start
function getReportdata(arg1) {
    var pub_key = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZpvoiKwL7ovFKLYSisByCuIL7wrl3Ch+LI2IOPPm6lGfBUJyKtmErFDg/xW7AlC4t71oDmnnDqEcMAZjpKggLGGOLt0aoPMXx7a/mlxBZNAicwfAmimz2UkbWnsXGGCJiAOK5EkMXv0YoORw5gMoHFDrRlUTVpGJc/54qs4ccNQIDAQAB-----END PUBLIC KEY-----";
    var des_key = generateRandomKey(8);
    //組參數
    var encrypt_str = "123.59.68.12~" + dateFormat() + " " + timeFormat() + "~" + des_key + "~" + arg1;
    // alert(encrypt_str);
    // RSA公鑰加密
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(pub_key);
    var encrypted = encrypt.encrypt(String(encrypt_str));

    var soapMessage =
        '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetExamReport  xmlns="http://tempuri.org/"><strExamID>' + arg1 + '</strExamID><strKey>' + String(encrypted) + '</strKey></GetExamReport></soap:Body></soap:Envelope>';
    console.log(soapMessage);
    var xml = "";
    $.ajax({
        type: "POST",
        data: soapMessage,
        dataType: "xml",
        cache: false,
        async: false,
        url: api_url + "/cyms/action_getReport.php",
        contentType: "text/xml; charset=\"utf-8\"",
        success: function (data) {
            // console.log(data);
            xml = data.getElementsByTagName("GetExamReportResult")[0].childNodes[0].nodeValue;
            console.log(xml);
            //$('#previewArea2').html(xml);
        },
    }).done(function () {
        //呼叫DES解密PHP函數
        var sJson1 = JSON.stringify
            ({
                key111: des_key,
                encrypt_str: xml
            });
        $.ajax({
            type: "POST",
            data: { "requestObject": sJson1 },
            dataType: "json",
            cache: false,
            async: false,
            url: api_url + "/cyms/des.php",
            success: function (data) {
                console.log(data.Report);
                show_report(arg1, data);
                $('#previewArea2').html(data.Report);
            },
        });
    });
    return encrypted;
};
//抓取报告 內容end



function generateRandomKey(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
function timeFormat() {
    var time = new Date();
    var H = time.getHours();
    var Min = time.getMinutes();
    var s = time.getSeconds();
    return ((H + 1) < 10 ? '0' : '') + H + ":" + ((Min + 1) < 10 ? '0' : '') + Min + ":" + ((s + 1) < 10 ? '0' : '') + s;
};
function dateFormat() {
    var time = new Date();
    var Y = time.getFullYear();
    var M = (time.getMonth() + 1);
    var D = time.getDate();
    return Y + "/" + ((M + 1) < 10 ? '0' : '') + M + "/" + ((D + 1) < 10 ? '0' : '') + D;
};

