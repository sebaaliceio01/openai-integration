import AuthenticationToken from "@/services/authentication-token.service";
import { NextFunction, Request, Response } from "express";

function AuthGuard(): NextFunction | Response | any | undefined {
  //@ts-ignore
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization

      if (!token) {
        return res.status(401).json({ message: 'Missing authentication token' });
      }

      const payload = new AuthenticationToken().decryptToken(token);

      req.user = payload;

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid authorization token' });
    }
  };
}

export default AuthGuard