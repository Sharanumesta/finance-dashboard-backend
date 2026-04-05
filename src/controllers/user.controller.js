import userService from "../services/user.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

const listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, role } = req.query;
    const result = await userService.listUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      role,
    });
    sendSuccess(res, result.users, "Users retrieved", 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
};
    
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    sendSuccess(res, user, "User updated");
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    // Prevent self-deactivation
    if (req.params.id === req.user.id) {
      return sendError(res, "Cannot deactivate your own account", 400);
    }
    await userService.deleteUser(req.params.id);
    sendSuccess(res, null, "User deactivated");
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const result = await userService.changePassword(req.user.id, req.body);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export { listUsers, getUserById, updateUser, deleteUser, changePassword };
