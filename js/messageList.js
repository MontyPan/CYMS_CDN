var setip=api_url + "";
function loadmsg () {
    var sJson = JSON.stringify
    ({    
        uid:  localStorage.getItem('uid')//getLocalStorageItem("uid")
    });

    var json1;

    $.ajax({
        url: setip+"/cyms/return_messagelist.php",
        data: { "requestObject": sJson },
        type: "POST",        
        cache: false,    
        dataType: "json",
        success: function (data) {
            console.log(data.objects);//取出物件長度  
            json1 = data.objects;
            var count = 0;
            var nursename,rptime;
            for(var i = 0; i <  json1.length; i++) {
                var content = '<div class="row">';
                
                if (json1[i].nursename==null || json1[i].replycontent=="")
                {
                    
                    content += '<div class="col-lg-12 card card-title-warning ">';                  
                    //這邊存在「ajax 做完但是 i18n 還沒 ready 所以取不出期望值」的可能風險
                    //不過機率很低，然後暫時也只能這樣了 [下略髒話數百字]
                    nursename=$.i18n("no_response"); 
                    rptime='';
                }
                else
                {
                    content += '<div class="col-lg-12 card card-title">';
                    nursename=json1[i].nursename;
                    rptime=json1[i].replytime;
                }
                content += '<a data-toggle="collapse" href="#item' + count + '" role="button" aria-expanded="false" aria-controls="item' + count + '" ><div class="container"><i class="fa fa-question-circle-o" aria-hidden="true">' + json1[i].title + '</i><br>'+ json1[i].content+' <div style="float:right">'+json1[i].createtime+'</div></div>';
                content += '</a></div>';
                content += '<div class="card collapse" id="item' + count + '" style="background-color: 	#FFF0AC;">';
                content += '<div class="card-body item-content">';
                content += json1[i].replycontent;
                content += '<p style="float:right">'+nursename+'\t'+rptime+'</p>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                $(".message_box").append(content);
                count++;
            }        
        }
    });
    
}

//初始載入 end

