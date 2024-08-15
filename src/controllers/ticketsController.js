import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';
import path from 'path';
import cloudinary from '../config/claudinary';
import {
  getAndUpdateSittingPlace,
  updateEvent,
  updatePaymentGrade, updateSittingPlace,
} from '../helpers/ControllerFunctions';
import htmlToPdf from '../helpers/htmlToPdf';
import { sendNotification } from '../helpers/mailHelper';
import { sentGuestTicket, sentTicket } from '../helpers/templates/sendTicketEmail';
import Util from '../helpers/utils';
import { sequelize } from '../models';
import { ETicketCurrentStatus, ETicketStatus } from '../models/enum/ETicketStatus';
import eventPaymentService from '../services/eventPaymentService';
import eventservice from '../services/eventService';
import EventSittingPlaceService from '../services/eventSittingPlaceService';
import guestService from '../services/guestService';
import ticketService from '../services/ticketService';

const QRCode = require('qrcode');

const util = new Util();

const saveFileToDisk = async (data, fileName) => fs.writeFileSync(fileName, data, 'base64', (err) => {
  if (err) {
    console.log(err);
  }
});

export default class ticketController {
  static async saveTicket(req, res) {
    const userId = req.userInfo.id;
    const { pay, attender } = req.body;
    const eventId = req.params.eventId;
    try {
      const resp = await this.createTicket(userId, eventId, attender, pay);
      util.setSuccess(200, resp);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async createTicket(userId, eventId, attender, pay) {
    const transaction = await sequelize.transaction();
    try {
      const event = await eventservice.findById(eventId);
      if (!event) {
        throw new Error('selected Event not Exist');
      }
      const keys = Object.keys(attender).map((e) => e);

      transaction.afterCommit(async () => 'Tickets Saved Successfully');
      const typePlace = [];
      let ticket;
      for (let index = 0; index < keys.length; index++) {
        const att = attender[keys[index]];
        const ind = _.findIndex(typePlace, { name: att.type });
        const result = ind === -1 ? await getAndUpdateSittingPlace(eventId, att.type, 'updatePlaces') : typePlace[ind].value;
        const { sittingPlace, place } = result;
        const { sitting } = result;

        if (ind > -1) {
          typePlace[ind] = { name: att.type, value: { sittingPlace: sittingPlace + 1, place, sitting } }; // (2)
        } else {
          typePlace.push({ name: att.type, value: { sittingPlace: sittingPlace + 1, place, sitting } });
        }
        ticket = await ticketService.createTicket({
          ...att, eventId, userId, paymenttype: pay.paymenttype, sittingPlace,
        }, transaction);
        await updateEvent(eventId, transaction);
        place[0][0].value = sittingPlace + 1;
        await EventSittingPlaceService.updateAtt({ placeAvailable: place }, { id: sitting.id }, transaction);
        await updatePaymentGrade(att.type, transaction);
        await updateSittingPlace(eventId, att.type, transaction);
      }
      await transaction.commit();
      if (ticket) {
        this.sendTicketEmail(ticket);
      }
    } catch (error) {
      await transaction.rollback();
      throw new Error(error.message);
    }
  }

  static async saveTicketUssd(req, res) {
    try {
      const { pay, attender } = req.body;
      const eventId = req.params.eventId;

      const event = await eventservice.findById(eventId);
      if (!event) {
        util.setError(404, 'selected Event not Exist');
        return util.send(res);
      }
      const sittingPlace = await getAndUpdateSittingPlace(eventId, attender.type, 'updatePlaces') - 1;
      const savedTicket = await ticketService.createTicket({
        ...attender, eventId, paymenttype: pay.paymenttype, sittingPlace,
      });
      if (savedTicket) {
        this.sendTicketEmail(savedTicket);
      }
      await updateEvent(eventId);
      await updatePaymentGrade(attender.type);
      await updateSittingPlace(eventId, attender.type);
      util.setSuccess(200, 'Your ticket saved Success');
      return util.send(res);
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  static async getTicketByEvent(req, res) {
    const eventId = req.params.eventId;
    try {
      const foundTickets = await ticketService.findByName({ eventId });
      util.setSuccess(200, 'Tickets Found', { ...foundTickets });
      return util.send(res);
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  static async getTicketByEventAndUser(req, res) {
    const eventId = req.params.eventId;
    const userId = req.userInfo.id;
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = (page * limit);
      const result = {};
      result.next = {
        page: page + 1,
        limit,
      };
      if (startIndex > 0) {
        result.prev = {
          page: page - 1,
          limit,
        };
      }
      const FoundTickets = await ticketService.findByName({ eventId, userId });
      result.result = FoundTickets.slice(startIndex, endIndex);
      util.setSuccess(200, 'Tickets Found', result);
      return util.send(res);
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  static async getTicketByUser(req, res) {
    const userId = req.userInfo.id;
    try {
      const {
        page, size, keyword, ...others
      } = req.query;
      const FoundTickets = await ticketService.filterUserTickets({ ...others, userId }, keyword, page, size);
      util.setSuccess(200, 'Tickets Found', FoundTickets);
      return util.send(res);
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  static async entrance(req, res) {
    try {
      const { eventId } = req.params;
      const { nationalId } = req.body;
      const sittingType = req.body.sittingType ? req.body.sittingType : null;
      if (!nationalId) {
        util.setError(400, 'No National ID found in request');
        return util.send(res);
      }

      const isGuest = await guestService.findByName({ nationalId, eventId });
      if (isGuest) {
        if (isGuest.status === ETicketStatus.NOT_ATTENDED) {
          isGuest.status = ETicketStatus.ATTENDED;
          isGuest.save();
          util.setSuccess(200, 'You are verified, Please Enter', isGuest);
          return util.send(res);
        }
        if (isGuest.status === ETicketStatus.ATTENDED) {
          util.setError(400, `${isGuest.fullName} is already Entered`);
          return util.send(res);
        }
      }
      let ticket;
      if (!sittingType) ticket = await ticketService.findBynationalId({ eventId, nationalId });
      else ticket = await ticketService.findBynationalId({ eventId, nationalId, type: sittingType });
      if (ticket) {
        const { id, status, currentStatus } = ticket.dataValues;
        if (status === ETicketStatus.NOT_ATTENDED) {
          const updatedticket = await ticketService.updateAtt({ status: ETicketStatus.ATTENDED, currentStatus: ETicketCurrentStatus.IN_EVENT }, { id });
          if (!updatedticket) {
            util.setError(400, 'Please Try again');
            return util.send(res);
          }
          util.setSuccess(200, 'You are verified, Please Enter', updatedticket);
          return util.send(res);
        }
        if (currentStatus === ETicketCurrentStatus.IN_EVENT) {
          const outTicket = await ticketService.updateAtt({ currentStatus: ETicketCurrentStatus.OUT_EVENT }, { id });
          if (!outTicket) {
            util.setError(400, 'Please Try again');
            return util.send(res);
          }
          util.setSuccess(200, 'Your are out now', outTicket);
          return util.send(res);
        }
        const inTicket = await ticketService.updateAtt({ currentStatus: ETicketCurrentStatus.IN_EVENT }, { id });
        if (!inTicket) {
          util.setError(400, 'Please Try again');
          return util.send(res);
        }
        util.setSuccess(200, 'Your are in now', inTicket);
        return util.send(res);
      }
      util.setError(400, 'Please, If you know that you have bought the ticket,Check the Tapping Device if match with your Ticket or Contact the Administrators');
      return util.send(res);
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  static async paymentVerificationWebhook(request, response) {
    const hash = request.headers['verif-hash'];

    if (!hash) {
      // discard the request,only a post with the right Flutterwave signature header gets our attention
    }
    const secret_hash = process.env.MY_HASH;
    if (hash !== secret_hash) {
      // silently exit, or check that you are passing the right hash on your server.
    }
    const request_json = JSON.parse(request.body);
    return response.send(200);
  }

  static async returnValidated(req, res) {
    util.setSuccess(200, 'Ticket Validated');
    return util.send(res);
  }

  static async getTicketByHoster(req, res) {
    try {
      const { id } = req.userInfo;
      const {
        page, size, keyword, ...other
      } = req.query;
      const tickets = await ticketService.filterByHoster(id, keyword, other, page, size);
      if (!tickets) {
        util.setError(404, 'Tickets Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Tickets Found', tickets);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async sendTicketEmail(foundTicket) {
    try {
      const {
        User, Event, EventPayment, ...ticket
      } = foundTicket.dataValues;
      const segs = [
        { data: Event.dataValues.nationalId, mode: 'alphanumeric' },
      ];

      const qr = await QRCode.toDataURL(segs);
      const data = qr.replace(/^data:image\/\w+;base64,/, '');
      const generalPath = `${path.resolve()}/src/public/images/`;
      const fileName = `${generalPath + ticket.fullName.replace(/\s/g, '')}barcode.png`;
      await saveFileToDisk(data, fileName);

      const ticketInfo = {
        email: ticket.email,
        emailData: {
          eventName: Event.dataValues.title,
          price: EventPayment.dataValues.price,
          bgTicket: EventPayment.dataValues.bgTicket,
          date: moment(Event.dataValues.dateAndTimme).format('LL'),
          time: moment(Event.dataValues.dateAndTimme).format('LT'),
          place: Event.dataValues.place,
          fullName: ticket.fullName,
          userName: `${User.dataValues.firstName} ${User.dataValues.lastName}`,
          seat: ticket.sittingPlace,
          type: EventPayment.dataValues.name,
          cardType: ticket.cardType,
          nationalId: ticket.nationalId.replace(/.(?=.{4})/g, 'x'),
          fileName: qr,
        },
      };
      const pdfTicketPathFile = `${generalPath + ticket.fullName}ticket.pdf`;
      const pdf = await htmlToPdf(sentTicket(ticketInfo.emailData), pdfTicketPathFile);
      const byteArrayBuffer = Buffer.from(pdf, 'base64');
      const saveimg = await new Promise((resolve) => {
        cloudinary.uploader.upload_stream({ format: 'png', crop: 'fill' }, (error, uploadResult) => resolve(uploadResult)).end(byteArrayBuffer);
      });
      foundTicket.ticketImg = saveimg.secure_url;
      await foundTicket.save();
      const attach = { fileName: `${ticket.fullName}-ticket.png`, path: saveimg.secure_url, cid: 'ticket' };
      sendNotification({
        to: ticketInfo.email,
        subject: 'Ticket Email from EventIcore',
        template: 'index',
        attachments: [
          attach, {
            filename: 'favicon.jpg',
            path: `${generalPath}favicon.jpg`,
            cid: 'favicon',
          },
          {
            filename: `${ticket.fullName.replace(/\s/g, '')}barcode.png`,
            path: fileName,
            cid: 'barcode',
          },
        ],
        data: { ...ticketInfo.emailData },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async sendGuestBadgeEmail(guest) {
    try {
      const seatGrade = await eventPaymentService.findById(guest.type);
      const {
        Event, ...type
      } = seatGrade.dataValues;
      const segs = [
        { data: guest.nationalId, mode: 'alphanumeric' },
      ];
      const qr = await QRCode.toDataURL(segs);
      const data = qr.replace(/^data:image\/\w+;base64,/, '');
      const generalPath = `${path.resolve()}/src/public/images/`;
      const fileName = `${generalPath + guest.fullName.replace(/\s/g, '')}barcode.png`;
      await saveFileToDisk(data, fileName);

      const ticketInfo = {
        email: guest.email,
        emailData: {
          eventName: Event.dataValues.title,
          price: type.price,
          bgTicket: type.bgTicket,
          date: moment(Event.dataValues.dateAndTimme).format('LL'),
          time: moment(Event.dataValues.dateAndTimme).format('LT'),
          place: Event.dataValues.place,
          fullName: guest.fullName,
          type: type.name,
          institution: seatGrade.organization,
          nationalId: guest.nationalId.replace(/.(?=.{4})/g, 'x'),
          fileName: qr,
        },
      };
      const pdfTicketPathFile = `${generalPath + guest.fullName}guest.pdf`;
      const pdf = await htmlToPdf(sentGuestTicket(ticketInfo.emailData), pdfTicketPathFile);
      const byteArrayBuffer = Buffer.from(pdf, 'base64');
      const saveimg = await new Promise((resolve) => {
        cloudinary.uploader.upload_stream({ format: 'png' }, (error, uploadResult) => resolve(uploadResult)).end(byteArrayBuffer);
      });
      // foundTicket.ticketImg = saveimg.secure_url;
      // await foundTicket.save();
      const attach = { fileName: `${guest.fullName}-guest.png`, path: saveimg.secure_url, cid: 'ticket' };
      sendNotification({
        to: ticketInfo.email,
        subject: 'Badge Email from eventicore',
        template: 'index',
        attachments: [
          attach, {
            filename: 'favicon.jpg',
            path: `${generalPath}favicon.jpg`,
            cid: 'favicon',
          },
          {
            filename: `${guest.fullName.replace(/\s/g, '')}barcode.png`,
            path: fileName,
            cid: 'barcode',
          },
        ],
        data: { ...ticketInfo.emailData },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
