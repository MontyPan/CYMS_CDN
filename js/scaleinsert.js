
// click INSERT btn to POST physical data
function newcard() {
	 
        $(".editbox").show();
};

function cancel() {
	 
        $(".editbox").hide();
};

function save() {
		var content = "";
		content +="<div class='card'>";
		content +="<div class='container'>";
		content +="<h4><b>"+$("#QContext").val()+"</b></h4>" ;
		content +="<p>0个选项</p> ";
		content +="</div>";
		content +="</div>";
		$("#card_list").append(content);
		$("#QContext").val("")
		$(".editbox").hide();
		//加上點擊事件
		$( ".card" ).click(function( event ) {
			$( "#dialog" ).dialog( "open" );
			event.preventDefault();
		});
};