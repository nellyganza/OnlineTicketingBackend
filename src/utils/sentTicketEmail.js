import dotenv from 'dotenv';
import { transporter } from '../helpers/mailHelper';
import { sentTicket } from '../services/templates/sendTicketEmail';

dotenv.config();
export const sendTicketEmail = async (ticketInfo) => {
  try {
    const {
      email,
      emailData,
    } = ticketInfo;
    const emailTemplate = sentTicket({ ...emailData });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Ticket',
      html: emailTemplate,
    };
    const emailsent = await transporter.sendMail(mailOptions);
    if (emailsent) {
      const message = 'Ticket has been sent to your email';
      return {
        message,
      };
    }
  } catch (error) {
    console.log(error.message);
  }
};
