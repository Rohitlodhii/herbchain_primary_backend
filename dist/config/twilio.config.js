// src/config/twilio.ts
import dotenv from "dotenv";
dotenv.config();
import Twilio from "twilio";
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
export default client;
//# sourceMappingURL=twilio.config.js.map