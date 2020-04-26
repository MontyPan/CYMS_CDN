 // Get time conform the DB format. Physical time format in DB is YYYY-MM-DD HH:mm
 function timeFormat() {
    var time = new Date();
    var Y = time.getFullYear();
    var M = (time.getMonth() + 1);
    var D = time.getDate();
    var H = time.getHours();
    var Min = time.getMinutes();
    return Y + "-" + ((M + 1) < 10 ? '0' : '') + M + "-" + ((D + 1) < 10 ? '0' : '') + D + " " + ((H + 1) < 10 ? '0' : '') + H + ":" + ((Min + 1) < 10 ? '0' : '') + Min
};
// click INSERT btn to POST physical data
function sumbit() {
    var sJson = JSON.stringify
        ({
            //uid: getLocalStorageItem("uid"),
            uid: getLocalStorageItem("uid"),
            start_time: 1,
            stop_time: timeFormat(),
            temperature: $('input[name="temperature"]').val(),
            pulse: $('input[name="pulse"]').val(),
            breathe: $('input[name="breathe"]').val(),
            spo2: $('input[name="spo2"]').val(),
            sbp: $('input[name="sbp"]').val(),
            dbp: $('input[name="dbp"]').val(),
            pressure: null,
            sugar: $('input[name="sugar"]').val(),
            height: $('input[name="height"]').val(),
            weight: $('input[name="weight"]').val(),
            time: timeFormat(),
        });
    $.ajax({
        type: "POST",
        data: { "requestObject": sJson },
        dataType: "json",
        url: api_url + "/cyms/insert_physical.php",
        success: function (data) {
            ModalShow("success", $.i18n("feedback_message"), $.i18n("new_success"), "null", $.i18n("submit"), null, "location.reload();");  
            
            console.log(data);
        },
    });
};