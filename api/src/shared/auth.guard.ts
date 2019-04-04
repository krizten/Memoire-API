import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { getConnection } from 'typeorm';
import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { LogoutTokenEntity } from 'src/user/logout-token.entity';

config();

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: any): Promise<boolean> {
    const bearerToken = request.headers.authorization;
    if (!bearerToken) {
      return false;
    }
    request.user = await this.validateToken(bearerToken);
    return true;
  }

  async validateToken(bearerToken: string) {
    if (bearerToken.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid Token ', HttpStatus.FORBIDDEN);
    }
    const token = bearerToken.split(' ')[1];

    // check if token has not been invalidated on logout
    const loggedOutToken = await getConnection()
      .createQueryBuilder()
      .select('token')
      .from(LogoutTokenEntity, 'token')
      .where('token.token = :token', { token })
      .getOne();

    if (loggedOutToken) {
      throw new HttpException(
        'Invalid Token: token has been invalidated on logout.',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const decodedToken = await jwt.verify(token, process.env.SECRET);
      return decodedToken;
    } catch (error) {
      const message = `Token error: ${error.message || error.name}`;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
