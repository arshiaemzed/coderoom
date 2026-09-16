import express, { type Router } from "express";
import authController from "./auth.controller.js";
import signUpMiddleware from "./middleware/signup.middleware.js";
import loginMiddleware from "./middleware/login.middleware.js";
import cookieMiddleware from "../../shared/middleware/cookie.middleware.js";

const authRoute: Router = express.Router();

authRoute.post("/auth/signup", signUpMiddleware, authController.signUp);

authRoute.post("/auth/login", loginMiddleware, authController.login);

authRoute.get("/auth/me", cookieMiddleware, authController.authMe);

export default authRoute;
