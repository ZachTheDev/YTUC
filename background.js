// var pubSub = require('./pubsub.js');
// var pubSubRun = pubSub.
import {pubSub} from './pubsub.js';

var jsonFinder = {};
var channelList = [];

function main() {
    var request = gapi.client.youtube.subscriptions.list({'mine': 'true', 'part': 'snippet',
        'fields': 'items/snippet/resourceId/channelId,nextPageToken,pageInfo,prevPageToken,tokenPagination',
        'maxResults': '50'});

    // Execute the API request.
    request.execute(function (response) {
        console.log(response);

        response.items.forEach(function(item) {
            jsonFinder[item.id] = item.snippet;
            //console.log(JSON.stringify(jsonFinder, null, "\t"));
            channelList.push(jsonFinder.undefined.resourceId.channelId);
        });
    })
}

