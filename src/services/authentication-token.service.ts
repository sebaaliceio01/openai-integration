import { config } from '@/config';
import * as jwt from 'jsonwebtoken';

class AuthenticationToken {

  private jwtKey = config.jwtSecretKey as string

  public generateToken(data: any): string {
    const token = jwt.sign(data, this.jwtKey, {
      expiresIn: '1d'
    })

    return token
  }

  public decryptToken(token: string): any {
    const data = jwt.verify(token, this.jwtKey as string)

    return data
  }

  public validateToken(token: string): boolean {
    try {
      jwt.verify(token, this.jwtKey as string)
      return true
    } catch (error) {
      return false
    }
  }
}

export default AuthenticationToken