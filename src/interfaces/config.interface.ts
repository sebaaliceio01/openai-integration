export interface IConfig {
  google: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  };
  session: {
    secret: string;
  };
  jwtSecretKey: string;
}