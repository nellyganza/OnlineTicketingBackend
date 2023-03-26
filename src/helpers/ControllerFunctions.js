import EventPaymentService from '../services/eventPaymentService';
import EventSittingPlaceService from '../services/eventSittingPlaceService';
import EventService from '../services/eventService';

export const updateEvent = async (eventid, transaction) => {
  await EventService.incrementNumberOfBought(eventid, transaction);
  await EventService.decrementTicketLeft(eventid, transaction);
};

export const updateSittingPlace = async (eventId, type, transaction) => {
  const gradeType = await EventPaymentService.findOneById(type);
  const sitting = await EventSittingPlaceService.findOneByName({ eventId, name: gradeType.name });
  await EventSittingPlaceService.incrementNumberOfPeople(sitting.id, transaction);
  await EventSittingPlaceService.decrementPlaceLeft(sitting.id, transaction);
};
export const getAndUpdateSittingPlace = async (eventId, type, action) => {
  if (action === 'getPlaces') {
    const places = [];
    let placetobegiven = 1;
    const gradeType = await EventPaymentService.findById(type);
    const sitting = await EventSittingPlaceService.findByName({ eventId, name: gradeType.name });
    for (let i = 0; i < sitting.placeAvailable.length; i++) {
      if (sitting.placeAvailable[i][0] === undefined) {
        continue;
      }
      const start = sitting.placeAvailable[i][0].value;
      const end = sitting.placeAvailable[i][1].value;
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
    return places;
  }
  if (action === 'updatePlaces') {
    let placetobegiven = 1;
    const gradeType = await EventPaymentService.findById(type);
    const sitting = await EventSittingPlaceService.findOneByName({ eventId, name: gradeType.name });
    const place = sitting.placeAvailable;
    let sittingPlace = 0;
    for (let i = 0; i < sitting.placeAvailable.length; i++) {
      if (sitting.placeAvailable[i][0] === undefined) {
        continue;
      }
      const start = sitting.placeAvailable[i][0].value;
      const end = sitting.placeAvailable[i][1].value;
      const remains = end - start;
      if (remains <= 0) {
        continue;
      }
      if (placetobegiven <= remains) {
        place[i][0].value += placetobegiven;
        sittingPlace = place[i][0].value;
        break;
      }
      if (placetobegiven > remains) {
        placetobegiven -= remains;
        place[i][0].value += remains;
        sittingPlace = place[i][0].value;
      }
    }
    return { sittingPlace: sittingPlace - 1, place, sitting };
  }
};

export const updatePaymentGrade = async (id, transaction) => {
  await EventPaymentService.incrementPaymentGrade(id, transaction);
};
