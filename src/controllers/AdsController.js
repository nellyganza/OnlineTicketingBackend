import Util from '../helpers/utils';
import adsService from '../services/adsService';
import { ADUIConstant } from '../UIConstants/AdsPosition';

const util = new Util();
export default class AdsController {
  static async saveAds(req, res) {
    try {
      const {
        AdsPositionId, priority, link, startDate, endDate,
      } = req.body;
      const savedAds = await adsService.createAds({
        AdsPositionId, priority, link, image: req.files && req.files[0] ? req.files[0].filename : '', startDate, endDate,
      });
      if (!savedAds) {
        util.setError(400, 'Failed to create an Ads');
        util.send(res);
        return;
      }
      util.setSuccess(200, 'Ads saved Success', savedAds);
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }

  static async deleteAds(req, res) {
    try {
      const { id } = req.params;
      await adsService.deleteAds(id);
      util.setSuccess(200, 'Ads deleted Success');
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }

  static async updateAds(req, res) {
    try {
      const { id } = req.params;
      const { AdsPositionId, priority, link } = req.body;
      const adToUpdate = await adsService.findById(id);
      if (!adToUpdate) {
        util.setError(400, 'Ad to update not found');
        return util.send(res);
      }
      const updatedAds = await adsService.updateAtt({
        AdsPositionId, priority, link, image: req.files && req.files[0] ? req.files[0].filename : adToUpdate.image,
      }, { id });
      util.setSuccess(200, 'Ads updated successfully', updatedAds);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Ads not Updated');
      return util.send(res);
    }
  }

  static async getAllAds(req, res) {
    try {
      const { page, size } = req.query;
      const ads = await adsService.getAds(page, size);
      if (!ads) {
        util.setError(400, 'Ads not Found');
        util.send(res);
        return;
      }
      util.setSuccess(200, 'Ads Found Success', ads);
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }

  static async saveAdsPosition(req, res) {
    try {
      const savedAdsPositon = await adsService.createPosition(req.body);
      if (!savedAdsPositon) {
        util.setError(400, ADUIConstant.POSITION_NOT_SAVED);
        return util.send(res);
      }
      util.setSuccess(200, ADUIConstant.POSITION_SAVED, savedAdsPositon);
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }

  static async updateAdsPosition(req, res) {
    try {
      const { id } = req.params;
      const savedAdsPositon = await adsService.updateAtPosition({ ...req.body }, { id });
      if (!savedAdsPositon) {
        util.setError(400, ADUIConstant.POSITION_NOT_SAVED);
        return util.send(res);
      }
      util.setSuccess(200, ADUIConstant.POSITION_SAVED, savedAdsPositon);
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }

  static async getAllAdsPosition(req, res) {
    try {
      const { page, size } = req.query;
      const AdsPositions = await adsService.getAllPosition(page, size);
      if (!AdsPositions) {
        util.setError(400, ADUIConstant.POSITION_FOUND);
        return util.send(res);
      }
      util.setSuccess(200, ADUIConstant.POSITION_FOUND, AdsPositions);
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }
}
