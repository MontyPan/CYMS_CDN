window.onload = function () {

    initLocalClocks();
    setUpMinuteHands();
    moveSecondHands();
    get_today();
    set_medicine_current();
    set_medicine_history();
}
function get_today(){
    //取得今日時間，但未來可能不需要今日時間
    var Today=new Date();
    var formatDate = function (date) {
		var year = date.getFullYear() + '-';
        var month = (date.getMonth() + 1);
        if(month<10){
            month = '0'+month+ '-';
        }else{
            month = month+ '-';
        }
		var day = date.getDate();
		return year + month + day ;
    };
    var global_today = formatDate(Today);
    return global_today;
}
function initLocalClocks() {
    // Get the local time using JS
    var date = new Date;
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hours = date.getHours();

    // Create an object with each hand and it's angle in degrees
    var hands = [
        {
            hand: 'hours',
            angle: (hours * (360 / 12)) + (minutes * ((360 / 12) / 60)) // 目前時間的時針角度
            // 時針一圈12小時，一圈360度，所以360度/12時=30度/時，也就是每小時旋轉30度
            // 對時針來說每分鐘旋轉角度為30度/60分=0.5度/分，也就是每分鐘旋轉0.5度
        },
        {
            hand: 'minutes',
            angle: (minutes * (360 / 60)) // 目前時間的分針角度
            // 分針一圈60分，一圈360度，所以360度/60分=6度/分
        },
        {
            hand: 'seconds',
            angle: (seconds * (360 / 60)) // 目前時間的秒針角度
            // 秒針一圈60秒，一圈360度，所以360度/60秒=6度/秒
        }
    ];

    for (var j = 0; j < hands.length; j++) {
        var elements = document.querySelectorAll('.' + hands[j].hand); // 取得所有的指針(時針，分針，秒針)
        // 將指針依照目前時間來設定角度
        elements[0].style.webkitTransform = 'rotateZ(' + hands[j].angle + 'deg)'; // for Safari 
        elements[0].style.transform = 'rotateZ(' + hands[j].angle + 'deg)'

        // 將秒針目前的角度註記在分針上
        if (hands[j].hand === 'minutes') {
            elements[0].parentNode.setAttribute('data-second-angle', hands[j + 1].angle); // 秒針目前的角度
        }
    }
}

function setUpMinuteHands() {
    // 計算目前分針還剩多少時間走完目前的分鐘
    var containers = document.querySelectorAll('.minutes-container'); // 取得分針的container
    var secondAngle = containers[0].getAttribute("data-second-angle"); // 取得剛註記的秒針角度
    if (secondAngle > 0) {
        // 設定在目前的分鐘結束時，會觸發推動分針的延遲時間
        var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
        // 360度減秒針的角度即為目前分鐘剩下可跑的角度，在除以每秒6度，得到目前分鐘剩下可跑的時間
        // 例如秒針跑了30秒，則secondAngle為30秒*6度=180度，又(360度-180度)/6(度/秒)=30秒，代表目前分鐘還有30秒可以跑完。
        // 因為setTimeout的delay單位是以毫秒(千分之一秒)，所以要乘1000，也就是(30+0.1)*1000=30100毫秒=30.1秒(多的0.1秒是讓分針的移動比秒針慢一點，效果更擬真)
        // 也就是在30.1秒後觸發推動分針的方法moveMinuteHands()
        setTimeout(function () {
            moveMinuteHands(containers);
        }, delay);
    }
}

// 用來推動分針的方法
// 注意實際轉動是指針的container，指針本身是固定不動的
function moveMinuteHands(containers) {
    for (var i = 0; i < containers.length; i++) {
        containers[i].style.webkitTransform = 'rotateZ(6deg)'; // for Safari
        containers[i].style.transform = 'rotateZ(6deg)'; // 在30.1秒後讓分針轉到6度的位置
    }
    // 每間隔60秒執行一次
    setInterval(function () {
        for (var i = 0; i < containers.length; i++) {
            if (containers[i].angle === undefined) {
                containers[i].angle = 12; // 因為第一次已先移動了6度，所以下一次要多6度，所以是12度
            } else {
                containers[i].angle += 6; // 之後每一次的位置都是前一次的度數都多加6度
            }
            containers[i].style.webkitTransform = 'rotateZ(' + containers[i].angle + 'deg)';
            containers[i].style.transform = 'rotateZ(' + containers[i].angle + 'deg)';
        }
    }, 60000); // 60000毫秒=60秒
}

function moveSecondHands() {
    var containers = document.querySelectorAll('.seconds-container'); // 取得秒針的container

    // 每間隔1秒執行一次
    setInterval(function () {

        if (containers[0].angle === undefined) {
            containers[0].angle = 6;
        } else {
            containers[0].angle += 6;
        }
        containers[0].style.webkitTransform = 'rotateZ(' + containers[0].angle + 'deg)';
        containers[0].style.transform = 'rotateZ(' + containers[0].angle + 'deg)';

    }, 1000); // 1000毫秒=1秒
}

