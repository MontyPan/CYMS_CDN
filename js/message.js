var setip=api_url + "";
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

function loaddefaultmsg()
{
    var json1;
    var sJson = JSON.stringify({
        locale: dontCare.decideLocale(),
    });
    $.ajax({
        url: setip+"/cyms/return_default_msg.php",
        type: "POST",   //其實原本 server side 就是要收 POST，只是那時壓根沒傳資料所以...
        data: {"requestObject" : sJson},
        cache: false,
        async: false,
        dataType: "json",
        success: function (data) {
            
            json1 = data.objects;

            var CheckSetAppend = '';
            for (var i = 0; i < json1.length; i++) {
               CheckSetAppend += '<option>'+
                    json1[i].default_msg + '</option>';
            

            }
            $("#chkmsg").append(CheckSetAppend);
        }
    });
}
// click INSERT btn to POST physical data
function sumbit() {
    var title=$('select[name="msgtitle"]').val();
    var content= $('textarea[name="msgcontent"]').val();//$('input[name="msgcontent"]').val();
    if(title==""||content.length==0)
    {
        ModalShow("error", $.i18n("feedback_message"), $.i18n("need_post_content"), "null", $.i18n("submit"), null, "location.reload();");  
    }
    else
    {
        
    var sJson = JSON.stringify
        ({
            uid: localStorage.getItem('uid'),
            //uid: 1,
            title: title,
            content: content
     
        });

    $.ajax({
        type: "POST",
        data: { "requestObject": sJson },
        dataType: "json",
        url: setip+"/cyms/insert_message.php",
        success: function (data) {
            ModalShow("success", $.i18n("feedback_message"), $.i18n("new_success"), "null", $.i18n("submit"), null, "location.reload();");  
            
            console.log(data);
        },
    });
    }
};