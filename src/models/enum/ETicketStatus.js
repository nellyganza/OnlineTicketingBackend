import { Enum } from '../../helpers/Enum';

export const ETicketStatus = Enum({
  ATTENDED: 'Attended',
  NOT_ATTENDED: 'Not Attended',
});

export const ETicketCurrentStatus = Enum({
  IN_EVENT: 'IN',
  OUT_EVENT: 'OUT',
});
