const Nexmo = require('nexmo');
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN,
);

export const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SCRET_KEY,
});

export const sendMessageSMS = async (to, message) => {
  const sentsms = await client.messages.create({
    from: process.env.REACT_APP_TWILIO_PHONE_NUMBER,
    to,
    body: message,
  });
  return sentsms;
};
