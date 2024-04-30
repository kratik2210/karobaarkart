// import * as crypto from 'crypto';
// import * as admin from 'firebase-admin';
// var serviceAccount = require('../../models/firebase/commonnodejs-a9dd2-firebase-adminsdk-jo6nw-86dc18d6d9.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://commonnodejs-a9dd2.firebaseio.com',
// });

// const options = {
//     priority: 'high',
// };

//  function cryptoText(data, type = 'generate') {
//     try {
//         if (type === 'generate') {
//             const hash = crypto.createHash('sha512');
//             hash.update(data);
//             return hash.digest('hex');
//         }
//     } catch (error) {
//         return false;
//     }
// }

function pad(d) {
    return d < 10 ? '0' + d.toString() : d.toString();
}

function DataInterval(interval) {
    var date = new Date(); // Now
    date.setDate(date.getDate() + interval); // Set now + 30 days as the new date
    return (
        (date.getFullYear() < 10 ? '0' + date.getFullYear().toString() : date.getFullYear().toString()) +
        '-' +
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString())
    );
}

function ValidateEmail(data) {
    var mailFormat =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return mailFormat.test(data);
}

function getBeforeAt(str) {
    return (str.charAt(0).toUpperCase() + str.slice(1)).split('@')[0].replace(/[0-9]/g, '');
}

function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function addDigits(data) {
    var result = '';
    result = data.toString() + Math.floor(1000 + Math.random() * 9000000000);
    return result;
}

function separator(str, sep) {
    var output = '';
    for (var i = str.length; i > 0; i -= 4) {
        if (output) {
            output = str.charAt(i - 4) + str.charAt(i - 3) + str.charAt(i - 2) + str.charAt(i - 1) + sep + output;
        } else {
            output = str.charAt(i - 4) + str.charAt(i - 3) + str.charAt(i - 2) + str.charAt(i - 1);
        }
    }
    return output;
}

//  function sendNotification(fcmToken, title, body) {
//     return new Promise((resolve, reject) => {
//         try {
//             var payload = {
//                 notification: {
//                     title: title,
//                     body: body,
//                 },
//                 data: { title: title, body: body, HTML: body },
//             };
//             admin
//                 .messaging()
//                 .sendToDevice(fcmToken, payload, options)
//                 .then(function (response) {
//                     resolve({ Notification: response });
//                 })
//                 .catch(function (error) {
//                     reject(error);
//                 });
//         } catch (e) {
//             reject(e);
//         }
//     });
// }

//  function sendAdminNotification(registrationToken, body, Content, AdminId) {
//     return new Promise((resolve, reject) => {
//         try {
//             const Message = {
//                 notification: {
//                     title: 'commonnodejs',
//                     body: body,
//                 },
//                 data: {
//                     HTML: Content,
//                     body: body,
//                     title: 'commonnodejs',
//                     AdminId: AdminId.toString(),
//                 },
//                 tokens: registrationToken,
//             };
//             admin
//                 .messaging()
//                 .sendMulticast(Message)
//                 .then(function (response) {
//                     resolve({ ChatMessage: Message });
//                 })
//                 .catch(function (error) {
//                     reject(error);
//                 });
//         } catch (e) {
//             reject(e);
//         }
//     });
// }

const getMissingParams = function (expectedParams, receivedParams) {

    let missingParams = [];
    // for (let i = 0; i < expectedParams.required.length; i++) {
    //     if (Object.keys(receivedParams).includes(expectedParams.required[i]) === false) missingParams.push(expectedParams.required[i]);
    // }

    // Check for missing required fields
    for (let i = 0; i < expectedParams.required.length; i++) {
        const param = expectedParams.required[i];
        // Check if the required field is not present in the receivedParams
        if (!(param in receivedParams) || receivedParams[param] === undefined || receivedParams[param] === null || receivedParams[param] === '') {
            missingParams.push(param);
        }
    }

    let output = null;
    if (missingParams.length) {
        output = 'Expected parameters: ' + missingParams.join(', ');
        output += expectedParams.optional.length ? '. Optional: ' + expectedParams.optional.join(', ') : '';
    }

    return output;
};

function generateRandomNumber(length) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOTP() {
    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number

    // Generate a random number between min and max (inclusive)
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;

    return otp.toString().padStart(4, '0'); // Ensure the OTP is 4 digits
}

module.exports = {
    getMissingParams,
    generateOTP
};