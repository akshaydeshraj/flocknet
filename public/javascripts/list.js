$(document).ready(function () {

    $("#channels").find("li").click(function () {
        console.log($(this).attr('id'));
        var channel = $(this).attr('id');
        window.open('https://d64f278b.ngrok.io/flocknet/configure-action?channel=' + channel + '&' + 'flockEventToken=' + v_token);

    });
});