$(document).ready(function () {

    $(".btn").click(function (event) {
        event.preventDefault();

        console.log('test');

        // Find out group selected
        var selectedGroup = $("#sel1").find(":selected");
        var groupName = selectedGroup.text();
        var groupId = selectedGroup.attr('id');

        // Find out public group subscribed to
        var sharedGroupName = $("#channels").find(":selected").text();

        var incomingUrl = $("#inputIWebhook").val();

        var jsonObjectToPost = {
            groupId: groupId,
            f_channel: sharedGroupName,
            group_name: groupName,
            webhook_url: incomingUrl,
            associated_user: userId
        };

        console.log('jsonObject', jsonObjectToPost);

        $.post("https://d64f278b.ngrok.io/flocknet/subscribe-channel",
            jsonObjectToPost)
            .done(function (msg) {
                console.log('Message', msg);
            })
            .fail(function (xhr, status, error) {
                console.log('JSON Object', jsonObjectToPost);
                console.log('XHR', xhr);
                console.log('status', status);
                console.log('error', error);
            })

    });
});