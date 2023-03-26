import dotenv from 'dotenv';
import Util from '../helpers/utils';
import { newJwtToken, getJwtToken } from '../helpers/tokenGenerator';
import { transporter } from '../helpers/mailHelper';
import { confirmEmail } from '../services/templates/confirmEmail';

dotenv.config();

const util = new Util();
export const sendLink = async (res, userInfo) => {
  try {
    const { email, id, firstName } = userInfo;
    const payload = { userEmail: email, userId: id };
    const tokenLink = await getJwtToken(payload, '72h');
    const emailTemplate = confirmEmail({ name: firstName, token: tokenLink });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Account Verification',
      html: emailTemplate,
    };
    const emailsent = await transporter.sendMail(mailOptions);
    let message = '';
    if (emailsent) {
      message = 'A verification email has been sent to you email please go and confirm that email';
      const data = { token: tokenLink };
      util.setSuccess(201, message, data);
      return util.send(res);
    }
  } catch (error) {
    if (error.code === 'EAUTH') {
      util.setSuccess(200, 'Account Created but A verification email not Sent but you can contact the Administrator to activate your account', { token: null });
    } else {
      util.setError(500, error.message);
    }
    return util.send(res);
  }
};
