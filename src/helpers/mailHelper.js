import dotenv from 'dotenv';
import fs from 'fs';
import nodemailer from 'nodemailer';

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
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    template,
    context: {
      emailData: data,
    },
    attachments,
  };

  const deleteFileFromDisk = async (filename) => {
    fs.rmSync(filename, {
      force: true,
    });
  };
  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return false;
    }
    console.log(`Email sent: ${info.response}`);
    attachments.forEach((attach) => {
      if (attach.cid !== 'favicon') {
        deleteFileFromDisk(attach.path);
      }
    });
    return true;
  });
};
