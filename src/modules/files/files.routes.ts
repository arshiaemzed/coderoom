import express, { Router } from "express";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import fileController from "./file.controller.js";
import uploadFileMiddleware from "./middlewares/uploadfile.middleware.js";
import getSpecificFileMiddleware from "./middlewares/get.specific.file.middleware.js";

const filesRouter: Router = express.Router();

filesRouter.post(
  "/rooms/:id/upload",
  authMiddleware,
  uploadFileMiddleware,
  fileController.uploadFile,
);

filesRouter.get(
  "/rooms/:roomid/files/:fileid",
  authMiddleware,
  getSpecificFileMiddleware,
  fileController.getSpecificFile,
);

export default filesRouter;
