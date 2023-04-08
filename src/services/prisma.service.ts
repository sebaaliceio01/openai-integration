import { PrismaClient } from "@prisma/client"

class PrismaService {

  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public get user(): PrismaClient['user'] {
    return this.prisma.user
  }

  public get subscriptionPlan(): PrismaClient['subscriptionPlan'] {
    return this.prisma.subscriptionPlan
  }

}

export default PrismaService