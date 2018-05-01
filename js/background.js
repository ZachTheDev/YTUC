let channelList = [];
let channelIcon = [];

let inputDate = '';

let videoIdList = [];

let videoIdByChannel = [];
let finalFormat = [];

let channelTitle = '';
let uploadDate = '';
let thumbnailUrl = '';
let videoTitle = '';
let duration = '';
let viewCount = '';

let finalData = [];

let globalData = [];

let videoCount = 0;

function setupLogin() {
    $('#jumboButton').attr('class', 'btn btn-default btn-lg pmd-ripple-effect jumboButton').attr('onClick', '$(\'#dtp\').focus();')
        .html('Pick a Date');
    $('#jumboTitle').html('Pick a Date');
    $('#jumboSubtitle').html('Select a date to get a list of videos published after the date.');
    $('#dtp').bootstrapMaterialDatePicker
    ({
        time: 'false'
    }).on('change', function(e, date) {
        getVideoId();
        setTimeout(function(){
            getMetadataFromId();
            setTimeout(function(){
                createCards();
            }, 1000);
        },1000);
    })
}

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
        if(!channelList.length) {
            alert('No Channels Found, try another YouTube Account');
        }
    });
    console.log(channelList);
}

function getVideoId() {
    videoIdList = [];videoIdByChannel = [];finalFormat = [];videoCount = 0;

    let isVideosPresent = false;

    let rawDate = $('#dtp').val();
    inputDate = rawDate + 'T00:00:00Z';

    for (let i = 0; i < channelList.length; i++) {

        const curChannel = channelList[i];

        let request = gapi.client.youtube.search.list({
            'part': 'snippet',
            'fields': 'items/id/videoId',
            'publishedAfter': inputDate, //'2018-04-20T00:00:00Z'
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
                isVideosPresent = true;
                videoIdByChannel.push(videoIdList);
                let channelAndVideos = [
                    [curChannel],
                    [videoIdList]
                ];
                finalFormat.push(channelAndVideos);
            }else{
                //TODO do something here to notify user of empty channel
            }
        });
    }
    if (isVideosPresent === false) {
        alert("Some channels have no new videos");
    }

    console.log(finalFormat);
}

function getMetadataFromId() {
    channelTitle = '';uploadDate = '';thumbnailUrl = '';videoTitle = '';duration = '';viewCount = '';finalData = [];
    for (let x = 0; x < videoCount; x++) {
        for (let i = 0; i < finalFormat.length; i++) {

            let videoId = finalFormat[i][1][0][x];
            let channelId = finalFormat[i][0][0];

            if (typeof(videoId) !== 'undefined') {
                let request = gapi.client.youtube.videos.list({
                    'part': 'snippet,contentDetails,statistics',
                    'fields': 'items(contentDetails/duration,snippet(channelId,channelTitle,title,publishedAt),statistics/viewCount)',
                    'id': videoId
                });

                // Execute the API request.
                request.execute(function (response) {
                    // console.log(response);
                    response.items.forEach(function (item) {
                        // console.log(JSON.stringify(item, null, "\t"));
                        channelTitle = item.snippet.channelTitle;
                        uploadDate = item.snippet.publishedAt;
                        thumbnailUrl = "https://i.ytimg.com/vi/" + videoId + "/maxresdefault.jpg";
                        videoTitle = item.snippet.title;
                        duration = item.contentDetails.duration;
                        viewCount = item.statistics.viewCount;
                    });

                    // let iconRequest = gapi.client.youtube.channels.list({
                    //     'part': 'snippet',
                    //     'fields': 'items(snippet(thumbnails/default/url,title)),nextPageToken,pageInfo,prevPageToken,tokenPagination',
                    //     'id': channelId
                    // });
                    //
                    // // Execute the API request.
                    // iconRequest.execute(function (response) {
                    //     // console.log(JSON.stringify(response, null, "\t"));
                    //     response.items.forEach(function (item) {
                    //         // console.log(JSON.stringify(item, null, "\t"));
                    //         channelIconUrl = item.snippet.thumbnails.default.url;
                    //         let channelTitle = item.snippet.title;
                    //         channelIcon.push([channelTitle, channelIconUrl]);
                    //     });
                    // });

                    // channelIcon.sort(function (x, y) {
                    //     if ((x.toString().toLowerCase()) < (y.toString().toLowerCase())) return -1;
                    //     else if ((x.toString().toLowerCase()) > (y.toString().toLowerCase())) return 1;
                    //     return 0;
                    // });


                    finalData.push([channelTitle, [channelId, channelTitle, uploadDate, thumbnailUrl, videoTitle, duration, viewCount]]);

                     finalData.sort(function (a, b) {
                         if ((a.toString().toLowerCase()) < (b.toString().toLowerCase())) return -1;
                         else if ((a.toString().toLowerCase()) > (b.toString().toLowerCase())) return 1;
                         return 0;
                    });
                });
            }
        }
    }
    console.log(finalData);
    globalData = finalData;
}

function createCards() {
    $('#cardContainer').empty();
    for (let i = 0; i < globalData.length; i++) {

        // let channelIcon = globalData[i][1][1];
        let channelTitle = globalData[i][0];
        let thumbnail = globalData[i][1][3];
        let title = globalData[i][1][4];
        let viewCount = globalData[i][1][6];
        let publishedDate = globalData[i][1][2];
        let videoDuration = moment.duration((globalData[i][1][5]), 'seconds').format("mm:ss");


        // console.log(videoDuration);


        $('#cardContainer').append(
            '<div class="col-sm-4 col-xs-12">' +
                '<!-- Default card starts -->' +
                '<div class="pmd-card pmd-card-default pmd-z-depth">' +
                    '<!-- Card body -->' +
                    '<div class="pmd-card-title">' +
                        '<div class="titleContainer clearfix float-my-children">' +
                            '<img src="' + channelIcon + '" style="max-width:10%;display: inline;"/>' +
                            '<p class="pmd-card-title-text" style="font-size: 1.3rem;font-weight: 500; margin-left: 0.5rem;">' + channelTitle + '</p>' +
                        '</div>' +
                    '</div>' +

                    '<hr style="max-width: 90%;">' +

                    '<div class="pmd-card-body">' +
                        '<div class="thumbnailContainer">' +
                            '<img src="' + thumbnail + '" class="thumbnailImage" style="max-width:100%;"/>' +
                            '<span class="thumbnailTag">' + videoDuration + '</span>' +
                        '</div>' +
                        '<div class="detailsContainer">' +
                            '<h3 class="videoTitle">' + title + '</h3>' +
                            '<div class="metadata">' +
                                '<span class="views">' + viewCount + ' views</span><span class="uploadTime">' + publishedDate + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<!--Default card ends -->' +
                '</div>' +
            '</div>'
        );
    }
}

