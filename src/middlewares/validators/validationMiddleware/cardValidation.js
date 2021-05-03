import { CardValidationSchemas } from '../../../helpers/validationSchemas';
import cardService from '../../../services/cardService';
import Util from '../../../helpers/utils';
const util = new Util();
const {newCardShemas} = CardValidationSchemas;
export const validateCard = async(req, res, next)=>{
    try {
        const {error,} = newCardShemas.validate(req.body);
        if(error){
            util.setError(400, error.message.replace('/', '').replace(/"/g, '').replace('WHERE parameter', ''));
            return util.send(res);
        }
        const Card = await cardService.findByName({ cardNumber: req.body.cardNumber });
        if (Card[0]) {
          util.setError(400, `Card Already Registered to ${Card[0].fullName}`);
          return util.send(res);
        }
        const CardPhone = await cardService.findByName({ phoneNumber: req.body.phoneNumber });
        if (CardPhone[0]) {
          util.setError(400, `This phone Number already assigned to another card , Please use other phone Number`);
          return util.send(res);
        }
        next();
      } catch (error) {
        util.setError(500, error.message);
        return util.send(res);
      }
}