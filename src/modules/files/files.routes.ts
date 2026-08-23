import express, { Router } from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import fileController from "./file.controller.js";
import uploadFileMiddleware from "./middlewares/uploadfile.middleware.js";

const filesRouter: Router = express.Router();

filesRouter.post(
  "/rooms/:id/upload",
  authMiddleware,
  uploadFileMiddleware,
  fileController.uploadFile,
);

export default filesRouter;
