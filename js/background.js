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
    let request = gapi.client.youtube.subscriptions.list({
        'mine': 'true',
        'part': 'snippet',
        'fields': 'items/snippet/resourceId/channelId,nextPageToken,pageInfo,prevPageToken,tokenPagination',
        'maxResults': '5'});

    // Execute the API request.
    request.execute(function (response) {
        response.items.forEach(function (item) {
            //console.log(JSON.stringify(item, null, "\t"));
            channelList.push(item.snippet.resourceId.channelId);
        });
        // console.log(channelList);
    });
}

function getVideoId() {
    for (let i = 0; i < channelList.length; i++) {

        const curChannel = channelList[i];

        let request = gapi.client.youtube.search.list({
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
    let i;
    let x;
    for (i = 0, x = 0; i < finalFormat.length, x < videoCount; i++, x++) {

        let channelId = finalFormat[i][0];
        // console.log(finalFormat[i][0][0]);

      //TODO  note to self, put x on the outside of i to try and see if the problem is with i

        console.log(finalFormat[i][1][0]);
        console.log(finalFormat[i][1][0][x]);

        // let request = gapi.client.youtube.videos.list({
        //     'part': 'snippet,contentDetails,statistics',
        //     'fields': 'items(contentDetails/duration,snippet(channelTitle,thumbnails/maxres/url,title),statistics/viewCount)',
        //     'id': finalFormat[i][1][1]
        // });
        //
        // // Execute the API request.
        // request.execute(function (response) {
        //     response.items.forEach(function (item) {
        //         // console.log(JSON.stringify(item, null, "\t"));
        //         channelTitle = item.snippet.channelTitle;
        //         thumbnailUrl = item.snippet.thumbnails.maxres.url;
        //         videoTitle = item.snippet.title;
        //         duration = item.contentDetails.duration;
        //         viewCount = item.statistics.viewCount;
        //     });
        //
        //     finalData.push([channelId, [channelTitle, thumbnailUrl, videoTitle, duration, viewCount]]);
        //
        // });
    }
    console.log(finalData);
}
