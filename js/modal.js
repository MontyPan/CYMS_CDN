function ModalShow(type, title, content, button1, button2, function1, function2) {
    if (type === "success") {
        SuccessModalShow(title, content, button1, button2, function1, function2);
    }
    else if (type === "error") {
        ErrorModalShow(title, content, button1, button2, function1, function2);
    }
    else if (type === "message") {
        MessageModalShow(title, content, button1, button2, function1, function2);
    }
}

function SuccessModalShow(title, content, button1, button2, function1, function2) {
    // turn off event listener last time set.
    $('#success_button1').off('click');
    $('#success_button2').off('click');
    // ===== Set View =====
    if (title !== "")
        $("#success_title").html(title);

    $("#success_content").html(content);

    if (button1 === "null" || button1 === null) {
        $("#success_button1").css("display", "none");
    } else {
        $("#success_button1").css("display", "block");
    }
    $("#success_button1").html(button1);

    if (button2 === "null" || button2 === null) {
        $("#success_button2").css("display", "none");
    } else {
        $("#success_button2").css("display", "block");
    }
    $("#success_button2").html(button2);

    // ===== Set Button click Function =====
    if (function1 !== undefined && function1 !== null) {
        if (typeof (function1) === "string") {
            $("#success_button1").attr('onClick', function1);
        }
        else if (typeof (function1) === "function") {
            $('#success_button1').on('click', function1);
        }
    }

    if (function2 !== undefined && function2 !== null) {
        if (typeof (function2) === "string") {
            $("#success_button2").attr('onClick', function2);
        }
        else if (typeof (function2) === "function") {
            $('#success_button2').on('click', function2);
        }
    }

    $('#successModal').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function ErrorModalShow(title, content, button1, button2, function1, function2) {
    // turn off event listener last time set.
    $('#error_button2').off('click');
    $('#error_button1').off('click');
    // ===== Set View =====
    if (title !== "")
        $("#error_title").html(title);

    $("#error_content").html(content);

    if (button1 === "null" || button1 === null) {
        $("#error_button1").css("display", "none");
    } else {
        $("#error_button1").css("display", "block");
    }
    $("#error_button1").html(button1);

    if (button2 === "null" || button2 === null) {
        $("#error_button2").css("display", "none");
    } else {
        $("#error_button2").css("display", "block");
    }
    $("#error_button2").html(button2);

    // ===== Set Button click Function =====
    if (function1 !== undefined && function1 !== null) {
        if (typeof (function1) === "string") {
            $("#error_button1").attr('onClick', function1);
        }
        else if (typeof (function1) === "function") {
            $('#error_button1').off('click');
            $('#error_button1').on('click', function1);
        }
    }

    if (function2 !== undefined && function2 !== null) {
        if (typeof (function2) === "string") {
            $("#error_button2").attr('onClick', function2);
        }
        else if (typeof (function2) === "function") {
            $('#error_button2').on('click', function2);
        }
    }
    
    $('#errorModal').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function MessageModalShow(title, content, button1, button2, function1, function2) {
    // turn off event listener last time set.
    $('#message_button2').off('click');
    $('#message_button1').off('click');
    // ===== Set View =====
    if (title !== "")
        $("#message_title").html(title);

    $("#message_content").html(content);

    if (button1 === "null" || button1 === null) {
        $("#message_button1").css("display", "none");
    } else {
        $("#message_button1").css("display", "block");
    }
    $("#message_button1").html(button1);

    if (button2 === "null" || button2 === null) {
        $("#message_button2").css("display", "none");
    } else {
        $("#message_button2").css("display", "block");
    }
    $("#message_button2").html(button2);

    // ===== Set Button click Function =====
    if (function1 !== undefined && function1 !== null) {
        if (typeof (function1) === "string") {
            $("#message_button1").attr('onClick', function1);
        }
        else if (typeof (function1) === "function") {
            $('#message_button1').off('click');
            $('#message_button1').on('click', function1);
        }
    }

    if (function2 !== undefined && function2 !== null) {
        if (typeof (function2) === "string") {
            $("#message_button2").attr('onClick', function2);
        }
        else if (typeof (function2) === "function") {
            $('#message_button2').on('click', function2);
        }
    }

    $('#messageModal').modal({
        backdrop: 'static',
        keyboard: false
    });
}