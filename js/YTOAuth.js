/*
 *  Code below was taken from and modified to work with my project. Credit goes to YouTube Api Docs
 */

var GoogleAuth;
var SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}
function initClient() {
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';
    gapi.client.init({
        'apiKey': 'AIzaSyC0GOCHA0K_pVok6HffxhihrfqXh0iH9sc',
        'discoveryDocs': [discoveryUrl],
        'clientId': '918620463378-kgautas2u8ifhgtqnnpb3scrv1oh0e1d.apps.googleusercontent.com',
        'scope': SCOPE
    }).then(function () {
        GoogleAuth = gapi.auth2.getAuthInstance();
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
        var user = GoogleAuth.currentUser.get();
        setSigninStatus();
        $('.signIn').click(function() {
            handleAuthClick();
        });
        $('#navSignOut').click(function() {
            GoogleAuth.signOut();
        });
    });
}

function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        //do nothing
    } else {
        GoogleAuth.signIn();
    }
}

function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        $('#navSignOut').html('Sign out');

        setupLogin();
        getChannels();

    } else {
        $('#signIn').html('Sign In');
    }
}
function updateSigninStatus(isSignedIn) {
    setSigninStatus();
}