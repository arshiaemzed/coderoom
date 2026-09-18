import express, { Router } from "express";
import fileController from "./file.controller.js";
import uploadFileMiddleware from "./middlewares/uploadfile.middleware.js";
import getSpecificFileMiddleware from "./middlewares/get.specific.file.middleware.js";
import cookieMiddleware from "../../shared/middleware/cookie.middleware.js";

const filesRouter: Router = express.Router();

filesRouter.post(
  "/rooms/:id/upload",
  cookieMiddleware,
  uploadFileMiddleware,
  fileController.uploadFile,
);

filesRouter.get(
  "/rooms/:roomid/files/:fileid",
  cookieMiddleware,
  getSpecificFileMiddleware,
  fileController.getSpecificFile,
);

filesRouter.get(
  "/rooms/:roomid/files",
  cookieMiddleware,
  fileController.getRoomFiles,
);

export default filesRouter;
