$(document).ready(function(){
    $("button").click(function(){
        for (let i = 0; i > videoCount; i++) {
            let videoElement;

            videoElement = $("<p></p>").text();

            $("body").append(videoElement);
        }
    });
});