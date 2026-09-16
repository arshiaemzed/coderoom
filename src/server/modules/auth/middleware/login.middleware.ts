import { type Request, type Response, type NextFunction } from "express";

function loginMiddleware(req: Request, res: Response, next: NextFunction) {
  next();
}

export default loginMiddleware;