function set_medicine_current()
{
    var check=0;
    var gettoday = get_today(); 
    //gettoday = '%'+gettoday+'%';
    //alert(gettoday);

    var sJson = JSON.stringify({
		date_: gettoday, //格式2019-07-21
		uid: getLocalStorageItem("patient_uid"),
		type: 'current'
    });
    var content="";
    var drug_len;
	$.ajax({
		url: api_url + "/cyms/return_medicine.php",   //存取Json的網址 
		data: { "requestObject": sJson },
		type: "POST",
		cache: false,
		async: false,
		dataType: 'json',
		success: function (data) {
			console.log(data.objects);
            for (var i = 0; i < data.objects.length; i++) {//設定下方藥物列表
                check=1;
                if(data.objects[i].item.length<3)
                {
                    drug_len=4;
                }else{
                    drug_len = data.objects[i].item.length+1;
                }
                content +=  "<div style='width:auto;overflow: auto;'>";
                content +=  "<div class='activity-row' style='width:calc(100px*"+drug_len+");overflow: scroll;float: left;padding-top: 10px;'>";
                content +=  "<i class='col-xs-4 activity-img' style='width: 100px;float: left;text-align: center;margin-top:6%'>"+data.objects[i].time+"</i>";
                for(var j=0;j<data.objects[i].item.length;j++){
                    content +="<div class='col-xs-4 bold' style='width: 100px;height:100%;float: left;'>";
                    content +="<div style='width: 100%;height:80%;float: left;'>";
                    if(data.objects[i].item[j].drugID=="2"){//艾斯能圖片調整
                        content +="<img src="+data.objects[i].item[j].drugPic+" class='list-icon' style='height:50px;width: 80px;'></div>";
                    }else{
                        content +="<img src="+data.objects[i].item[j].drugPic+" class='list-icon' style='height:50px'></div>";
                    }
                    content +="<div style='width: 100%;height:20%;float: left;'><span style='font-size:14px'>"+data.objects[i].item[j].drugName+"</span></div>";
                    content +="</div>";
                }
                content += "</div>";
                content += "</div>";
            }
            if(check==0){
                content +="<div class='row' style='margin:0'><li class='setList_btn row_title'>尚未有资料</li></div>"; 
            }
            $("#recently").html(content);
            for(i=1;i<=12;i++){
                $("#hour"+i).empty();
            }
            for (var i = 0; i < data.objects.length; i++) {//設定下方藥物列表
                var hour_minute = data.objects[i].time.split(':');
                var hour = parseInt(hour_minute[0]);
                if(hour>12){
                    hour-=12;
                }
                if(parseInt(hour_minute[1])>=30){//若超過30分
                    hour +=1;
                }
                //alert("#hour"+hour_minute.toString());
                $("#hour"+hour.toString()).append("<div class='light' style='width: 13px; height: 13px; border-radius: 10px; background: rgb(255, 0, 0); position: absolute; right: 110%; bottom: 1%; opacity: 0;'></div>");
            }
		},
		error: function (xhr, ajaxOptions, thrownError) {
			//alert(xhr.status);
			//alert(thrownError);
		}
	});
}

function set_medicine_history()
{
    var check=0;
    var gettoday = get_today(); 
    var sJson = JSON.stringify({
		date_: gettoday, //格式2019-07-21
		uid: getLocalStorageItem("patient_uid"),
		type: 'history'
    });
    var content="";
    var drug_len;
	$.ajax({
		url: api_url + "/cyms/return_medicine.php",   //存取Json的網址 
		data: { "requestObject": sJson },
		type: "POST",
		cache: false,
		async: false,
		dataType: 'json',
		success: function (data) {
			console.log(data.objects);
            for (var i = 0; i < data.objects.length; i++) {//設定下方藥物列表
                check=1;
                if(data.objects[i].item.length<3)
                {
                    drug_len=4;
                }else{
                    drug_len = data.objects[i].item.length+1;
                }
                content +=  "<div style='width:auto;overflow: auto;'>";
                content +=  "<div class='activity-row' style='width:calc(100px*"+drug_len+");overflow: scroll;float: left;padding-top: 10px;'>";
                content +=  "<i class='col-xs-4 activity-img' style='width: 100px;float: left;text-align: center;margin-top:6%'>"+data.objects[i].time+"</i>";
                for(var j=0;j<data.objects[i].item.length;j++){
                    content +="<div class='col-xs-4 bold' style='width: 100px;height:100%;float: left;'>";
                    content +="<div style='width: 100%;height:80%;float: left;'>";
                    if(data.objects[i].item[j].drugID=="2"){//艾斯能圖片調整
                        content +="<img src="+data.objects[i].item[j].drugPic+" class='list-icon' style='height:50px;width: 80px;'></div>";
                    }else{
                        content +="<img src="+data.objects[i].item[j].drugPic+" class='list-icon' style='height:50px'></div>";
                    }
                    content +="<div style='width: 100%;height:20%;float: left;'><span style='font-size:14px'>"+data.objects[i].item[j].drugName+"</span></div>";
                    content +="</div>";
                }
                content += "</div>";
                content += "</div>";
            }
            if(check==0){
                content +="<div class='row' style='margin:0'><li class='setList_btn row_title'>尚未有资料</li></div>"; 
            }
            $("#history").html(content);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			//alert(xhr.status);
			//alert(thrownError);
		}
	});
}


