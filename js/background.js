var channelList = [];
var videoIdList = [];

function getChannels() {
    var request = gapi.client.youtube.subscriptions.list({
        'mine': 'true',
        'part': 'snippet',
        'fields': 'items/snippet/resourceId/channelId,nextPageToken,pageInfo,prevPageToken,tokenPagination',
        'maxResults': '50'});

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
var finalFormat = [];

function getVideoId() {
    for (var i = 0; i < channelList.length; i++) {

        const curChannel = channelList[i];

        var request = gapi.client.youtube.search.list({
            'part': 'snippet',
            'fields': 'items/id/videoId',
            'maxResults': '50',
            'channelId': curChannel,
            'publishedAfter': '2018-04-20T00:00:00Z'
        });

        // Execute the API request.
        request.execute(function (response) {
            videoIdList = [];
            response.items.forEach(function (item) {
                // console.log(JSON.stringify(item, null, "\t"));
                videoIdList.push(item.id.videoId);
            });

            // console.log(videoIdList);

            if (!videoIdList.length) {
                videoIdList.push("No recent videos");
            }

            videoIdByChannel.push(videoIdList);

            var channelAndVideos = [
                [curChannel],
                [videoIdList]
            ];
            // console.log(channelAndVideos);

            finalFormat.push(channelAndVideos);

        });
    }
    // console.log(videoIdByChannel);
    console.log(finalFormat);
}

var channelTitle = "";
var thumbnailUrl = "";
var videoTitle = "";
var duration = "";
var viewCount = "";

var videoList = [];


function getMetadataFromId() {
    for (var i = 0; i < finalFormat.length; i++) {

        var request = gapi.client.youtube.videos.list({
            'part': 'snippet,contentDetails,statistics',
            'fields': 'items(contentDetails/duration,snippet(channelTitle,thumbnails/maxres/url,title),statistics/viewCount)',
            'id': finalFormat[0][i]
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
