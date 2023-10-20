import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const express = require('express');

const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const viewPath = path.resolve(__dirname, '../../public/views');
const partialsPath = path.resolve(__dirname, '../../public/partials');

dotenv.config();
export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.appPassword,
  },
});
export const sendNotification = async ({
  to, subject, template, attachments, data,
}) => {
  transporter.use('compile', hbs({
    viewEngine: {
      extName: '.handlebars',
      // partialsDir: viewPath,
      layoutsDir: viewPath,
      defaultLayout: false,
      partialsDir: partialsPath,
      express,
    },
    viewPath,
    extName: '.handlebars',
  }));
  console.log(path.resolve(__dirname, '../public/'));
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    template,
    context: {
      emailData: data,
    },
    attachments: [
      attachments.map((attachment) => ({ filename: attachment.name, path: path.resolve(__dirname, attachment.path) })),
    ],
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return false;
    }
    console.log(`Email sent: ${info.response}`);
    return true;
  });
};
