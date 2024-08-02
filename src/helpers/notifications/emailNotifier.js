import dotenv from 'dotenv';
import fs from 'fs';
import { transporter } from '../mailHelper';

dotenv.config();
export const renderEmail = ($message) => {
  const template = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
        <title>Document</title>
        <style>
        *{
            box-sizing: border-box;
            margin:0px;
            padding:0px;
        }
        html,body{
            font-family: poppins;
        }
        .logo{
            width:100%;
            height:auto;
            background:#f2f2f2;
            padding:5px 0px 5px 10px;
            
        }
        .logo > div{
            font-size:20px;
        }
        .content{
            padding:10px;
            color:#121111;
        }
        .button{
            background-color: #03CE75;
            padding:13px;
            border:0px;
            font-size:15px;
            margin-top:28px;
            text-decoration: none;
            color:#121111
        }
    </style>
    </head>
    <body>
        <div className="wrapper">
           <div className="logo">
            <div>EventIcore</div>
           </div>
          <center> <div className="content">
            <p>${$message}</p>
        </div></center>
        </div>
    </body>
    </html>`;
  return template;
};

export const sendNotification = async (email) => {
  const mailOpt = {
    from: process.env.EMAIL,
    to: email.email,
    subject: 'EventIcore Notification',
    html: email.message,
    attachments: [{
      filename: email.attachement.file,
      path: email.attachement.fileName,
      cid: email.attachement.cid,
    }],
  };
  await transporter.sendMail(mailOpt);
  fs.rm(email.attachement.fileName, () => {
  });
};
