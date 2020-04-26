// $(function() {
//     $('#side-menu').metisMenu();
// });

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
var intervel_id;
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }

    //定時檢查是不是要跳出自主管理的問卷（症狀輸入）
    // appendQuestionModal();
    if(window.location.href.indexOf("login.html") < 0 && window.location.href.indexOf("register") < 0) {
        //這邊給 1000（1 秒）應該牽扯到 resetQuestionTime() 那詭異的亂數值
        //而那個應該又牽扯到 checkUserResponse() 當中 XHR 結束時會呼叫 resetQuestionTime()
        //總之就是... 理論上 client 不會因此死掉，那就這樣吧...... [逃]
        intervel_id = setInterval(checkUserResponse, 1000);
    }
    ////
});

function getUserDetail() {
    
}

function appendQuestionModal() {
    var html = `
      <div id="managementQuestionModal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
              <h4 class="modal-title">Modal Window</h4>
            </div>
            <div class="modal-body">
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-primary" class="close" data-dismiss="modal" onclick="managementQuestionSubmit()">送出</button>
            </div>
          </div>
        </div>
    </div>
    `;
    $(html).appendTo("body");
}

var management_questions = [
    {
        prompt: '身体有不舒服吗？',
        options: ['有', '无']
    },
    {
        prompt: '是否有按时饮食？',
        options: ['是', '否']
    },
    {
        prompt: '是否有睡眠充足？',
        options: ['是', '否']
    }
];

var isOpen = false;

/**
 * 會發一個 return_scale_list.php 的 XHR，
 * 然後比對 XHR 取得資料的 sid 值，若與傳入的 sid 相同，
 * 就把這筆資料塞到 locale storage 裡頭，然後要求轉到 ScaleInput.html
 */
var noticeInput = function (sid) {
    var last_scale = null;
    var data = {};
    data.uid = getLocalStorageItem("uid");
    data.role = "client";
    data.op_uid = getLocalStorageItem("uid");
    data.locale = dontCare.decideLocale();
    var url = api_url + "/cyms/return_scale_list.php";
    $.ajax({
        type: "POST",
        data: { "requestObject": JSON.stringify(data) },
        dataType: "json",
        url: url,
        success: function (data) {
            // console.log(data);
            if (data.success === 200) {
                if (data.objects.length > 0) {
                    for (var i = 0; i < data.objects.length; i++) {
                        var obj = data.objects[i];
                        if (obj.sid == sid.toString())
                            last_scale = obj;
                    }
                }
            }
            if (!last_scale) {
                alert("发生错误，请重新再试！");
            }
            else {
                setLocalStorageItem("scale-caption", last_scale.caption);
                setLocalStorageItem("scale-lid", last_scale.lid);
                setLocalStorageItem("scale-sid", last_scale.sid);
                setLocalStorageItem("scale-period", last_scale.period);
                setLocalStorageItem("scale-version", last_scale.version);
                setLocalStorageItem("scale-type", last_scale.type);
                window.location.href = "./ScaleInput.html";
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
};

function resetQuestionTime() {
    var question_time = (new Date().getTime() / 1000) + Math.floor(Math.random() * 1800) + 1800;
    setLocalStorageItem("question_time", question_time);
    return question_time;
}

/**
 * 如果需要自主管理的使用者 [isSelfManagement]，
 * 就會檢查上次答題時間 [question_time]。
 * 如果距今超過 8.x 小時，會發一個 uploadUserResponse.php 的 XHR（內容意義不明...... =.="），
 * XHR 成功就會重設答題時間。
 * 如果距今沒有超過 8.x 小時，則會呼叫 noticeInput()。
 * 
 * 簡單地以表面行為來說說，
 * 要嘛從來沒有答題時間、要嘛上次答題時間已經過很久，
 * 在這兩個狀況下就會呼叫 noticeInput()。
 */
function checkUserResponse() {
    if(getLocalStorageItem("isSelfManagement") === "true") {
        var question_time = getLocalStorageItem("question_time");
        if(question_time === "") {
            question_time = resetQuestionTime();
        }
        var now_time = new Date().getTime() / 1000;
        var diff = question_time - now_time;
        // console.log(diff);
        if(diff < -selfManagementQuestionPeriod) {
            var data = {};
            data.uid = getLocalStorageItem("uid");
            data.question = "unfinish";
            data.answer = "unfinish";
            var url = api_url + "/cyms/uploadUserResponse.php";
            $.ajax({
                type: "POST",
                data: { "requestObject": JSON.stringify(data) },
                dataType: "json",
                url: url,
                success: function (data) {
                    resetQuestionTime();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        }
        else if(diff < 0) {
            // if(!$('#managementQuestionModal').hasClass('in')) {
            //     showQuestion($("#managementQuestionModal"));
            //     $("#managementQuestionModal").modal("show");
            // }

            //因為 ScaleInput.html 也有載入 custom.js、也會執行 checkUserResponse()
            //（天知道是為了什麼...... Zzzz）
            //所以這裡要排除目前已經在 ScaleInput.html 的狀況，
            //不然 noticeInput() 正常狀況下會轉到 ScaleInput.html
            //就會變成另類的無窮迴圈...... [遠目]
            if(window.location.href.indexOf("ScaleInput.html") < 0)
                noticeInput("5");
        }
    }
}

function managementQuestionSubmit() {
    var question = $("#managementQuestionModal").find('.modal-title').text();
    var answer = $(".modal-body input:checked").val();
    if(!answer) {
        alert("请选择答案");
    }
    else {
        var data = {};
        data.uid = getLocalStorageItem("uid");
        data.question = question;
        data.answer = answer;
        var url = api_url + "/cyms/uploadUserResponse.php";
        $.ajax({
            type: "POST",
            data: { "requestObject": JSON.stringify(data) },
            dataType: "json",
            url: url,
            success: function (data) {
                if (data.success === 200) {
                    resetQuestionTime();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    } 
}

function getOptions(question) {
    var $buttonDiv = $('<div style="padding-left: 20px;"></div>');
    question.options.forEach(function(opt) {
        var $label = $('<label class="radio"></label');
        var $input = $('<input type="radio" name="opts" value="' + opt + '">');
        $label.append($input);
        $label.append(opt);
        $buttonDiv.append($label);
  });
  return $buttonDiv;
}

function showQuestion($modal) {
    var num = Math.floor(Math.random() * management_questions.length);
    var question = management_questions[num];
    $modal.find('.modal-title').text(question.prompt);
    $modal.find('.modal-body').empty().append(getOptions(question));
}

//從 init.js 搬過來
var setLocalStorageItem = function (key, value) {
    localStorage.setItem(key, value);
};

var getLocalStorageItem = function (key) {
    if (localStorage.getItem(key) === null)
        return "";
    else
        return localStorage.getItem(key);
};