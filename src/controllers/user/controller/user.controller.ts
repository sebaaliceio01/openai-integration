import { prismaService } from "@/app";
import AuthGuard from "@/middlewares/checkAuthentication.middeware";
import { Controller, Delete, Get, Params, Post, Query, Request, Response } from "@decorators/express";
import { Prisma } from "@prisma/client";

@Controller('/user')
class UserController {

  @Post('/', [AuthGuard()])
  async createUser(@Request() req: any, @Response() res: any): Promise<void> {
    const { email, password, role, name } = req.body

    if (!email || !password || !role || !name) {
      res.status(400).json({ message: 'Missing email, password, role or plan' })
      return
    }

    let user: Prisma.UserCreateInput = {
      email: email,
      password: password,
      role: role,
      name: name,
    }

    try {
      const newUser = await prismaService.user.create({
        data: user
      })

      res.status(201).json({ message: 'User created', user: newUser })
    }
    catch (error) {
      res.status(400).json({ message: 'User already exists' })
    }
  }

  @Get('/', [AuthGuard()])
  async getUsers(@Response() res: any, @Query() queryParameters: any): Promise<void> {
    try {
      const totalCount = await prismaService.user.count()

      const users = await prismaService.user.findMany({
        take: +queryParameters.pageSize || 10,
        skip: (+queryParameters.page * +queryParameters.pageSize) || 0,
      })

      res.status(200).json({ data: users, totalCount: totalCount })
    }
    catch (error: Error | any) {
      res.status(400).json({ message: 'Users not found', error: error.message })
    }
  }

  @Delete('/:userId', [AuthGuard()])
  async deleteUser(@Request() req: any, @Response() res: any, @Params() params: any): Promise<void> {
    if (!params.userId) {
      res.status(400).json({ message: 'Missing id' })
      return
    }

    try {
      const deletedUser = await prismaService.user.delete({
        where: {
          id: params.userId
        }
      })

      res.status(200).json({ message: 'User deleted', data: deletedUser })
    }
    catch (error: Error | any) {
      res.status(400).json({ message: 'User not found', error: error.message })
    }
  }
}


export default UserController