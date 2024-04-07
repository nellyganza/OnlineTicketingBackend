import Util from '../helpers/utils';
import representativeService from '../services/representativeService';

const util = new Util();
export default class RepresentativeController {
  static async allRepresentative(req, res) {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);

      const Representatives = await representativeService.getRepresentatives(page, limit);
      util.setSuccess(200, 'all Representatives', Representatives);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Unable to retrieve all Representatives');
      return util.send(res);
    }
  }

  static async saveRepresentative(req, res) {
    try {
      const createdRepresentative = await representativeService.createRepresentative({ ...req.body });
      util.setSuccess(200, 'Representative created', createdRepresentative);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async findRepresentative(req, res) {
    try {
      const { id } = req.params;
      const singleRepresentative = await representativeService.findById(id);
      if (!singleRepresentative) {
        util.setError(404, 'Representative Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Representative Found', singleRepresentative);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async updateRepresentative(req, res) {
    try {
      const { id } = req.params;
      const updatedRepresentative = await representativeService.updateAtt({ ...req.body }, id);
      util.setSuccess(200, 'Representative updated successfuly', updatedRepresentative);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Representative not updated');
      return util.send(res);
    }
  }

  static async deleteRepresentative(req, res) {
    try {
      const { id } = req.params;
      await representativeService.deleteRepresentative(id);
      util.setSuccess(200, 'Representative deleted successfully');
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Representative was not deleted');
      return util.send(res);
    }
  }
}
