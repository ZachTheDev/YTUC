var channelList = [];
var uploadPlaylistList = [];
var videoIdList = [];

function getChannels() {
    var jsonFinder = {};
    var request = gapi.client.youtube.subscriptions.list({'mine': 'true', 'part': 'snippet',
        'fields': 'items/snippet/resourceId/channelId,nextPageToken,pageInfo,prevPageToken,tokenPagination',
        'maxResults': '1'});

    // Execute the API request.
    request.execute(function (response) {
        response.items.forEach(function (item) {
            jsonFinder[item.id] = item.snippet;
            //console.log(JSON.stringify(jsonFinder, null, "\t"));
            channelList.push(jsonFinder.undefined.resourceId.channelId);
        });
        // console.log(channelList);
    });
}

function getUploadPlaylistId() {
    for (var i = 0; i < channelList.length; i++) {
        uploadPlaylistList[i] = setCharAt(channelList[i], 1, 'U');
    }
    console.log(uploadPlaylistList);

    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }
}

function getVideoId() {
    var jsonFinder = {};

    for (var i = 0; i < uploadPlaylistList.length; i++) {
        var request = gapi.client.youtube.playlistItems.list({'part': 'contentDetails',
            'fields': 'items(contentDetails(videoId,videoPublishedAt))',
            'maxResults': '50', 'playlistId': uploadPlaylistList[i]});

        // Execute the API request.
        request.execute(function (response) {
            response.items.forEach(function (item) {
                jsonFinder[item.id] = item.contentDetails;
                //console.log(JSON.stringify(jsonFinder, null, "\t"));
                videoIdList.push(jsonFinder.undefined.videoId);
            });
            console.log(videoIdList);
        });
    }
}

function getMetadataFromId() {

}
