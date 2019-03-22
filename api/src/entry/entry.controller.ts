import { config } from 'dotenv';
import { Controller, Get } from '@nestjs/common';
import { EntryService } from './entry.service';

config();

@Controller(`${process.env.BASE_PATH}/entries`)
export class EntryController {
  constructor(private entryService: EntryService) {}

  @Get()
  getAllEntries() {
    return this.entryService.getAll();
  }
}
