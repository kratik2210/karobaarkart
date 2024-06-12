
const axios = require('axios');
const { google } = require('googleapis');

function getAccessToken() {
    return new Promise(function (resolve, reject) {
        const key = require('../karobarkat-firebase-adminsdk-ayczn-332e467516.json');
        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            ['email', 'https://www.googleapis.com/auth/firebase.messaging'],
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}


async function sendMessage(message) {
    const accessToken = await getAccessToken();
    const fcmEndpoint = 'https://fcm.googleapis.com/v1/projects/karobarkat/messages:send';

    try {
        const response = await axios.post(fcmEndpoint, message, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('FCM message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending FCM message:', error.response.data);
    }
}

// Example message payload
// const message = {
//     message: {
//         token: 'ecmsZXzqQnSGJuSK8BuPPZ:APA91bH20_VtkaRHvMK9dIA6ULsG4uycp8RlyQ269PNvwqrZyLt3QCAwsNRMx40ebxiqHC2jzDNdphil97QhCD8v6HTxV7rySbqivE1U1Tgl53LUyydqPRIyWc8T1wCRbWX7BQZjmToG',
//         notification: {
//             title: 'Test Notification',
//             body: 'This is a test notification'
//         }
//     }
// };

// sendMessage(message);

module.exports = { sendMessage }

