import { config } from 'dotenv';
import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { UserEntity } from './user.entity';
import { IResponse } from 'src/interfaces/response.interface';
import { LoginDTO } from 'src/dto/login.dto';
import { SignupDTO } from 'src/dto/signup.dto';
import { InvalidatedTokenEntity } from './token.entity';

config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(InvalidatedTokenEntity)
    private tokenRepository: Repository<InvalidatedTokenEntity>,
  ) {}

  // get token
  private token(id: string, email: string): string {
    return jwt.sign({ id, email }, process.env.SECRET, { expiresIn: '7d' });
  }

  // confirm password
  private async checkPassword(attempt: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(attempt, hash);
  }

  // format response to standard in specfications
  private responseFormat(
    summary: string,
    user?: UserEntity,
    status: number = HttpStatus.OK,
    showToken: boolean = false,
  ): IResponse {
    if (user) {
      const { id, created, email } = user;
      const token = this.token(id, email);
      let data = { id, created, email };
      if (showToken) {
        data = { ...data, ...{ token } };
      }
      return {
        summary,
        success: true,
        status,
        data,
      };
    }
    return {
      summary,
      success: true,
      status: HttpStatus.OK,
    };
  }

  async signup(data: SignupDTO): Promise<IResponse> {
    const email = data.email;
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException(`Email already in use.`, HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return this.responseFormat(
      'Signup successful',
      user,
      HttpStatus.CREATED,
      true,
    );
  }

  async login(data: LoginDTO): Promise<IResponse> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('Email does not exist', HttpStatus.BAD_REQUEST);
    }
    const passwordMatch = await this.checkPassword(password, user.password);
    if (!passwordMatch) {
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    }
    return this.responseFormat('Login successful', user, HttpStatus.OK, true);
  }

  async logout(request: Request) {
    const bearerToken: any = request.headers.authorization.split(' ')[1];

    const token = await this.tokenRepository.findOne({
      where: { token: bearerToken },
    });
    if (token) {
      throw new HttpException(
        'User already logged out',
        HttpStatus.BAD_REQUEST,
      );
    }

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(InvalidatedTokenEntity)
      .values({ token: bearerToken })
      .execute();
    return this.responseFormat('Logout successful');
  }
}
