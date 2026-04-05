import express from "express";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", userController.listUsers);
router.get("/:id", userController.getUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/change-password", userController.changePassword);

export default router;