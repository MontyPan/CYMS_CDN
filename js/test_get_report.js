var base64 = "";
var fileformat = "";
var uploadfilename = "";

window.onload = function () {

    // Run a quick encryption/decryption when they click.
	$('#getExamId').click(function () {
		
		//參數加密
		getExamid($('#ExamId').val());
	});

	$('#getReportData').click(function () {

		getReportdata($('#ReportData').val());
	});
};

function getExamid(arg1) {
	
		var pub_key = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZpvoiKwL7ovFKLYSisByCuIL7wrl3Ch+LI2IOPPm6lGfBUJyKtmErFDg/xW7AlC4t71oDmnnDqEcMAZjpKggLGGOLt0aoPMXx7a/mlxBZNAicwfAmimz2UkbWnsXGGCJiAOK5EkMXv0YoORw5gMoHFDrRlUTVpGJc/54qs4ccNQIDAQAB-----END PUBLIC KEY-----";
		
		var des_key = generateRandomKey(8);
		//組參數
		var encrypt_str = "123.59.68.12~"+dateFormat()+" "+timeFormat()+"~"+des_key+"~"+arg1;
		alert(encrypt_str);
		// RSA公鑰加密
		var encrypt = new JSEncrypt();
		encrypt.setPublicKey(pub_key);
		var encrypted = encrypt.encrypt(String(encrypt_str));
		
					
		　var soapMessage =
		　　'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetExamID xmlns="http://tempuri.org/"><strPID>'+arg1+'</strPID><strKey>' + String(encrypted) + '</strKey></GetExamID></soap:Body></soap:Envelope>';
		console.log(soapMessage);
		var xml = "";
		$.ajax({
			type: "POST",
			data: soapMessage,
			dataType: "xml",
			url: api_url + "/cyms/action_getReport.php",
			contentType: "text/xml; charset=\"utf-8\"",
			success: function (data) {
			console.log(data);
			xml = data.getElementsByTagName("GetExamIDResult")[0].childNodes[0].nodeValue;
			console.log(xml);
				$('#previewArea1').html(xml);
				
			},
		}).done(function() {
			//呼叫DES解密PHP函數
				var sJson1 = JSON.stringify
				({
					key111:des_key,
					encrypt_str:xml
				});
				$.ajax({
				type: "POST",
				data:{"requestObject":sJson1 },
				dataType: "json",
				url: api_url + "/cyms/des.php",
				success: function (data) {
				console.log("result",data.ExamID[0].ID);
					$('#previewArea1').html("ExamID:"+data.ExamID[0].ID);
				},
			});
		});
		return encrypted;
		

};

function getReportdata(arg1) {
	
		var pub_key = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZpvoiKwL7ovFKLYSisByCuIL7wrl3Ch+LI2IOPPm6lGfBUJyKtmErFDg/xW7AlC4t71oDmnnDqEcMAZjpKggLGGOLt0aoPMXx7a/mlxBZNAicwfAmimz2UkbWnsXGGCJiAOK5EkMXv0YoORw5gMoHFDrRlUTVpGJc/54qs4ccNQIDAQAB-----END PUBLIC KEY-----";
		
		
		var des_key = generateRandomKey(8);
		//組參數
		var encrypt_str = "123.59.68.12~"+dateFormat()+" "+timeFormat()+"~"+des_key+"~"+arg1;
		// alert(encrypt_str);
		// RSA公鑰加密
		var encrypt = new JSEncrypt();
		encrypt.setPublicKey(pub_key);
		var encrypted = encrypt.encrypt(String(encrypt_str));
		
					
		　var soapMessage =
		　　'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetExamReport  xmlns="http://tempuri.org/"><strExamID>'+arg1+'</strExamID><strKey>' + String(encrypted) + '</strKey></GetExamReport></soap:Body></soap:Envelope>';
		console.log(soapMessage);
		var xml = "";
		$.ajax({
			type: "POST",
			data: soapMessage,
			dataType: "xml",
			url: api_url + "/cyms/action_getReport.php",
			contentType: "text/xml; charset=\"utf-8\"",
			success: function (data) {
				// console.log(data);
				xml = data.getElementsByTagName("GetExamReportResult")[0].childNodes[0].nodeValue;
				console.log(xml);
				$('#previewArea2').html(xml);
				
			},
		}).done(function() {
			//呼叫DES解密PHP函數
				var sJson1 = JSON.stringify
				({
					key111:des_key,
					encrypt_str:xml
				});
				$.ajax({
				type: "POST",
				data:{"requestObject":sJson1 },
				dataType: "json",
				url: api_url + "/cyms/des.php",
				success: function (data) {
					console.log(data.Report);
					$('#previewArea2').html(data.Report);
				},
			});
		});
		return encrypted;
		

};


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
	return Y + "/" + ((M + 1) < 10 ? '0' : '') + M + "/" + ((D + 1) < 10 ? '0' : '') + D ;
};