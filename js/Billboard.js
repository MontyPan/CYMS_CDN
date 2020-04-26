
//載入頁面初始
$(document).ready(function () {
    var json1;
    var sJson = JSON.stringify({
        locale: dontCare.decideLocale(),
    });
    $.ajax({
        url: api_url+"/cyms/return_billboard.php",
        type: "POST",
        cache: false,
        async: false,
        dataType: "json",
        data: { "requestObject": sJson },
        success: function (data) {
            
            json1 = data.objects;

            var Append = '';
            for (var i = 0; i < json1.length; i++) {
                Append += '<button class="accordion bold" style="font-size: 2.5vmax; text-align:left">';
                Append +=' <i class="fa fa-angle-double-down"></i>'+json1[i].billboard_headtitle+'</button>';
                var content = json1[i].billboard_title.replace(/\n|\r\n/g,"<br>");
                Append += '<div class="panel">'+'<div class="context">'+content+'</div>'+'</div>';
            

            }
            $("#billboardAppend").html(Append);
        }
    });
    tree();

});


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
            }
        });
    }
}
//樹狀展開 end