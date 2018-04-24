var channelList = [];
var videoIdList = [];

function getChannels() {
    var request = gapi.client.youtube.subscriptions.list({
        'mine': 'true',
        'part': 'snippet',
        'fields': 'items/snippet/resourceId/channelId,nextPageToken,pageInfo,prevPageToken,tokenPagination',
        'maxResults': '10'});

    // Execute the API request.
    request.execute(function (response) {
        response.items.forEach(function (item) {
            //console.log(JSON.stringify(item, null, "\t"));
            channelList.push(item.snippet.resourceId.channelId);
        });
        // console.log(channelList);
    });
}

var videoIdByChannel = [];

function getVideoId() {
    for (var i = 0; i < channelList.length; i++) {

        var request = gapi.client.youtube.search.list({
            'part': 'snippet',
            'fields': 'items/id/videoId',
            'maxResults': '50',
            'channelId': channelList[i],
            'publishedAfter': '2018-04-20T00:00:00Z'
        });

        // Execute the API request.
        request.execute(function (response) {
            response.items.forEach(function (item) {
                // console.log(JSON.stringify(item, null, "\t"));
                videoIdList.push(item.id.videoId);
            });

            // console.log(videoIdList);
        });
    }

    for (var i = 0; i < channelList.length; ++i) {
        videoIdByChannel[i] = videoIdList;
    }
    console.log(videoIdByChannel);
}

var channelTitle = "";
var thumbnailUrl = "";
var videoTitle = "";
var duration = "";
var viewCount = "";

var videoList = [];


function getMetadataFromId() {
    for (var i = 0; i < videoIdList.length; i++) {

        var request = gapi.client.youtube.videos.list({
            'part': 'snippet,contentDetails,statistics',
            'fields': 'items(contentDetails/duration,snippet(channelTitle,thumbnails/maxres/url,title),statistics/viewCount)',
            'id': videoIdList[i]
        });

        // Execute the API request.
        request.execute(function (response) {
            response.items.forEach(function (item) {
                // console.log(JSON.stringify(item, null, "\t"));
                channelTitle = item.snippet.channelTitle;
                thumbnailUrl = item.snippet.thumbnails.maxres.url;
                videoTitle = item.snippet.title;
                duration = item.contentDetails.duration;
                viewCount = item.statistics.viewCount;
            });

            for (var i = 0; i < videoIdList.length; ++i) {
                markers[i] = "some stuff";
            }

            // console.log(channelTitle);
            // console.log(thumbnailUrl);
            // console.log(videoTitle);
            // console.log(duration);
            // console.log(viewCount);
        });
    }
}
