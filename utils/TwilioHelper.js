const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

exports.sendTrackedItemMessage = (trackedItem) => {
    const msg = `Your item is cheap!! ${trackedItem.url}`;
    const from = process.env.FROM_PHONE_NUMBER;
    const to = trackedItem.phone;
    client.messages
        .create({ body: msg, from, to })
        .then((message) => console.log(message.sid))
        .catch((err) => console.error(err));
};
