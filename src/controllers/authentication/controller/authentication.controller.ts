// import PrismaService from "@/services/prisma.service";
import { Controller, Get, Post, Request, Response } from "@decorators/express";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '@/config';
import AuthenticationToken from "@/services/authentication-token.service";
import AuthGuard from "@/middlewares/checkAuthentication.middeware";
import { prismaService } from "@/app";

@Controller("/auth")
class AuthenticationController {

  private accessToken: string | undefined
  private refreshToken: string | undefined

  private token: string | undefined

  private profile: any

  constructor(
    private tokenService: AuthenticationToken
  ) {
    passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
    }, async (accessToken, refreshToken, profile, done) => {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.profile = profile

      let user: any

      try {
        const getUser = await prismaService.user.findUnique({
          select: {
            id: true,
            email: true,
            password: true,
            plan: true,
            role: true,
          },
          where: {
            email: this.profile.emails[0].value
          }
        })

        user = getUser
      } catch (error: Error | any) {
        return
      }

      if (!user) {
        let newUser: any = {
          email: this.profile.emails[0].value,
          role: 'user',
          name: this.profile.displayName,
        }

        try {
          const response = await prismaService.user.create({
            data: newUser
          })

          user = response
        } catch (error: Error | any) {
          console.log(error.message)
          return
        }
      }

      this.token = this.tokenService.generateToken({ id: user.id, role: user.role, email: user.email, plan: user.plan })

      return done(null, profile);
    }));

    this.tokenService = new AuthenticationToken()
  }


  @Post("/login")
  async login(@Response() res: any, @Request() req: any): Promise<void> {

    const { email, password } = req.body

    let user: any

    if (!email || !password) {
      res.status(400).json({ message: 'Missing email or password' })
      return
    }

    try {
      const getUser = await prismaService.user.findUnique({
        select: {
          id: true,
          email: true,
          password: true,
          plan: true,
          role: true,
        },
        where: {
          email: email
        }
      })

      user = getUser
    } catch (error: Error | any) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
      return
    }

    if (!user) {
      res.status(400).json({ message: 'User not found' })
      return
    }

    if (user.password !== password) {
      res.status(400).json({ message: 'Invalid password' })
    }

    try {
      const token = this.tokenService.generateToken({ id: user.id, role: user.role, email: user.email, plan: user.plan })

      res.status(200).json({ message: 'Logged in', token: token })
    } catch (error: Error | any) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
      return
    }
  }

  @Get('/current-user', [AuthGuard()])
  async getCurrentUser(@Response() res: any, @Request() req: any): Promise<void> {

    const tokenData = this.tokenService.decryptToken(req.headers.authorization as string)

    const user = await prismaService.user.findUnique({
      select: {
        id: true,
        email: true,
        password: true,
        plan: true,
        role: true,
      },
      where: {
        id: tokenData.id
      }
    })

    if (!user) {
      res.status(400).json({ message: 'User not found' })
      return
    }

    res.status(200).json({ data: user })
  }

  @Get('/google/login', [passport.authenticate('google', { scope: ['profile', 'email'] })])
  authenticateWithGoogle(): void { }

  @Get('/google/callback')
  async authenticateWithGoogleCallback(@Response() res: any, @Request() req: any): Promise<void> {
    await passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, async () => {
      res.send(`<a>https://www.movilcorsrl.com?token=${this.token}</a>`)
    });
  }

  @Get('/logout')
  public logout(@Response() res: any, @Request() req: any) {
    req.logout(((err: any) => {
      console.log(err)
    }));

    res.redirect('/');
  }
}

export default AuthenticationController