import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EntryEntity } from './entry.entity';
import { EntryDTO } from 'src/dto/entry';
import { IResponse } from 'src/types/response';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(EntryEntity)
    private entryRepository: Repository<EntryEntity>,
  ) {}

  // format response to standard in specfications
  private responseFormat(
    summary: string,
    data?: EntryEntity | EntryEntity[],
    status: number = HttpStatus.OK,
  ): IResponse {
    return {
      summary,
      success: true,
      status,
      data,
    };
  }

  async getAll(): Promise<IResponse> {
    const entries = await this.entryRepository.find();
    return this.responseFormat('Request was successful', entries);
  }

  async getOne(id: string): Promise<IResponse> {
    const entry = await this.entryRepository.findOne({ where: { id } });
    if (!entry) {
      throw new HttpException(
        'Entry not found. Try a different ID',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.responseFormat('Request was successful', entry);
  }

  async add(data: EntryDTO): Promise<IResponse> {
    const entry = await this.entryRepository.create(data);
    await this.entryRepository.save(entry);
    return this.responseFormat(
      'Entry created successfully.',
      entry,
      HttpStatus.CREATED,
    );
  }

  async edit(id: string, data: Partial<EntryDTO>): Promise<IResponse> {
    let entry = await this.entryRepository.findOne({ where: { id } });
    if (!entry) {
      throw new HttpException('Entry not found', HttpStatus.NOT_FOUND);
    }
    await this.entryRepository.update({ id }, data);
    entry = await this.entryRepository.findOne({ where: { id } });

    return this.responseFormat('Entry updated successfully', entry);
  }

  async delete(id: string): Promise<IResponse> {
    const entry = await this.entryRepository.delete({ id });
    if (!entry) {
      throw new HttpException('Entry not found', HttpStatus.NOT_FOUND);
    }
    return this.responseFormat('Entry deleted successfully');
  }
}
