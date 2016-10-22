$(document).ready(function () {

    // TODO : Endpoint to get channels here
    var channelDisplay = [];
    var channelNames = {};
    $.get('https://d64f278b.ngrok.io/flocknet/public-channels', function (data) {

        $.each(data, function (index, jsonObject) {
            console.log(jsonObject);
            channelDisplay.push(jsonObject.text);
            channelNames[jsonObject.text] = jsonObject.name;
        });

        $("#channels").typeahead({
            source: channelDisplay
        });

    }, 'json');

    $(".btn").click(function (event) {
        event.preventDefault();

        // Find out group selected
        var selectedGroup = $("#sel1").find(":selected");
        var groupName = selectedGroup.text();
        var groupId = selectedGroup.attr('id');

        // Find out public group subscribed to
        var displayedItem = $("#channels").val();
        var x = channelNames[displayedItem];
        var sharedGroupName = x != null ? x : displayedItem;

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
                var messageSelector = $("#message");
                messageSelector.text(msg);
                messageSelector.fadeIn();

            })
            .fail(function (xhr, status, error) {
                console.log('JSON Object', jsonObjectToPost);
                console.log('XHR', xhr);
                console.log('status', status);
                console.log('error', error);
            });

    });
});