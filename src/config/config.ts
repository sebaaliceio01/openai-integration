import { IConfig } from "@/interfaces/config.interface";

export const config: IConfig = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.CALLBACK_URL as string,
  },
  session: {
    secret: process.env.SESSION_SECRET as string,
  },
  jwtSecretKey: process.env.JWT_SECRET as string,
};