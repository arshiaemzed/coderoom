import type { Request, Response, NextFunction } from "express";

function acceptInviteMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  next();
}

export default acceptInviteMiddleware;
