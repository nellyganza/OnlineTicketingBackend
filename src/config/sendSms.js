const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const credentials = {
  apiKey: process.env.AFRICAN_API_KEY, // use your sandbox app API key for development in the test environment
  username: 'sandbox', // use 'sandbox' for development in the test environment
};
const Africastalking = require('africastalking')(credentials);

export const sendSms = (phonenumber, message) => {
  // Initialize a service e.g. SMS
  const sms = Africastalking.SMS;
  // Use the service
  const options = {
    to: [phonenumber],
    message,
  };

  // Send message and capture the response or error
  sms.send(options)
    .then((response) => {

    })
    .catch((error) => {

    });
};
export const sendTwilloSms = (phonenumber, message) => {
  client.messages
    .create({ body: message, from: process.env.REACT_APP_TWILIO_PHONE_NUMBER, to: phonenumber })
    .then((me) => console.log(me.sid));
};
