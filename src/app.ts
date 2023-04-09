import { PrismaClient } from '@prisma/client';
import express, { json } from 'express';
import helmet from 'helmet';
import { attachControllers } from '@decorators/express';
import AuthenticationController from './controllers/authentication/controller/authentication.controller';
import passport from 'passport';
import { config } from '@/config';
import session from 'express-session';
import PrismaService from './services/prisma.service';
import UserController from './controllers/user/controller/user.controller';
import IAController from './controllers/IA/controller/ia.controller';

const prismaClient = new PrismaClient();

export const prismaService = new PrismaService(prismaClient)

const app = express();

app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
}));

app.use(json());
app.use(helmet());
app.use(passport.session());
app.use(passport.session());

//@ts-ignore
app.get('/', async (req, res) => {
  res.send('OK')
})

attachControllers(app, [AuthenticationController, UserController, IAController]);

export { app };