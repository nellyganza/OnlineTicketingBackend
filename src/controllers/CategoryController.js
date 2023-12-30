import Util from '../helpers/utils';
import CategoryService from '../services/categoryService';

const util = new Util();
export default class CategoryController {
  static async saveCategory(req, res) {
    try {
      const savedCategory = await CategoryService.createCategory({ ...req.body });
      if (!savedCategory) {
        util.setError(400, 'Failed to create Category');
        util.send(res);
        return;
      }
      util.setSuccess(200, 'Category saved Success', savedCategory);
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }

  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      await CategoryService.deleteCategory(id);
      util.setSuccess(200, 'Category deleted Success');
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }

  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const updatedCategory = await CategoryService.updateAtt({ ...req.body }, { id });
      util.setSuccess(200, 'Category updated successfully', updatedCategory);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Category not Updated');
      return util.send(res);
    }
  }

  static async getAllCategory(req, res) {
    try {
      const { page, size, parent } = req.query;
      const Category = parent === 'all' ? await CategoryService.getCategories(page, size) : await CategoryService.getCategories(page, size, { parent: parent === 'undefined' || !parent ? null : parent });
      util.setSuccess(200, 'Category Found Success', Category);
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }
}
