var base64 = "";
var fileformat = "";
var uploadfilename = "";

	// Get time conform the DB format. Physical time format in DB is YYYY-MM-DD HH:mm
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
	return Y + "/" + ((M + 1) < 10 ? '0' : '') + M + "/" + ((D + 1) < 10 ? '0' : '') + D ;
};
// click INSERT btn to POST physical data
function submit() {
	var openid = "op-pdwpx_yFd60VHOwfa4t0tyrX4";
	var msg = "您尚未到院检查";
	var sJson = JSON.stringify
        ({
            type: "send",
            openid: openid,
            msg: msg
        });
	
	$.ajax({
		type: "POST",
		url: api_url + "/wechat/cyms/chat/action.php",
        data: { "requestObject": sJson },
        dataType: "json",
		success: function (data) {
			if(data.status === 0)
				alert("success");
			else 
				alert("error");
		},
		error: function (xhr, textStatus, thrownError) {
			//alert(textStatus);
		}
	});
			
};