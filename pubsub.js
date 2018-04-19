'use strict';

const express = require('express');
const app = express();
const google = require('googleapis');
const youtube = google.youtube({ version: 'v3', auth: process.env.YT_API_KEY });
const Promise = require('bluebird');
const request = require('request');

var getChannels = require('./ytapiservice.js');

var channelList = [ 'UCFtc3XdXgLFwhlDajMGK69w',
                    'UCDWIvJwLJsE4LG1Atne2blQ',
                    'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
                    'UCK376qNDlNZZDNHsnaWuTeg',
                    'UChWv6Pn_zP0rI6lgGt3MyfA',
                    'UCWizIdwZdmr43zfxlCktmNw',
                    'UCIRiWCPZoUyZDbydIqitHtQ',
                    'UCBJycsmduvYEL83R_U4JriQ',
                    'UCo_IB5145EVNcf8hw1Kku7w',
                    'UCEY0yxj6QxG4RBVRSe5orig',
                    'UC11OPzwn5Wt0-LN3rARunmg',
                    'UCAftK82I1ko_AZn6t39DtCg',
                    'UCr3cBLTYmIK9kY0F_OdFWFQ',
                    'UC1KKSlZs8GJPFdEFUZwt1ZA',
                    'UC2MJylovjrLtsGP0_4UrqrQ',
                    'UCzpCc5n9hqiVC7HhPwcIKEg',
                    'UCa0YfMRjgEMnCX1zk3QtNvg',
                    'UCsTcErHg8oDvUnTzoqsYeNw',
                    'UCE2Ca3MkFZ4Ny4dEB5aPnHw',
                    'UCsDmESjqNPukDmVnuneLrqw',
                    'UCtinbF-Q-fVthA0qrFQTgXQ',
                    'UCshoKvlZGZ20rVgazZp5vnQ',
                    'UCHVvQgQd4JrIS_FOFbHOK0g',
                    'UC1zZE_kJ8rQHgLTVfobLi_g',
                    'UCn7MpX76Bou10j6IkgAcdjg',
                    'UC2PcgVTrX3Oz9aTJtJWSdkA',
                    'UCXGR70CkW_pXb8n52LzCCRw',
                    'UC3sznuotAs2ohg_U__Jzj_Q',
                    'UCuPWP2zVJWjheu7K9DHlLNw',
                    'UCjgpFI5dU-D1-kh9H1muoxQ',
                    'UCEaReYkPVfExkfXptk0bSPw',
                    'UCj4zC1Hfj-uc90FUXzRamNw',
                    'UCK3eoeo-HGHH11Pevo1MzfQ',
                    'UC99lkbVG8I5hRSZa4FD8zgw',
                    'UCp68_FLety0O-n9QU6phsgw',
                    'UCY1kMZp36IQSyNx_9h4mpCg',
                    'UCo8bcnLyZH8tBIH9V1mLgqQ',
                    'UCWFKCr40YwOZQx8FHU_ZqqQ',
                    'UC4USoIAL9qcsx5nCZV_QRnA',
                    'UCJ0-OtVpF0wOKEqT2Z1HEtA',
                    'UCGwu0nbY2wSkW8N-cghnLpA',
                    'UC7_YxT-KID8kRbqZo7MyscQ',
                    'UCwRXb5dUK4cvsHbx-rGzSgw',
                    'UCJ6oisIrPR4WqJbk6JeLoBw',
                    'UCBa659QWEk1AI4Tg--mrJ2A',
                    'UCWXCrItCF6ZgXrdozUS-Idw',
                    'UCSwwxl2lWJcbGOGQ_d04v2Q',
                    'UCf2ocK7dG_WFUgtDtrKR4rw',
                    'UCMz7JFeTmiO2oJgtmYhpUmQ',
                    'UCke6I9N4KfC968-yRcd5YRg' ];

// getChannels.index(function(response){
//     channelList = response;
//     //channelList = console.log(channelList);
// });

app.post('/subscription', function (req, res) {
    var x = 0;
    for (var i in channelList) {
        request.post('https://pubsubhubbub.appspot.com/subscribe', {
            form: {
                'hub.mode': ('subscribe'),
                'hub.callback': 'http://postb.in/hkCN7mSF',
                'hub.topic': 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=' + channelList[x].id,
                'hub.lease_seconds': '31536000'
            }
        }, (error, pubSubResponse) => {
            if (!error && pubSubResponse.statusCode == 202) {
                res.status(200).json({
                    code: 'channel_subscribed',
                    details: "Subscribed/unsubscribed succesfully to https://www.youtube.com/channel/" + channels[x].id
                })
            } else {
                res.status(500).json({
                    code: 'subscription_failed',
                    details: "An error occured while connecting to Google's PubSubHubbub Hub",
                    error
                })
            }
        });
        x++
    }
});

module.exports = app;