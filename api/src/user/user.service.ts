import { config } from 'dotenv';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

import { SignupDTO } from 'src/dto/signup';
import { UserEntity } from './user.entity';
import { IResponse } from 'src/interfaces/response';

config();

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // get token
  private token(id: string, email: string): string {
    return jwt.sign({ id, email}, process.env.SECRET, { expiresIn: '7d' });
  }

  // format response to standard in specfications
  private responseFormat(
    summary: string,
    user?: UserEntity,
    status: number = HttpStatus.OK,
    showToken: boolean = false,
  ): IResponse {
    const { id, created, email } = user;
    const token = this.token(id, email);
    let data = { id, created, email };
    if (showToken) {
      data = { ...data , ...{ token } };
    }
    return {
      summary,
      success: true,
      status,
      data,
    };
  }

  async signup(data: SignupDTO) {
    const email = data.email;
    let user = await this.userRepository.findOne({ where: { email }});
    if (user) {
      throw new HttpException(`Email already in use.`, HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return this.responseFormat('Signup successful', user, HttpStatus.CREATED, true);
  }
}
