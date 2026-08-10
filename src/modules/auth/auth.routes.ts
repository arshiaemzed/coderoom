import express, { type Router } from "express";
import authController from "./auth.controller.js";
import signUpMiddleware from "./middleware/signup.middleware.js";
import loginMiddleware from "./middleware/login.middleware.js";

const authRoute: Router = express.Router();

authRoute.post("/auth/signup", signUpMiddleware, authController.signUp);

authRoute.post("/auth/login", loginMiddleware, authController.login);

export default authRoute;
