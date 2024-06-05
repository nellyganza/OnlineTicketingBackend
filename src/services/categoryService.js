import models from '../models';
import MainService from './MainService';

const { Category } = models;

class CategoryService extends MainService {
  static createCategory(category) {
    return Category.create(category);
  }

  static updateAtt(set, prop) {
    return Category.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getCategories(page, size, prop) {
    const { limit, offset } = this.getPagination(page, size);
    const condition = prop || null;
    return Category.findAndCountAll({
      where: condition, limit, offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static getCategoriesWithNoPagination(prop) {
    const condition = prop || null;
    return Category.findAll({
      where: condition,
    }).then((data) => data)
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static findById(modelId) {
    return Category.findOne({
      where: { id: modelId },
    });
  }

  static deleteCategory(modelId) {
    return Category.destroy({
      where: { id: modelId },
    });
  }
}
export default CategoryService;
