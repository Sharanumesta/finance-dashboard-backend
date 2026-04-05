import authService from "../services/auth.service.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    sendSuccess(res, result, "User registered", 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result, "Login successful", 200);
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    sendSuccess(res, user, "",200);
  } catch (err) {
    next(err);
  }
};

export { register, login, getProfile };
