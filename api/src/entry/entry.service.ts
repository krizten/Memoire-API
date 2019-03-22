import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EntryEntity } from './entry.entity';
import { Entry } from 'src/types/entry';
import { EntryDTO } from 'src/dto/entry';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(EntryEntity)
    private entryRepository: Repository<EntryEntity>,
  ) {}

  async getAll(): Promise<Entry[]> {
    return await this.entryRepository.find();
  }

  async getOne(id: string): Promise<Entry> {
    return await this.entryRepository.findOne({ where: { id }});
  }

  async add(data: EntryDTO) {
    const entry = await this.entryRepository.create(data);
    await this.entryRepository.save(entry);
    return entry;
  }
}
