import PaymentMethodService from '../services/paymentMethodService';
import EventPaymentService from '../services/eventPaymentService';
import EventSittingPlaceService from '../services/eventSittingPlaceService';
import EventService from '../services/eventService';

export const updateEvent = async (eventid) => {
  await EventService.incrementNumberOfBought(eventid);
  await EventService.decrementTicketLeft(eventid);
};

export const updateSittingPlace = async (eventId, type) => {
  const gradeType = await EventPaymentService.findOneById(type);
  const sitting = await EventSittingPlaceService.findOneByName({ eventId, name: gradeType.name });
  await EventSittingPlaceService.incrementNumberOfPeople(sitting.id);
  await EventSittingPlaceService.decrementPlaceLeft(sitting.id);
};

export const getAndUpdateSittingPlace = async (eventId, type, action) => {
  if (action === 'getPlaces') {
    const places = [];
    let placetobegiven = 1;
    const gradeType = await EventPaymentService.findById(type);
    const data = { ...gradeType['0'] };
    const Sitting = await EventSittingPlaceService.findByName({ eventId, name: data.dataValues.name });
    const sitting = { ...Sitting['0'] };
    for (let i = 0; i < sitting.dataValues.placeAvailable.length; i++) {
      if (sitting.dataValues.placeAvailable[i][0] === undefined) {
        continue;
      }
      const start = sitting.dataValues.placeAvailable[i][0].value;
      const end = sitting.dataValues.placeAvailable[i][1].value;
      const remains = end - start;
      if (remains <= 0) {
        continue;
      }
      if (placetobegiven <= remains) {
        for (let j = 0; j < placetobegiven; j++) {
          places.push(start + j);
        }
        return places;
      }
      if (placetobegiven > remains) {
        placetobegiven -= remains;
        for (let j = 0; j < remains; j++) {
          places.push(start + j);
        }
      }
    }
  }
  if (action === 'updatePlaces') {
    let placetobegiven = 1;
    const gradeType = await EventPaymentService.findById(type);
    const data = { ...gradeType['0'] };
    const Sitting = await EventSittingPlaceService.findByName({ eventId, name: data.dataValues.name });
    const sitting = { ...Sitting['0'] };
    const place = sitting.dataValues.placeAvailable;
    for (let i = 0; i < sitting.dataValues.placeAvailable.length; i++) {
      if (sitting.dataValues.placeAvailable[i][0] === undefined) {
        continue;
      }
      const start = sitting.dataValues.placeAvailable[i][0].value;
      const end = sitting.dataValues.placeAvailable[i][1].value;
      const remains = end - start;
      if (remains <= 0) {
        continue;
      }
      if (placetobegiven <= remains) {
        place[i][0].value += placetobegiven;
        break;
      }
      if (placetobegiven > remains) {
        placetobegiven -= remains;
        place[i][0].value += remains;
      }
    }
    await EventSittingPlaceService.updateAtt({ placeAvailable: place }, { id: sitting.dataValues.id });
  }
};

export const updatePaymentGrade = async (id) => {
  await EventPaymentService.incrementPaymentGrade(id);
};
