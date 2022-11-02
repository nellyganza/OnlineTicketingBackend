import Util from '../helpers/utils';
import commentService from '../services/commentService';

const util = new Util();
export default class Comment {
  static async allcomment(req, res) {
    try {
      const comments = await commentService.getComments();
      util.setSuccess(200, 'all comments', comments);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Unable to retrieve all comments');
      return util.send(res);
    }
  }

  static async savecomment(req, res) {
    try {
      const { userName, comment, eventId } = req.body;
      const createdcomment = await commentService.createComment({ userName, comment, eventId });
      util.setSuccess(200, 'comment created', createdcomment);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async findcomment(req, res) {
    try {
      const { id } = req.params;
      const singlecomment = await commentService.findById(id);
      if (!singlecomment) {
        util.setError(404, 'comment Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Successfully retrieved comment', singlecomment);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry comment was not retrived');
      return util.send(res);
    }
  }

  static async findcommentByuserName(req, res) {
    try {
      const { userName } = req.params;

      const singlecomment = await commentService.findByName({ userName });
      util.setSuccess(200, 'Successfully retrieved comment', singlecomment);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'sorry comment was not retrieved');
      return util.send(res);
    }
  }

  static async findcommentByEventId(req, res) {
    try {
      const { eventId } = req.params;

      const singlecomment = await commentService.findByName({ eventId });
      util.setSuccess(200, 'Successfully retrieved comment', singlecomment);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'sorry comment was not retrieved');
      return util.send(res);
    }
  }

  static async updatecomment(req, res) {
    try {
      const { userName, message, eventId } = req.body;
      const { id } = req.params;

      const updatedcomment = await commentService.updateAtt({ userName, message, eventId }, { id });
      util.setSuccess(200, 'comment updated successfuly', updatedcomment);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry comment not deleted');
      return util.send(res);
    }
  }

  static async deletecomment(req, res) {
    try {
      const { id } = req.params;
      await commentService.deleteComment(id);
      util.setSuccess(200, 'comment deleted successfully');
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry comment was not deleted');
      return util.send(res);
    }
  }
}
