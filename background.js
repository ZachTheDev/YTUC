function main() {
    var jsonFinder = {};
    var channelList = [];
    var request = gapi.client.youtube.subscriptions.list({'mine': 'true', 'part': 'snippet',
        'fields': 'items/snippet/resourceId/channelId,nextPageToken,pageInfo,prevPageToken,tokenPagination',
        'maxResults': '50'});

    // Execute the API request.
    request.execute(function (response) {
        response.items.forEach(function (item) {
            jsonFinder[item.id] = item.snippet;
            //console.log(JSON.stringify(jsonFinder, null, "\t"));
            channelList.push(jsonFinder.undefined.resourceId.channelId);
        });
        console.log(response);
    });
}

function pubSub() {
    var getChannels = require('./background.js');
    var channelList = [];

    getChannels.index(function (response) {
        channelList = response;
        //console.log(channelList);
    });

    channelList.forEach(function (value) {
        request.post('https://pubsubhubbub.appspot.com/subscribe', {
            form: {
                'hub.mode': ('subscribe'),
                'hub.callback': 'http://postb.in/6Obbk3wZ',
                'hub.topic': 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=' + channelList[value].id,
                'hub.lease_seconds': '31536000'
            }
        }, (error, pubSubResponse) => {
            if (!error && pubSubResponse.statusCode == 202) {
                res.status(200).json({
                    code: 'channel_subscribed',
                    details: "Subscribed/unsubscribed succesfully to https://www.youtube.com/channel/" + channels[0].id
                })
            } else {
                res.status(500).json({
                    code: 'subscription_failed',
                    details: "An error occured while connecting to Google's PubSubHubbub Hub",
                    error
                })
            }
        })
    });
}