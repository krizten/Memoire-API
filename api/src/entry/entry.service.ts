import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EntryEntity } from './entry.entity';
import { IEntry } from 'src/types/entry';
import { EntryDTO } from 'src/dto/entry';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(EntryEntity)
    private entryRepository: Repository<EntryEntity>,
  ) {}

  async getAll(): Promise<IEntry[]> {
    return await this.entryRepository.find();
  }

  async getOne(id: string): Promise<IEntry> {
    return await this.entryRepository.findOne({ where: { id }});
  }

  async add(data: EntryDTO): Promise<IEntry> {
    const entry = await this.entryRepository.create(data);
    await this.entryRepository.save(entry);
    return entry;
  }

  async edit(id: string, data: Partial<EntryDTO>): Promise<IEntry> {
    let idea = await this.entryRepository.findOne({ where: { id }});
    await this.entryRepository.update({ id }, data);
    idea = await this.entryRepository.findOne({ where: { id }});

    return idea;
  }
}
