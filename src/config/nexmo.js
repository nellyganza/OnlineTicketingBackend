const Nexmo = require('nexmo');

export const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SCRET_KEY,
});
