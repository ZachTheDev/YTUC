let channelList = [];
let videoIdList = [];

let videoIdByChannel = [];
let finalFormat = [];

let channelTitle;
let thumbnailUrl;
let videoTitle;
let duration;
let viewCount;

let finalData = [];

let videoCount = 0;

function getChannels() {
    channelList = [];
    let request = gapi.client.youtube.subscriptions.list({
        'mine': 'true',
        'part': 'snippet',
        'fields': 'items/snippet/resourceId/channelId,nextPageToken,pageInfo,prevPageToken,tokenPagination',
        'maxResults': '50'
    });

    let totalResults;
    let pageToken;
    // Execute the API request.
    request.execute(function (response) {
        // console.log(JSON.stringify(response, null, "\t"));
        totalResults = response.pageInfo.totalResults;
        pageToken = response.nextPageToken;

        if (totalResults >= 50) {
            let request = gapi.client.youtube.subscriptions.list({
                'mine': 'true',
                'part': 'snippet',
                'fields': 'items/snippet/resourceId/channelId,nextPageToken,pageInfo,prevPageToken,tokenPagination',
                'maxResults': '50',
                'pageToken': pageToken
            });
            request.execute(function (response) {
                response.items.forEach(function (item) {
                    // console.log(JSON.stringify(item, null, "\t"));
                    channelList.push(item.snippet.resourceId.channelId);
                });
            });
        }
        response.items.forEach(function (item) {
            // console.log(JSON.stringify(item, null, "\t"));
            channelList.push(item.snippet.resourceId.channelId);
        });
    });
    // console.log(channelList);
}

function getVideoId() {
    videoIdList = [];videoIdByChannel = [];finalFormat = [];
    for (let i = 0; i < channelList.length; i++) {

        const curChannel = channelList[i];

        let request = gapi.client.youtube.search.list({
            'part': 'snippet',
            'fields': 'items/id/videoId',
            'publishedAfter': '2018-04-20T00:00:00Z',
            'maxResults': '50',
            'channelId': curChannel
        });

        // Execute the API request.
        request.execute(function (response) {
            videoIdList = [];
            response.items.forEach(function (item) {
                // console.log(JSON.stringify(item, null, "\t"));
                videoIdList.push(item.id.videoId);
                videoCount = videoCount + 1;
            });

            // console.log(videoIdList);

            if (videoIdList.length) {
                videoIdByChannel.push(videoIdList);
                let channelAndVideos = [
                    [curChannel],
                    [videoIdList]
                ];
                finalFormat.push(channelAndVideos);
            }else{
                //alert(curChannel + "has no new videos");
                //TODO do something here to notify user of empty channel
            }
        });
    }
    console.log(finalFormat);
}

function getMetadataFromId() {
    channelTitle = '';thumbnailUrl = '';videoTitle = '';duration = '';viewCount = '';finalData = [];
    for (let x = 0; x < videoCount; x++) {
        for (let i = 0; i < finalFormat.length; i++) {

            let videoId = finalFormat[i][1][0][x];
            let channelId = finalFormat[i][0][0];

            // console.log(finalFormat[i][1][0]);
            // console.log(finalFormat[i][1][0][x]);

            if (typeof(videoId) != 'undefined') {
                let request = gapi.client.youtube.videos.list({
                    'part': 'snippet,contentDetails,statistics',
                    'fields': 'items(contentDetails/duration,snippet(channelTitle,title),statistics/viewCount)', //,thumbnails/maxres/url
                    'id': videoId
                });
                // Execute the API request.
                request.execute(function (response) {
                        // console.log(response);
                        response.items.forEach(function (item) {
                            // console.log(JSON.stringify(item, null, "\t"));
                            channelTitle = item.snippet.channelTitle;
                            thumbnailUrl = "https://i.ytimg.com/vi/" + videoId + "/maxresdefault.jpg";//item.snippet.thumbnails.maxres.url;
                            videoTitle = item.snippet.title;
                            duration = item.contentDetails.duration;
                            viewCount = item.statistics.viewCount;
                        });
                        finalData.push([channelId, [channelTitle, thumbnailUrl, videoTitle, duration, viewCount]]);
                });
            }
        }
    }
    console.log(finalData);
}
