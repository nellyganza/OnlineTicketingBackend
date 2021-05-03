import {nexmo} from '../../config/nexmo';

// We need the phone number now to send an SMS
const nexmoNumber = process.env.NEXMO_NUMBER;

export const sendSMS = (number,text)=>{
    const from = nexmoNumber;
    // This regex removes any non-decimal characters. 
    // This allows users to pass numbers like "(555) 555-5555" instead of "5555555555"
    const to = number.replace(/[^\d]/g, '');
    nexmo.message.sendSms(
        from,
        to,
        text,
        {},
        (err, data) => {
            if (err) {
                console.log(err.message);
                return err.message;
            }
            console.log(data);
            return data;
        }
    );
}