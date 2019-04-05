import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { EntryEntity } from './entry.entity';
import { EntryDTO } from 'src/dto/entry.dto';
import { IResponse } from 'src/interfaces/response.interface';
import { UserEntity } from 'src/user/user.entity';
import { PasswordDTO } from 'src/dto/password.dto';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(EntryEntity)
    private entryRepository: Repository<EntryEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // format response to standard in specfications
  private responseFormat(
    summary: string,
    data?: any,
    status: number = HttpStatus.OK,
  ): IResponse {
    return {
      summary,
      success: true,
      status,
      data,
    };
  }

  // validate uuid. [regex: Jake Taylor (https://gist.github.com/bugventure/f71337e3927c34132b9a)]
  private validateUUID(uuid: string) {
    const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
    if (!uuidV4Regex.test(uuid)) {
      throw new HttpException('Invalid Entry ID', HttpStatus.BAD_REQUEST);
    }
  }

  private confirmAuthorship(userId: string, entry: EntryEntity) {
    if (userId !== entry.author.id) {
      throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
    }
  }

  // format response data
  private formatResponseData(entry: EntryEntity) {
    return { ...entry, author: this.formatAuthorData(entry.author) };
  }

  // format author data
  private formatAuthorData(author: UserEntity) {
    const { id } = author;
    return id;
  }

  async getAll(userId: string): Promise<IResponse> {
    const author = await this.userRepository.findOne({ where: { id: userId } });
    const entries = await this.entryRepository.find({
      where: { author },
      relations: ['author'],
    });
    return this.responseFormat(
      'Request was successful',
      entries.map(entry => this.formatResponseData(entry)),
    );
  }

  async getOne(userId: string, id: string): Promise<IResponse> {
    this.validateUUID(id);
    const author = await this.userRepository.findOne({ where: { id: userId } });
    const entry = await this.entryRepository.findOne({
      where: { id, author },
      relations: ['author'],
    });
    if (!entry) {
      throw new HttpException(
        'Entry not found. Try a different ID',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.responseFormat(
      'Request was successful',
      this.formatResponseData(entry),
    );
  }

  async add(userId: string, data: EntryDTO): Promise<IResponse> {
    const author = await this.userRepository.findOne({ where: { id: userId } });
    const entry = await this.entryRepository.create({ ...data, author });
    await this.entryRepository.save(entry);
    return this.responseFormat(
      'Entry created successfully.',
      this.formatResponseData(entry),
      HttpStatus.CREATED,
    );
  }

  async edit(
    userId: string,
    id: string,
    data: Partial<EntryDTO>,
  ): Promise<IResponse> {
    this.validateUUID(id);
    let entry = await this.entryRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!entry) {
      throw new HttpException('Entry not found', HttpStatus.NOT_FOUND);
    }
    this.confirmAuthorship(userId, entry);
    await this.entryRepository.update({ id }, data);
    entry = await this.entryRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    return this.responseFormat(
      'Entry updated successfully',
      this.formatResponseData(entry),
    );
  }

  async delete(userId: string, id: string): Promise<IResponse> {
    this.validateUUID(id);
    const entry = await this.entryRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!entry) {
      throw new HttpException('Entry not found', HttpStatus.NOT_FOUND);
    }
    this.confirmAuthorship(userId, entry);
    await this.entryRepository.delete({ id });
    return this.responseFormat('Entry deleted successfully');
  }

  async deleteAll(userId: string, data: PasswordDTO) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const { password } = data;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    }

    await this.entryRepository.delete({ author: user });

    return this.responseFormat('All entries deleted successfully');
  }
}
