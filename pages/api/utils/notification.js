const admin = require('./../helper/admin');

function PushNotification(fcm, title, body) {
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    var payload = {
        notification: {
            title: title,
            body: body,
        }
    };

    return admin.messaging().sendToDevice(fcm, payload, options)
}


module.exports = { PushNotification }