import { config } from 'dotenv';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as sendGrid from '@sendgrid/mail';
import { MailData } from '@sendgrid/helpers/classes/mail';

import { UserEntity } from './user.entity';
import { IResponse } from 'src/interfaces/response.interface';
import { LoginDTO } from 'src/dto/login.dto';
import { SignupDTO } from 'src/dto/signup.dto';
import { InvalidatedTokenEntity } from './token.entity';
import { ChangePasswordDTO } from 'src/dto/change-password.dto';
import { ForgotPasswordDTO } from 'src/dto/forgot-password.dto';
import { resetPasswordTemplate } from './reset-pwd-template';

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
  private token(id: string, email: string, duration: string): string {
    return jwt.sign({ id, email }, process.env.SECRET, { expiresIn: duration });
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
      const token = this.token(id, email, '7d');
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

  async logout(request: Request): Promise<IResponse> {
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

  async changePassword(
    request: Request,
    userId: string,
    data: ChangePasswordDTO,
  ): Promise<IResponse> {
    const bearerToken: any = request.headers.authorization.split(' ')[1];
    const { currentPassword, newPassword, confirmPassword } = data;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const passwordMatch = await this.checkPassword(
      currentPassword,
      user.password,
    );
    if (!passwordMatch) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (newPassword !== confirmPassword) {
      throw new HttpException(
        'New password and confirm password do not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (currentPassword === newPassword) {
      throw new HttpException(
        'Current password and new password should be different',
        HttpStatus.BAD_REQUEST,
      );
    }

    // update password (hash updated password before updating)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(
      { id: userId },
      { password: hashedPassword },
    );

    // invalidate current token
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(InvalidatedTokenEntity)
      .values({ token: bearerToken })
      .execute();

    return this.responseFormat('Password changed successfully');
  }

  async forgotPassword(data: ForgotPasswordDTO) {
    const { email } = data;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('Email does not exist', HttpStatus.BAD_REQUEST);
    }
    const { id } = user;
    const token = this.token(id, email, '24h');

    const host = process.env.HOST || '127.0.0.1';
    const port = process.env.PORT || 8080;

    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    const message: MailData = {
      to: email,
      from: 'no-reply@memoireapp.com',
      subject: `Hi, ${user.name}! Having Trouble Signing In? 😊`,
      html: resetPasswordTemplate(host, port, token),
    };
    await sendGrid.send(message);
    return this.responseFormat(
      'Password reset email has been sent to the user',
    );
  }
}
