var base64 = "";
var fileformat = "";
var uploadfilename = "";
// 預覽圖片，將取得的files一個個取出丟到convertFile()
  function previewFiles(files) {
			if (files && files.length >= 1) {
				$.map(files, file => {
					convertFile(file)
						.then(data => {
						  console.log(data) // 把base64輸出到console
						  showPreviewImage(data, file.name)
						  base64 = data;
						})
						.catch(err => console.log(err))
				})
			}
		}

		// 使用FileReader讀取檔案，並且回傳Base64編碼後的source
		function convertFile(file) {
			return new Promise((resolve,reject)=>{
				// 建立FileReader物件
				let reader = new FileReader()
				// 註冊onload事件，取得result則resolve (Base64字串)
				reader.onload = () => { resolve(reader.result) }
				// 註冊onerror事件，若發生error則reject
				reader.onerror = () => { reject(reader.error) }
				// 讀取檔案
				reader.readAsDataURL(file)
			})
		}

		// 在頁面上新增<img>
		function showPreviewImage(src, fileName) {
			let image = new Image(250) // 設定寬250px
			image.name = fileName
			fileformat = fileName
			image.src = src // <img>中src屬性除了接url外也可以直接接Base64字串
			$("#previewDiv").append(image).append(`<p>File: ${image.name}`)

			//取得檔案附檔名
			var temp = fileName.split(".")
			fileformat = temp[temp.length-1]
		}

		
		$(document).ready(function(){
			 // 當上傳檔案改變時清除目前預覽圖，並且呼叫previewFiles()
			$("#upimg").change(function(){
        console.log("change");
        
        //動態產生一個新的row
        var content = "<li class='list-group-item row'>";
            content += "<div class='col'>";
            content += "<h4 id='previewLabel'></h4>";
            content += "<div id='previewDiv'></div></div></li>";
        $("#previewArea").html(content);

				$("#previewDiv").empty() // 清空當下預覽
				$("#previewLabel").html($.i18n("preview"));
				previewFiles(this.files) // this即為<input>元素
			})
		});

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
function sumbit() {
	if($('input[name="drink"]').val()!= "")
	{
		var sJson = JSON.stringify
			({
					uid: getLocalStorageItem("uid"),
					filename:"",
					drink: $('input[name="drink"]').val(),
					time: timeFormat(),
					date: dateFormat(),
					type:"3"
			});
		$.ajax({
				type: "POST",
				cache: false,
				async: false,
				data: { "requestObject": sJson },
				dataType: "json",
				url: api_url + "/cyms/action_food.php",
				success: function (data) {
					ModalShow("success", $.i18n("feedback_message"), $.i18n("new_success"), "null", $.i18n("submit"), null, "location.reload();");  
						
						console.log(data);
				},
		});
	}

	uploadfilename = dateFormat().replace(new RegExp("/", "g"), "") + timeFormat().replace(new RegExp(":", "g"), "")+"."+fileformat;
	if($("#upimg").val()!= null && $("#upimg").val()!= "")
	{
		var sJson = JSON.stringify
		({
				uid: getLocalStorageItem("uid"),
				filename:uploadfilename,
				drink: "",
				cache: false,
				async: false,
				time: timeFormat(),
				date: dateFormat(),
				type:"1"
		});
		$.ajax({
				type:"POST",
				data:{"requestObject":sJson },
				dataType:"json",
				async:false,
				url:api_url + "/cyms/action_food.php",
				success: function (data) {
					ModalShow("success", $.i18n("feedback_message"), $.i18n("new_success"), "null", $.i18n("submit"), null, "location.reload();");  
						
						console.log(data);
				},
		});
		console.log("123456789"+base64);
		var sJson1 = JSON.stringify
		({
				acc:getLocalStorageItem('acc'),
				img:base64,
				filename:uploadfilename
		});
		$.ajax({
			type: "POST",
			data: { "requestObject": sJson1 },
			// dataType: "json",
			async:false,
			url: api_url + "/cyms/upload.php",
			success: function (data) {
				console.log(data);
				ModalShow("success", $.i18n("feedback_message"), $.i18n("new_success"), "null", $.i18n("submit"), null, "location.reload();");  
			},
			error: function (jqXHR, textStatus, errorThrown) {
				// alert(""+jqXHR.responseText);
			}
		});
	}
	
};