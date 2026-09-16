import { type Request, type Response, type NextFunction } from "express";
import AppError from "../errors/error.js";

function cookieMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionToken = req.cookies.session;

  if (!sessionToken) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  console.log(sessionToken);

  next();
}

export default cookieMiddleware;
