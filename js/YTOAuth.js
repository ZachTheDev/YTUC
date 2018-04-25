/*
 * Copyright (c) 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
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

        getChannels();

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