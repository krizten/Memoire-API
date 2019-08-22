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
import { IResponse } from '../interfaces/response.interface';
import { LoginDTO } from '../dto/login.dto';
import { SignupDTO } from '../dto/signup.dto';
import { LogoutTokenEntity } from './logout-token.entity';
import { ResetTokenEntity } from './reset-token.entity';
import { resetPasswordTemplate } from './reset-pwd-template';
import { ChangePasswordDTO } from '../dto/change-password.dto';
import { EmailDTO } from '../dto/email.dto';
import { ResetPasswordDTO } from '../dto/reset-password.dto';

config();

interface ResponseOptions {
  summary: string;
  user?: UserEntity;
  status?: number;
  showToken?: boolean;
  account?: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(LogoutTokenEntity)
    private logoutTokenRepository: Repository<LogoutTokenEntity>,
  ) {}

  // get token
  private token(id: string, email: string, duration: string): string {
    return jwt.sign({ id, email }, process.env.SECRET, { expiresIn: duration });
  }

  // confirm password
  private async checkPassword(attempt: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(attempt, hash);
  }

  private async verifyToken(token: string): Promise<string | object> {
    try {
      const decodedToken = await jwt.verify(token, process.env.SECRET);
      return decodedToken;
    } catch (error) {
      const message = `Token error: ${error.message || error.name}`;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }

  private async confirmToken(token: string): Promise<void> {
    const resetToken = await getConnection()
      .createQueryBuilder()
      .select('token')
      .from(ResetTokenEntity, 'token')
      .where('token.token = :token', { token })
      .getOne();

    if (!resetToken) {
      throw new HttpException(
        'Invalid Token: reset password token is invalid.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const usedToken = await getConnection()
      .createQueryBuilder()
      .select('token')
      .from(LogoutTokenEntity, 'token')
      .where('token.token = :token', { token })
      .getOne();

    if (usedToken) {
      throw new HttpException(
        'Invalid Token: token has been used for a previous password reset.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // format response to standard in specfications
  private responseFormat({
    summary,
    user,
    status = HttpStatus.OK,
    showToken = false,
    account = false,
  }: ResponseOptions): IResponse {

    if (user) {
      const { id, created, email, avatar, bio, gender, dateOfBirth, entries, name } = user;
      const token = this.token(id, email, '7d');
      let data: any = { id, created, email };

      if (showToken) {
        data = { ...data, ...{ token } };
      }

      if (account) {
        data = { name, email, dateOfBirth, gender, avatar, bio, entriesTillDate: entries.length };
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
    const { email, acceptTerms } = data;
    if (!acceptTerms) {
      throw new HttpException('User must accept terms and conditions', HttpStatus.BAD_REQUEST);
    }
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException(`Email already in use.`, HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return this.responseFormat({
      summary: 'Signup successful',
      user,
      status: HttpStatus.CREATED,
    });
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
    return this.responseFormat({
      summary: 'Login successful',
      user,
      showToken: true,
    });
  }

  async logout(request: Request): Promise<IResponse> {
    const bearerToken: any = request.headers.authorization.split(' ')[1];

    const token = await this.logoutTokenRepository.findOne({
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
      .into(LogoutTokenEntity)
      .values({ token: bearerToken })
      .execute();
    return this.responseFormat({
      summary: 'Logout successful',
    });
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
      .into(LogoutTokenEntity)
      .values({ token: bearerToken })
      .execute();

    return this.responseFormat({ summary: 'Password changed successfully' });
  }

  async forgotPassword(data: EmailDTO): Promise<IResponse> {
    const { email } = data;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('Email does not exist', HttpStatus.BAD_REQUEST);
    }
    const { id } = user;
    const token = this.token(id, email, '24h');

    const host = process.env.HOST || '127.0.0.1';
    const port = process.env.PORT || 8080;

    // add token to reset-token table
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(ResetTokenEntity)
      .values({ token })
      .execute();

    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    const message: MailData = {
      to: email,
      from: 'no-reply@memoireapp.com',
      subject: `Hi, ${user.name}! Having Trouble Signing In? 😊`,
      html: resetPasswordTemplate(host, port, token),
    };
    await sendGrid.send(message);

    return this.responseFormat({
      summary: 'Password reset email has been sent to the user',
    });
  }

  async resetPassword(
    token: string,
    data: ResetPasswordDTO,
  ): Promise<IResponse> {
    await this.confirmToken(token);

    const user: any = await this.verifyToken(token);
    const { newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      throw new HttpException(
        'New password and confirm password do not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { id } = user;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update({ id }, { password: hashedPassword });

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(LogoutTokenEntity)
      .values({ token })
      .execute();

    return this.responseFormat({ summary: 'Password reset was successful' });
  }
}
