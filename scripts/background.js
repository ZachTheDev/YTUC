var channelList = [];

function main() {
    var jsonFinder = {};
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
        console.log(channelList);
    });
}


function pubSub() {
    requirejs(["ext/pubsub.js"], function(PubSub) {

        // create a function to subscribe to topics
        var mySubscriber = function (msg, data) {
            console.log( msg, data );
        };

        // add the function to the list of subscribers for a particular topic
        // we're keeping the returned token, in order to be able to unsubscribe
        // from the topic later on
        var token = PubSub.subscribe('MY TOPIC', mySubscriber);

        // publish a topic asyncronously
        PubSub.publish('MY TOPIC', 'hello world!');

        // publish a topic syncronously, which is faster in some environments,
        // but will get confusing when one topic triggers new topics in the
        // same execution chain
        // USE WITH CAUTION, HERE BE DRAGONS!!!
        PubSub.publishSync('MY TOPIC', 'hello world!');

    });
}

// function pubSub() {
//     var request = require('request');
//
//     channelList.forEach(function (value) {
//         request.post('https://pubsubhubbub.appspot.com/subscribe', {
//             form: {
//                 'hub.mode': ('subscribe'),
//                 'hub.callback': 'http://postb.in/6Obbk3wZ',
//                 'hub.topic': 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=' + channelList[value].id,
//                 'hub.lease_seconds': '31536000'
//             }
//         }, (error, pubSubResponse) => {
//             if (!error && pubSubResponse.statusCode == 202) {
//                 res.status(200).json({
//                     code: 'channel_subscribed',
//                     details: "Subscribed/unsubscribed succesfully to https://www.youtube.com/channel/" + channels[0].id
//                 })
//             } else {
//                 res.status(500).json({
//                     code: 'subscription_failed',
//                     details: "An error occured while connecting to Google's PubSubHubbub Hub",
//                     error
//                 })
//             }
//         })
//     });
// }