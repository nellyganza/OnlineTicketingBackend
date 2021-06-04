import Util from '../helpers/utils';
import permissionService from '../services/permissionService';

const util = new Util();
export default class Permission {
  static async allPermission(req, res) {
    try {
      const permissions = await permissionService.getPermissions();
      if (!permissions) {
        util.setError(404, 'Permissions Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'all permissions', permissions);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Unable to retrieve all permissions');
      return util.send(res);
    }
  }

  static async savePermission(req, res) {
    try {
      const { name } = req.body;
      const createdPermission = await permissionService.createPermission({ name });
      if (!createdPermission) {
        util.setError(400, 'Permisssion not created');
        return util.send(res);
      }
      util.setSuccess(200, 'Permission created', createdPermission);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'permission not created');
      return util.send(res);
    }
  }

  static async findPermission(req, res) {
    try {
      const { id } = req.params;
      const singlePermission = await permissionService.findById(id);
      if (!singlePermission) {
        util.setError(404, 'Permission Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Successfully retrieved permission', singlePermission);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Permission was not retrived');
      return util.send(res);
    }
  }

  static async findPermissionByName(req, res) {
    try {
      const { name } = req.params;
      const singlePermission = await permissionService.findByName({ name });
      if (!singlePermission) {
        util.setError(404, 'Permission Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Successfully retrieved permission', singlePermission);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'sorry permission was not retrieved');
      return util.send(res);
    }
  }

  static async updatePermission(req, res) {
    try {
      const { name } = req.body;
      const { id } = req.params;
      const updatedPermission = await permissionService.updateAtt({ name }, { id });
      util.setSuccess(200, 'Permission updated successfuly', updatedPermission);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Permission not deleted');
      return util.send(res);
    }
  }

  static async deletePermission(req, res) {
    try {
      const { id } = req.params;
      await permissionService.deletePermission(id);
      util.setSuccess(200, 'Permission deleted successfully');
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Permission was not deleted');
      return util.send(res);
    }
  }
}
