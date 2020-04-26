var ReadData = function () {
    ReadEducationList.init();
};
var onpenmodal = function (filepath) {
    var html="";
    html+="<iframe src='"+filepath+"' style='width:100%; height:100%' frameborder='0'></iframe>";
    $("#mal_education").html(html);
    $("#exampleModalLong").modal("show");
    
    //alert(filepath);

};
var ReadEducationList = (function () {
    var renderList = function (datas) {
        $("#list").html("");
        var content = "";
        $.each(datas, function (index, data) {
            var filepath = api_url + "/" + data.path;
            content += "<li class='list-group-item'>";
            content += "<i><img src='images/icon_education.png' width='40' height='40' class=''></i>";
            //content += "<iframe src='"+filepath+"' style='width:100%; height:100%' frameborder='0'></iframe>";
            // content += "<span><a href='javascript:onpenmodal(\""+filepath+"\")' target='_self' class='list-a' style='margin-left: 10px;font-size: 2.5vmax;'>" + data.name + "</a></span>";
            content += "<span><a href='" + filepath + "' target='_blank' class='list-a' style='margin-left: 10px;font-size: 2.5vmax;'>" + data.name + "</a></span>";
            content += "</li>";
        });
        $("#list").html(content);
    }
    var setEmptyList = function () {
        $("#list").html("");
        var content = "<li class='list-group-item row'>";
        content += "<span><font color='red'>" + $.i18n("no_health_education_to_browse") + "</font></span>";
        content += "</li>";
        $("#list").html(content);
    }
    return {
        init: function () {
            var data = {};
            data.role = "patient";
            data.my_uid = getLocalStorageItem("uid");
            data.patient_uid = getLocalStorageItem("patient_uid");
            data.locale = dontCare.decideLocale();
            var url = api_url + "/cyms/return_education_by_role.php";
            $.ajax({
                type: "POST",
                data: { "requestObject": JSON.stringify(data) },
                dataType: "json",
                url: url,
                success: function (data) {
                    // console.log(data);
                    if (data.success === 200) {
                        if (data.objects.length > 0) {
                            renderList(data.objects);
                        }
                        else {
                            setEmptyList();
                        }
                    }
                    else {
                        setEmptyList();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //alert("ajax error:" + jqXHR.responseText);
                }
            });
        }
    };
})();