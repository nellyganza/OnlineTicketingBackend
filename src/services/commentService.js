import models from '../models';

const { Comment } = models;
/**
 * @exports
 * @class CommentService
 */
class CommentService {
  /**
   * create new user
   * @static createComment
   * @param {object} newComment
   * @memberof CommentService
   * @returns {object} data
   */
  static createComment(newComment) {
    return Comment.create(newComment);
  }

  static updateAtt(set, prop) {
    return Comment.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getComments() {
    return Comment.findAll();
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return Comment.findOne({
      where: prop,
    });
  }

  static findById(modelId) {
    return Comment.findOne({
      where: { id: modelId },
    });
  }

  static deleteComment(modelId) {
    return Comment.destroy({
      where: { id: modelId },
    });
  }
}
export default CommentService;
