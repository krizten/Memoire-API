import { config } from 'dotenv';
import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';

import { FileLogger } from 'src/shared/file-logger.service';
import { EntryService } from './entry.service';
import { EntryDTO } from 'src/dto/entry';

config();

@Controller(`${process.env.BASE_PATH}/entries`)
export class EntryController {
  constructor(private entryService: EntryService) {}

  @Get()
  getAllEntries() {
    return this.entryService.getAll();
  }

  @Get(':id')
  getEntry(@Param('id') id: string) {
    return this.entryService.getOne(id);
  }

  @Post()
  addEntry(@Body() data: EntryDTO) {
    FileLogger.log(data);
    return this.entryService.add(data);
  }

  @Put(':id')
  editEntry(@Param('id') id: string, @Body() data: Partial<EntryDTO>) {
    return this.entryService.edit(id, data);
  }
}
