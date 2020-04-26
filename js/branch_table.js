
function Request() {
	var strUrl = location.search;
	//alert(strUrl);

	var getSearch = strUrl.split("?");
	//alert(getSearch[1].toString());
	//console.log(decodeURI(getSearch[1].toString()));
	division = decodeURI(getSearch[1].split("=")[1]);
	document.getElementById('division_title').innerHTML = division;
}

window.onload = function () {
	Request();
	var cells = document.getElementById('monitor').getElementsByTagName('option');
	var clen = cells.length;
	var cells1 = document.getElementById('monitor1').getElementsByTagName('button');
	var clen1 = cells1.length;

	var currentFirstDate;
	var formatDate = function (date) {
		var year = date.getFullYear() + '/';
		var month = (date.getMonth() + 1) + '/';
		var day = date.getDate();
		var week = '(' + ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()] + ')';
		return year + month + day + '<br>' + week;
	};

	var addDate = function (date, n) {
		date.setDate(date.getDate() + n);
		return date;
	};
	//每一周的七天按钮
	var setDate = function (date) {
		$('#monitor1').empty();
		currentFirstDate1 = new Date(date);
		for (var i = 0; i < 7; i++) {
			var date_week = formatDate(i == 0 ? currentFirstDate1 : addDate(currentFirstDate1, 1));
			var value = date_week.split('<br>')[0] + "  " + date_week.split('<br>')[1];
			//alert(value);			
			$('#monitor1').append('<button class="butn" id="btn' + (i + 1) + '" value="' + value + '" onclick="myFunction(this)">' + date_week + '</button>');
			//cells1[i].innerHTML = formatDate(i == 0 ? currentFirstDate1 : addDate(currentFirstDate1, 1));
		}
		document.getElementById("btn1").click();
		document.getElementById("btn1").style = "background:#5da9e9";
	};
	//设定上方选取周
	var setDate1 = function (date) {
		$('#monitor').empty();
		currentFirstDate = new Date(date);
		for (var i = 0; i < 8; i++) {
			$('#monitor').append('<option>' + formatDate(i == 0 ? currentFirstDate : addDate(currentFirstDate, 7)).split('(')[0] + "~" + formatDate(addDate(currentFirstDate, 6)).split('(')[0] + '</option>>');
			//cells[i].innerHTML = formatDate(i == 0 ? currentFirstDate : addDate(currentFirstDate, 7)).split('(')[0] + "~" + formatDate(addDate(currentFirstDate, 6)).split('(')[0];
			addDate(currentFirstDate, -6);
		}
		//第一次初始
		var myselect = document.getElementById("monitor");
		var index = myselect.selectedIndex;
		var data = myselect.options[index].value.split('~');
		var newDate = new Date(data[0]);
		setDate(addDate(newDate, 0));

	};

	var Today = new Date();
	Today=Today.setDate(Today.getDate()+1);
	Today=new Date(Today);
	document.getElementById('monitor').onchange = function () {
		var myselect = document.getElementById("monitor");
		var index = myselect.selectedIndex;
		var data = myselect.options[index].value.split('~');
		var newDate = new Date(data[0]);
		setDate(addDate(newDate, 0));
	};


	setDate1(Today);

}
//预约满处理
function querytim_time(name, time) {
	morning_index = Array();//存取被预约的index
	afternoon_index = Array();//存取被预约的index
	night_index = Array();//存取被预约的index
	var date = document.getElementById('showdate').innerHTML.split('(')[0].replace(/\//g, "-");
	var sJson = JSON.stringify({
		sel_date: date,
		division: division,
		sel_time: time,
		doctor_name: name
	});
	$.ajax({
		url: api_url + "/cyms/return_expert_time_table.php",   //存取Json的網址 
		data: { "requestObject": sJson },
		type: "POST",
		cache: false,
		async: false,
		dataType: 'json',
		success: function (data) {
			//console.log(data.objects);
			for (var i = 0; i < data.objects.length; i++) {
				if (data.objects[i].type == '上午') {
					morning_index.push(data.objects[i].time);
				}
				if (data.objects[i].type == '下午') {
					afternoon_index.push(data.objects[i].time);
				}
				if (data.objects[i].type == '晚间') {
					night_index.push(data.objects[i].time);
				}
			}
			if (time == "上午") {
				if (morning_index.length < 9) {
					$('#autotable').append('<td align="center"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong" onclick="showfunction(this)" style="margin-bottom: 10px;background:#37669cc7" value="' + name + '_上午">' + name + '</button></td>')
				} else {
					$('#autotable').append('<td align="center"><button type="button" class="btn btn-primary" style="margin-bottom: 10px;background:#8080804d" value="' + name + '_上午">' + name + '</button></td>')
				}
			}
			if (time == "下午") {
				if (afternoon_index.length < 7) {
					$('#autotable').append('<td align="center"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong" onclick="showfunction(this)" style="margin-bottom: 10px;background:#37669cc7" value="' + name + '_下午">' + name + '</button></td>')
				} else {
					$('#autotable').append('<td align="center"><button type="button" class="btn btn-primary" style="margin-bottom: 10px;background:#8080804d" value="' + name + '_下午">' + name + '</button></td>')
				}
			}
			if (time == "晚间") {
				if (night_index.length < 6) {
					$('#autotable').append('<td align="center"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong" onclick="showfunction(this)" style="margin-bottom: 10px;background:#37669cc7" value="' + name + '_晚间">' + name + '</button></td>')
				} else {
					$('#autotable').append('<td align="center"><button type="button" class="btn btn-primary" style="margin-bottom: 10px;background:#8080804d" value="' + name + '_晚间">' + name + '</button></td>')
				}
			}

		},
		error: function (xhr, ajaxOptions, thrownError) {
			//alert(xhr.status);
			//alert(thrownError);
		}
	});
}
//画出专家班表
function getschedule() {
	var date = document.getElementById('showdate').innerHTML.split('(')[0].replace(/\//g, "-");
	//alert(date);
	//alert(division);
	table = Array();
	table[0] = new Array();
	table[1] = new Array();
	table[2] = new Array();
	var count1 = 0, count2 = 0, count3 = 0;
	var sJson = JSON.stringify({
		sel_date: date,
		branch: division
	});
	$.ajax({
		url: api_url + "/cyms/return_expert_schedule.php",   //存取Json的網址   
		data: { "requestObject": sJson },
		type: "POST",
		cache: false,
		dataType: 'json',
		success: function (data) {
			//console.log(data.objects);
			for (var i = 0; i < data.objects.length; i++) {

				if (data.objects[i].morning == '1') {

					table[0][count1] = data.objects[i].name;
					count1++;
				}
				if (data.objects[i].afternoon == '1') {

					table[1][count2] = data.objects[i].name;
					count2++;
				}
				if (data.objects[i].night == '1') {

					table[2][count3] = data.objects[i].name;
					count3++;
				}

			}
			//console.log(table);
			var max_len = 0;
			if (count1 > max_len) {
				max_len = count1;
			}
			if (count2 > max_len) {
				max_len = count2;
			}
			if (count3 > max_len) {
				max_len = count3;
			}
			//alert(table[0][3]);
			$('#autotable').empty();
			for (i = 0; i < max_len; i++) {
				$('#autotable').append('<tr>');
				//$('#autotable').append('<th scope="row"></th>');style="margin-bottom: 10px;
				if (table[0][i] != undefined) {
					querytim_time(table[0][i], "上午");
					//$('#autotable').append('<td align="center"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong" onclick="showfunction(this)" style="margin-bottom: 10px;background:#37669cc7" value="' + table[0][i] + '_上午">' + table[0][i] + '</button></td>')
				} else {
					$('#autotable').append('<td align="center"></td>');
				}
				if (table[1][i] != undefined) {
					querytim_time(table[1][i], "下午");
					//$('#autotable').append('<td align="center"><button align="center" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong" onclick="showfunction(this)" style="margin-bottom: 10px;background:#37669cc7" value="' + table[1][i] + '_下午">' + table[1][i] + '</button></td>')

				} else {
					$('#autotable').append('<td align="center"></td>');
				}
				if (table[2][i] != undefined) {
					querytim_time(table[2][i], "晚间");
					//$('#autotable').append('<td align="center"><button align="center" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong" onclick="showfunction(this)" style="margin-bottom: 10px;background:#37669cc7"  value="' + table[2][i] + '_晚间">' + table[2][i] + '</button></td>')
				} else {
					$('#autotable').append('<td align="center"></td>');
				}
				$('#autotable').append('</tr>');
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			//alert(xhr.status);
			//alert(thrownError);
		}
	});
}
//取得专家资讯
function getinformation() {
	//1.主治 2專長 3學歷 4經歷 5職稱 6.費用 7.職務 8.委员/会员 9.論文及著作 10.榮譽 11.科研'
	var modal_name_1=[];
	var modal_name_2=[];
	var modal_name_3=[];
	var modal_name_4=[];
	var modal_name_5=[];
	var modal_name_6=[];
	var modal_name_7=[];
	var modal_name_8=[];
	var modal_name_9=[];
	var modal_name_10=[];
	var modal_name_11=[];
	var context="";
	context +="<div><div class='accordion_non bold'style='font-size: 3.5vmax; text-align:left' id='modal_name'>医师名称:"+doctor_name+"</div>";
	var sJson = JSON.stringify({
		name: doctor_name
	});
	$.ajax({
		url: api_url + "/cyms/return_expert_information.php",   //存取Json的網址   
		data: { "requestObject": sJson },
		type: "POST",
		cache: false,
		dataType: 'json',
		async:false,
		success: function (data) {
			console.log(data.objects);
			for (var i = 0; i < data.objects.length; i++) {
				//要用动态的长法，来去对应一下是否有资料
				if (data.objects[i].type == '1') {
					modal_name_1.push(data.objects[i].text);
				}
				if (data.objects[i].type == '2') {
					modal_name_2.push(data.objects[i].text);
				}
				if (data.objects[i].type == '3') {
					modal_name_3.push(data.objects[i].text);	
				}
				if (data.objects[i].type == '4') {
					modal_name_4.push(data.objects[i].text);	
				}
				if (data.objects[i].type == '5') {
					modal_name_5.push(data.objects[i].text);
				}
				if (data.objects[i].type == '6') {
					modal_name_6.push(data.objects[i].text);
				}
				if (data.objects[i].type == '7') {
					modal_name_7.push(data.objects[i].text);
				}
				if (data.objects[i].type == '8') {
					modal_name_8.push(data.objects[i].text);
				}
				if (data.objects[i].type == '9') {
					modal_name_9.push(data.objects[i].text);
				}
				if (data.objects[i].type == '10') {
					modal_name_10.push(data.objects[i].text);
				}
				if (data.objects[i].type == '11') {
					modal_name_11.push(data.objects[i].text);
				}
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			//alert(xhr.status);
			//alert(thrownError);
		}
	});
	//1.主治 2專長 3學歷 4經歷 5職稱 6.費用 7.職務 8.委员/会员 9.論文及著作 10.榮譽 11.科研'
	if(modal_name_5.length>0){ //职称
		context +="<button class='accordion bold' style='font-size: 3.5vmax; text-align:left'><i class='fa fa-angle-double-down'></i>职称</button>";
		context +="<div class='panel'><div><div class='container bold' style='font-size: 3vmax; text-align:left' id='modal_name_5'>";
		for (var k = 0; k < modal_name_5.length; k++) {
			if(k<modal_name_5.length-1){
				context +="●"+modal_name_5[k];
				context +="<br>";
			}else{
				context +="●"+modal_name_5[k];
			}
		}
		context +="</div></div></div>";
	}
	if(modal_name_7.length>0){//职务
		context +="<button class='accordion bold' style='font-size: 3.5vmax; text-align:left'><i class='fa fa-angle-double-down'></i>职务</button>";
		context +="<div class='panel'><div><div class='container bold' style='font-size: 3vmax; text-align:left' id='modal_name_7'>";
		for (var k = 0; k < modal_name_7.length; k++) {
			if(k<modal_name_7.length-1){
				context +="●"+modal_name_7[k];
				context +="<br>";
			}else{
				context +="●"+modal_name_7[k];
			}
		}
		context +="</div></div></div>";
	}
	if(modal_name_1.length>0){//主治
		context +="<button class='accordion bold' style='font-size: 3.5vmax; text-align:left'><i class='fa fa-angle-double-down'></i>主治项目</button>";
		context +="<div class='panel'><div><div class='container bold' style='font-size: 3vmax; text-align:left' id='modal_name_1'>";
		for (var k = 0; k < modal_name_1.length; k++) {
			if(k<modal_name_1.length-1){
				context +="●"+modal_name_1[k];
				context +="<br>";
			}else{
				context +="●"+modal_name_1[k];
			}
		}
		context +="</div></div></div>";
	}
	if(modal_name_2.length>0){//专长
		context +="<button class='accordion bold' style='font-size: 3.5vmax; text-align:left'><i class='fa fa-angle-double-down'></i>专长</button>";
		context +="<div class='panel'><div><div class='container bold' style='font-size: 3vmax; text-align:left' id='modal_name_2'>";
		for (var k = 0; k < modal_name_2.length; k++) {
			if(k<modal_name_2.length-1){
				context +="●"+modal_name_2[k];
				context +="<br>";
			}else{
				context +="●"+modal_name_2[k];
			}
		}
		context +="</div></div></div>";
	}
	if(modal_name_3.length>0){//学历
		context +="<button class='accordion bold' style='font-size: 3.5vmax; text-align:left'><i class='fa fa-angle-double-down'></i>学历</button>";
		context +="<div class='panel'><div><div class='container bold' style='font-size: 3vmax; text-align:left' id='modal_name_3'>";
		for (var k = 0; k < modal_name_3.length; k++) {
			if(k<modal_name_3.length-1){
				context +="●"+modal_name_3[k];
				context +="<br>";
			}else{
				context +="●"+modal_name_3[k];
			}
		}
		context +="</div></div></div>";
	}
	if(modal_name_4.length>0){//经历
		context +="<button class='accordion bold' style='font-size: 3.5vmax; text-align:left'><i class='fa fa-angle-double-down'></i>经历</button>";
		context +="<div class='panel'><div><div class='container bold' style='font-size: 3vmax; text-align:left' id='modal_name_4'>";
		for (var k = 0; k < modal_name_4.length; k++) {
			if(k<modal_name_4.length-1){
				context +="●"+modal_name_4[k];
				context +="<br>";
			}else{
				context +="●"+modal_name_4[k];
			}
		}
		context +="</div></div></div>";
	}
	if(modal_name_8.length>0){//委员/会员
		context +="<button class='accordion bold' style='font-size: 3.5vmax; text-align:left'><i class='fa fa-angle-double-down'></i>委员/会员</button>";
		context +="<div class='panel'><div><div class='container bold' style='font-size: 3vmax; text-align:left' id='modal_name_8'>";
		for (var k = 0; k < modal_name_8.length; k++) {
			if(k<modal_name_8.length-1){
				context +="●"+modal_name_8[k];
				context +="<br>";
			}else{
				context +="●"+modal_name_8[k];
			}
		}
		context +="</div></div></div>";
	}
	if(modal_name_9.length>0){//论文及著述
		context +="<button class='accordion bold' style='font-size: 3.5vmax; text-align:left'><i class='fa fa-angle-double-down'></i>论文及著述</button>";
		context +="<div class='panel'><div><div class='container bold' style='font-size: 3vmax; text-align:left' id='modal_name_9'>";
		for (var k = 0; k < modal_name_9.length; k++) {
			if(k<modal_name_9.length-1){
				context +="●"+modal_name_9[k];
				context +="<br>";
			}else{
				context +="●"+modal_name_9[k];
			}
		}
		context +="</div></div></div>";
	}
	if(modal_name_10.length>0){//荣誉
		context +="<button class='accordion bold' style='font-size: 3.5vmax; text-align:left'><i class='fa fa-angle-double-down'></i>荣誉</button>";
		context +="<div class='panel'><div><div class='container bold' style='font-size: 3vmax; text-align:left' id='modal_name_10'>";
		for (var k = 0; k < modal_name_10.length; k++) {
			if(k<modal_name_10.length-1){
				context +="●"+modal_name_10[k];
				context +="<br>";
			}else{
				context +="●"+modal_name_10[k];
			}
		}
		context +="</div></div></div>";
	}
	
	if(modal_name_11.length>0){//科研
		context +="<button class='accordion bold' style='font-size: 3.5vmax; text-align:left'><i class='fa fa-angle-double-down'></i>科研</button>";
		context +="<div class='panel'><div><div class='container bold' style='font-size: 3vmax; text-align:left' id='modal_name_11'>";
		for (var k = 0; k < modal_name_11.length; k++) {
			if(k<modal_name_11.length-1){
				context +="●"+modal_name_11[k];
				context +="<br>";
			}else{
				context +="●"+modal_name_11[k];
			}
		}
		context +="</div></div></div>";
	}
	if(modal_name_6.length>0){//费用
		context +="<button class='accordion bold' style='font-size: 3.5vmax; text-align:left'><i class='fa fa-angle-double-down'></i>费用</button>";
		context +="<div class='panel'><div><div class='container bold' style='font-size: 3vmax; text-align:left' id='modal_name_6'>";
		for (var k = 0; k < modal_name_6.length; k++) {
			if(k<modal_name_6.length-1){
				context +="●"+modal_name_6[k];
				context +="<br>";
			}else{
				context +="●"+modal_name_6[k];
			}
		}
		context +="</div></div></div>";
	}

	context +="</div>";

	$("#dialog_body").html(context);
	tree();
}

function myFunction(myObj) {
	// alert('hhh');
	document.getElementById('btn1').style = '';
	document.getElementById('showdate').innerHTML = myObj.value;
	getschedule();

}
function showfunction(myObj) {
	$('#modal-body').empty();

	document.getElementById('exampleModalLongTitle').innerHTML = myObj.value.split('_')[0];
	//$('#dialog_body').append('<div>' + myObj.value.split('_')[0] + '医生经历:</div>');
	time = myObj.value.split('_')[1];//上午下午晚間
	doctor_name = myObj.value.split('_')[0];
	//room = myObj.value.split('_')[2];
	
	//alert(room);
	getinformation();
};
//点选班表预约后跳页资讯
function reservation() {
	//alert(doctor_name);
	var date = document.getElementById('showdate').innerHTML;
	//alert(date);
	//alert(time);
	var division = document.getElementById('division_title').innerHTML;
	//alert(room);
	window.location.href = "Doctor_reservation.html?doctor_name=" + doctor_name + '&Date=' + date + '&time=' + time + '&division=' + division;// + '&room=' + room;
}
function tree(){
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