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
        $('#sign-in-or-out-button').click(function() {
            handleAuthClick();
        });
        $('#revoke-access-button').click(function() {
            revokeAccess();
        });
    });
}
function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        GoogleAuth.signOut();
    } else {
        GoogleAuth.signIn();
    }
}
function revokeAccess() {
    GoogleAuth.disconnect();
}
function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        $('#sign-in-or-out-button').html('Sign out');
        $('#revoke-access-button').css('display', 'inline-block');
        $('#auth-status').html('You are currently signed in and have granted ' +
            'access to this app.');
    } else {
        $('#sign-in-or-out-button').html('Sign In/Authorize');
        $('#revoke-access-button').css('display', 'none');
        $('#auth-status').html('You have not authorized this app or you are ' +
            'signed out.');
    }
}
function updateSigninStatus(isSignedIn) {
    setSigninStatus();
}