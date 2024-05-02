import Util from '../helpers/utils';
import businessInfoService from '../services/businessInfoService';

const util = new Util();
export default class BusinessInfoController {
  static async allBusinessInfo(req, res) {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);

      const BusinessInfos = await businessInfoService.getBusinessInfos(page, limit);
      util.setSuccess(200, 'all BusinessInfos', BusinessInfos);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Unable to retrieve all BusinessInfos');
      return util.send(res);
    }
  }

  static async saveBusinessInfo(req, res) {
    try {
      console.log(req.body);
      const createdBusinessInfo = await businessInfoService.createBusinessInfo({ ...req.body, userId: req.userInfo.id });
      util.setSuccess(200, 'BusinessInfo created', createdBusinessInfo);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async findBusinessInfo(req, res) {
    try {
      const { id } = req.params;
      const singleBusinessInfo = await businessInfoService.findById(id);
      if (!singleBusinessInfo) {
        util.setError(404, 'BusinessInfo Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'BusinessInfo Found', singleBusinessInfo);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async updateBusinessInfo(req, res) {
    try {
      const { id } = req.params;
      const updatedBusinessInfo = await businessInfoService.updateAtt({ ...req.body }, { id });
      util.setSuccess(200, 'BusinessInfo updated successfully', updatedBusinessInfo);
      return util.send(res);
    } catch (error) {
      console.log(error.message);
      util.setError(500, 'Sorry BusinessInfo not updated');
      return util.send(res);
    }
  }

  static async deleteBusinessInfo(req, res) {
    try {
      const { id } = req.params;
      await businessInfoService.deleteBusinessInfo(id);
      util.setSuccess(200, 'BusinessInfo deleted successfully');
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry BusinessInfo was not deleted');
      return util.send(res);
    }
  }

  static async findBusinessInfoByUser(req, res) {
    try {
      const businessInfo = await businessInfoService.findByUserId(req.userInfo.id);
      console.log(businessInfo, req.userInfo.id);
      if (businessInfo) {
        util.setSuccess(200, 'BusinessInfo Found', businessInfo);
      } else {
        util.setError(404, 'BusinessInfo Not Found');
      }
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
